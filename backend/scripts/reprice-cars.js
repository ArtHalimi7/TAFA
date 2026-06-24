/**
 * reprice-cars.js — One-time migration: re-price all existing cars
 * using the new tiered pricing engine.
 *
 * Run AFTER: npm run db:init
 * Run with:  node backend/scripts/reprice-cars.js
 *
 * For cars WITH encar_id: reverse-engineers the original KRW price
 *   from the stored EUR price (old formula: ceil((krw*0.00057+2000)/100)*100)
 * For cars WITHOUT encar_id: skipped (manual entries)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const db = require('../config/db_connect');
const pricingService = require('../services/pricingService');

// Live EUR/KRW rate — fetched once
async function getRate() {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=KRW', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    console.log(`💱 Live EUR/KRW rate: ${body.rates.KRW}`);
    return body.rates.KRW;
  } catch (err) {
    console.warn(`⚠️ Failed to fetch rate (${err.message}), using 1750`);
    return 1750;
  }
}

/**
 * Reverse-engineer the original KRW price from the old formula:
 *   storedPrice = ceil((krw * 0.00057 + 2000) / 100) * 100
 * The ceiling rounding creates a range of possible KRW values.
 * We use the midpoint of that range.
 */
function reverseEngineerKrw(storedEurPrice) {
  const maxKrw = (storedEurPrice - 2000) / 0.00057;
  const minKrw = (storedEurPrice - 2100) / 0.00057;
  return Math.round((minKrw + maxKrw) / 2);
}

/**
 * Guess the brand from the car name (first word before any space/number).
 */
function guessBrand(name) {
  if (!name) return null;
  const first = name.split(/[\s/]/)[0];
  const known = ['Hyundai','Kia','Genesis','BMW','Mercedes','Audi','Volkswagen','Porsche',
    'Chevrolet','Renault','SsangYong','Toyota','Lexus','Honda','Ford','Jeep','Land Rover',
    'Volvo','Maserati','Ferrari','Lamborghini','Bentley','Rolls-Royce','Mini','Peugeot',
    'Jaguar','Cadillac','Chrysler','Mitsubishi','Nissan','Mazda','Subaru','Dodge','Tesla'];
  if (known.includes(first)) return first;
  // Handle "Mercedes-Benz"
  if (name.startsWith('Mercedes-Benz') || name.startsWith('Mercedes')) return 'Mercedes';
  if (name.startsWith('Land Rover')) return 'Land Rover';
  if (name.startsWith('Alfa Romeo')) return 'Alfa Romeo';
  if (name.startsWith('Aston Martin')) return 'Aston Martin';
  return null;
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  REPRICING EXISTING CARS');
  console.log('═══════════════════════════════════════════════════════\n');

  const rate = await getRate();

  // Get all cars with encar_id and a price
  const [rows] = await db.query(
    "SELECT id, encar_id, name, brand, price, encar_price_krw FROM cars WHERE encar_id IS NOT NULL AND price > 0 ORDER BY id"
  );
  console.log(`📋 Found ${rows.length} cars with Encar IDs\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const car of rows) {
    try {
      // Use stored KRW price if available, otherwise reverse-engineer
      let krwPrice;
      if (car.encar_price_krw && car.encar_price_krw > 0) {
        krwPrice = car.encar_price_krw;
      } else {
        krwPrice = reverseEngineerKrw(Number(car.price));
      }

      // Guess brand if not set in DB
      const brand = car.brand || guessBrand(car.name);

      const result = pricingService.calculatePrice(krwPrice, rate, {
        brand,
        _debug: true,
      });

      const oldPrice = Number(car.price);
      const newPrice = result.listingPrice;

      if (oldPrice === newPrice) {
        // Only update pricing_data if price didn't change
        await db.query(
          "UPDATE cars SET encar_price_krw = ?, pricing_data = ? WHERE id = ?",
          [krwPrice, JSON.stringify(result._debug), car.id]
        );
        console.log(`  = ${car.name.padEnd(30)} ${String(oldPrice).padStart(6)} € → ${String(newPrice).padStart(6)} € (same)`);
      } else {
        await db.query(
          "UPDATE cars SET encar_price_krw = ?, price = ?, pricing_data = ? WHERE id = ?",
          [krwPrice, newPrice, JSON.stringify(result._debug), car.id]
        );
        const diff = newPrice - oldPrice;
        console.log(`  ${diff > 0 ? '+' : ''}${String(diff).padStart(5)} ${car.name.padEnd(30)} ${String(oldPrice).padStart(6)} € → ${String(newPrice).padStart(6)} € (${result.tier}, ${result.profit.marginOnRevenue})`);
      }

      updated++;
    } catch (err) {
      console.error(`  ❌ ID ${car.id} ${car.name}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n✅ ${updated} updated, ${skipped} skipped, ${errors} errors`);
  console.log('═══════════════════════════════════════════════════════\n');
  process.exit(errors > 0 ? 1 : 0);
}

main();

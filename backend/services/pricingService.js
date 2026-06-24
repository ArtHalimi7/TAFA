/**
 * pricingService.js — tiered, zero-loss-guaranteed pricing engine
 *
 * Takes a raw Encar KRW price + live EUR/KRW rate and outputs a final
 * CIF Durrës listing price with baked-in profit, FX buffer, insurance,
 * inspection, and contingency reserves.
 *
 * Brand strategy — three tiers of competitiveness:
 *   - ADVANTAGE brands (Genesis, Kia, Hyundai):  marginMid + 2 % boost
 *   - COMPETITIVE brands (BMW, Audi, Mercedes…):  marginMid (market-aligned)
 *   - OTHER brands:                               marginMin (safe floor)
 * All rounding is CEILING to the nearest €100.
 */

// ---------------------------------------------------------------------------
// Tier definitions
// ---------------------------------------------------------------------------
// minKrw/maxKrw define the tier by raw Encar price in KRW.
// margin values = profit ÷ listingPrice (industry standard).
// All cost layers use conservative (high) estimates.

const TIERS = [
  {
    name: 'Budget',
    minKrw: 0,
    maxKrw: 10_000_000,
    marginMin: 0.010,             // 1.0 % — safe floor (others)
    marginMid: 0.020,             // 2.0 % — competitive (German brands)
    inspectionCost: 100,
    insuranceRate: 0.004,         // 0.4 % of vehicle value
  },
  {
    name: 'Standard',
    minKrw: 10_000_000,
    maxKrw: 25_000_000,
    marginMin: 0.015,
    marginMid: 0.025,
    inspectionCost: 150,
    insuranceRate: 0.005,
  },
  {
    name: 'Premium',
    minKrw: 25_000_000,
    maxKrw: 60_000_000,
    marginMin: 0.015,
    marginMid: 0.020,
    inspectionCost: 200,
    insuranceRate: 0.007,
  },
  {
    name: 'Luxury',
    minKrw: 60_000_000,
    maxKrw: Infinity,
    marginMin: 0.030,
    marginMid: 0.040,
    inspectionCost: 400,
    insuranceRate: 0.008,
  },
];

// ---------------------------------------------------------------------------
// Fixed cost parameters (lean estimates)
// ---------------------------------------------------------------------------
const SHIPPING_COST = 1600;        // Busan → Durrës Ro-Ro freight
const KOREA_LOGISTICS = 200;       // domestic transport → Busan port
const CIF_FEES = 200;              // port handling, docs, customs broker
const FX_BUFFER_RATE = 0;          // dealer assumes FX risk (not passed to customer)
const LOCAL_DELIVERY_FEE = 350;    // Prishtina delivery
const MIN_ABSOLUTE_PROFIT = 500;   // minimum net profit floor (EUR)

// ---------------------------------------------------------------------------
// Brand strategy — three tiers of competitiveness
// ---------------------------------------------------------------------------
// ADVANTAGE:  thin competitor catalogue → can push marginMid + boost
const ADVANTAGE_BRANDS = new Set([
  'Genesis', 'Kia', 'Hyundai',
]);
// COMPETITIVE: market-aligned pricing, stay close to competitor (slightly cheaper)
const COMPETITIVE_BRANDS = new Set([
  'Audi', 'BMW', 'Mercedes', 'Mercedes-Benz', 'Porsche', 'Volkswagen',
]);

const ADVANTAGE_MARGIN_BOOST = 0.005;   // +0.5 % on top of marginMid

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Determine the pricing tier from a raw KRW price.
 */
function getTier(krwPrice) {
  for (const tier of TIERS) {
    if (krwPrice >= tier.minKrw && krwPrice < tier.maxKrw) return tier;
  }
  return TIERS[TIERS.length - 1]; // Luxury (catch-all)
}

/**
 * Resolve the base margin rate for a given tier and brand.
 *
 * Strategy:
 *   ADVANTAGE  → marginMid + boost (above market — thin competition)
 *   COMPETITIVE → marginMid         (market-aligned — slightly below competitor)
 *   OTHER/ none → marginMin         (safe floor — unknown brands)
 */
function resolveBaseMargin(tier, brand) {
  if (!brand) return tier.marginMin;
  const b = brand.trim();
  if (ADVANTAGE_BRANDS.has(b)) return tier.marginMid + ADVANTAGE_MARGIN_BOOST;
  if (COMPETITIVE_BRANDS.has(b)) return tier.marginMid;
  return tier.marginMin;
}

/**
 * Round up to the next multiple — always in favour of profit.
 */
function ceilMultiple(value, multiple = 100) {
  return Math.ceil(value / multiple) * multiple;
}

// ---------------------------------------------------------------------------
// Core pricing function
// ---------------------------------------------------------------------------

/**
 * Calculate the final CIF Durrës listing price for a vehicle.
 *
 * @param {number} krwPrice          Raw Encar price in KRW (full KRW, NOT 10,000x)
 * @param {number} eurKrwRate        Live exchange rate (1 EUR = X KRW)
 * @param {object} [options]
 * @param {number} [options.marginOverride]  Force a specific margin rate (0‑1)
 * @param {string} [options.brand]            Vehicle brand for competitive adjustment
 * @param {number} [options.shippingCost]     Override ocean freight cost
 * @param {number} [options.koreaLogistics]   Override domestic logistics
 * @param {number} [options.cifFees]          Override CIF handling fees
 * @param {number} [options.inspectionCost]   Override inspection cost
 * @param {number} [options.contingency]      Override contingency reserve
 * @param {number} [options.deliveryFee]      Override local delivery fee
 * @param {boolean}[options._debug]           Include full cost breakdown
 *
 * @returns {object} { listingPrice, pricingBasis, tier, profit, deliveryFee, costBreakdown?, warnings? }
 */
function calculatePrice(krwPrice, eurKrwRate, options = {}) {
  const warnings = [];

  // --- Input validation ---------------------------------------------------
  if (!krwPrice || krwPrice <= 0) {
    throw new Error(`Invalid KRW price: ${krwPrice}`);
  }
  if (!eurKrwRate || eurKrwRate <= 0) {
    throw new Error(`Invalid EUR/KRW rate: ${eurKrwRate}`);
  }

  // --- Tier selection ----------------------------------------------------
  const tier = getTier(krwPrice);

  // If marginOverride is set, use it directly — otherwise resolve via brand strategy
  let marginRate;
  if (options.marginOverride !== undefined) {
    marginRate = options.marginOverride;
    if (marginRate < 0) {
      warnings.push('marginOverride is negative — clamped to tier.marginMin');
      marginRate = tier.marginMin;
    }
  } else {
    marginRate = resolveBaseMargin(tier, options.brand);
  }

  // Cap margin rate to avoid absurd pricing
  if (marginRate > 0.40) {
    warnings.push('marginOverride exceeds 40 % — capped at 40 %');
    marginRate = 0.40;
  }

  // --- Cost layer calculation (all conservative / high-end) ---------------
  const vehicleCost = krwPrice / eurKrwRate;

  const shipping       = options.shippingCost    ?? SHIPPING_COST;
  const koreaLogistics = options.koreaLogistics  ?? KOREA_LOGISTICS;
  const cifFees        = options.cifFees         ?? CIF_FEES;
  const inspection     = options.inspectionCost  ?? tier.inspectionCost;
  const contingency    = options.contingency     ?? 0;

  const insurance      = vehicleCost * tier.insuranceRate;
  const fxBuffer       = vehicleCost * FX_BUFFER_RATE;

  const totalLandedCost =
    vehicleCost +
    koreaLogistics +
    shipping +
    cifFees +
    inspection +
    insurance +
    fxBuffer +
    contingency;

  // --- Price with margin --------------------------------------------------
  // Margin-on-revenue formula: price = landed / (1 - marginRate)
  const priceBeforeFee = totalLandedCost / (1 - marginRate);
  const deliveryFee    = options.deliveryFee ?? LOCAL_DELIVERY_FEE;

  // The delivery fee goes on top (it is a separate service line in Kosovo)
  let rawListingPrice = priceBeforeFee + deliveryFee;
  let listingPrice    = ceilMultiple(rawListingPrice, 100);

  // --- Zero-loss guarantee ------------------------------------------------
  const grossProfit = listingPrice - totalLandedCost;
  if (grossProfit < MIN_ABSOLUTE_PROFIT) {
    // Force minimum profit by bumping the listing price
    const forcedPrice = ceilMultiple(totalLandedCost + deliveryFee + MIN_ABSOLUTE_PROFIT, 100);
    warnings.push(
      `Calculated profit (${Math.round(grossProfit)} €) below floor ` +
      `(${MIN_ABSOLUTE_PROFIT} €) — forced price from ${listingPrice} € to ${forcedPrice} €`
    );
    listingPrice = forcedPrice;
  }

  // Final sanity check — never sell at or below landed cost
  if (listingPrice <= totalLandedCost) {
    throw new Error(
      `ZERO-LOSS VIOLATION: listing ${listingPrice} € ≤ landed ${Math.round(totalLandedCost)} € ` +
      `for ${krwPrice} KRW @ rate ${eurKrwRate}. Check cost parameters.`
    );
  }

  // --- Build result -------------------------------------------------------
  const finalProfit        = listingPrice - totalLandedCost;
  const actualMarginOnRev  = finalProfit / listingPrice;

  const result = {
    listingPrice,
    pricingBasis: 'CIF Durrës',
    tier: tier.name,
    profit: {
      amount:       Math.round(finalProfit),
      marginOnRevenue: Number(actualMarginOnRev * 100).toFixed(1) + ' %',
      marginOnCost: Number((finalProfit / totalLandedCost) * 100).toFixed(1) + ' %',
    },
    deliveryFee,
  };

  if (options._debug) {
    result._debug = {
      vehicleCostEur:     Math.round(vehicleCost),
      koreaLogistics,
      oceanFreight:       shipping,
      cifFees,
      inspection,
      insurance:          Math.round(insurance),
      fxBuffer:           Math.round(fxBuffer),
      contingency,
      totalLandedCost:    Math.round(totalLandedCost),
      marginRateUsed:     Number(marginRate * 100).toFixed(1) + ' %',
      marginStrategy:     options.marginOverride !== undefined
        ? 'override'
        : options.brand && ADVANTAGE_BRANDS.has(options.brand.trim())
          ? `advantage (marginMid + ${ADVANTAGE_MARGIN_BOOST * 100} %)`
          : options.brand && COMPETITIVE_BRANDS.has(options.brand.trim())
            ? 'competitive (marginMid)'
            : 'safe (marginMin)',
      eurKrwRateUsed:     eurKrwRate,
      krwPrice,
      tierConfig: {
        name: tier.name,
        marginMin:    tier.marginMin,
        marginMid:    tier.marginMid,
        minKrw:       tier.minKrw,
        maxKrw:       tier.maxKrw === Infinity ? '∞' : tier.maxKrw,
        inspection:   tier.inspectionCost,
        insurancePct: tier.insuranceRate,
        contingency:  contingency,
      },
    };
  }

  if (warnings.length > 0) {
    result.warnings = warnings;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Batch processor
// ---------------------------------------------------------------------------

/**
 * Process an array of vehicles through the pricing engine.
 *
 * @param {Array}  vehicles     Array of { krwPrice, brand?, overrides?, ... }
 * @param {number} eurKrwRate   Live exchange rate
 * @returns {Array}              Same array with pricing fields merged in
 */
function processCatalogue(vehicles, eurKrwRate) {
  if (!Array.isArray(vehicles) || vehicles.length === 0) return [];

  return vehicles.map((v) => {
    const overrides = v.overrides || {};
    const result = calculatePrice(
      v.krwPrice,
      eurKrwRate,
      {
        brand:          v.brand,
        marginOverride: overrides.marginOverride,
        shippingCost:   overrides.shippingCost,
        koreaLogistics: overrides.koreaLogistics,
        cifFees:        overrides.cifFees,
        inspectionCost: overrides.inspectionCost,
        contingency:    overrides.contingency,
        deliveryFee:    overrides.deliveryFee,
        _debug:         overrides._debug,
      },
    );

    return { ...v, ...result };
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
module.exports = {
  calculatePrice,
  processCatalogue,
  TIERS,
  getTier,
  // constants exposed for testing / dashboard
  CONSTANTS: {
    SHIPPING_COST,
    KOREA_LOGISTICS,
    CIF_FEES,
    FX_BUFFER_RATE,
    LOCAL_DELIVERY_FEE,
    MIN_ABSOLUTE_PROFIT,
  },
};

#!/usr/bin/env node

require("dotenv").config();
const db = require("../config/db_connect");

async function main() {
  console.log("🚀 Starting Encar Price Backfill Migration (Durrës Pricing model)");
  try {
    const [rows] = await db.query("SELECT id, name, price, discount_price, encar_id FROM cars WHERE encar_id IS NOT NULL");
    console.log(`Found ${rows.length} cars with encar_id to process.`);

    let updatedCount = 0;
    for (const row of rows) {
      const oldPrice = parseFloat(row.price);
      if (isNaN(oldPrice) || oldPrice <= 0) {
        console.warn(`⚠️ Car ID ${row.id} (${row.name}) has invalid price: ${row.price}, skipping.`);
        continue;
      }

      // Reverse calculate original KRW from old price (old price = krw / 1500)
      const estimatedKrw = oldPrice * 1500;
      // Apply new formula: krw * 0.00057 + 2000, rounded up to nearest 100
      const baseEur = estimatedKrw * 0.00057;
      const withMarkup = baseEur + 2000;
      const newPrice = Math.ceil(withMarkup / 100) * 100;

      // Handle discount price if set
      let newDiscountPrice = null;
      if (row.discount_price) {
        const oldDiscountPrice = parseFloat(row.discount_price);
        if (!isNaN(oldDiscountPrice) && oldDiscountPrice > 0) {
          const estimatedDiscountKrw = oldDiscountPrice * 1500;
          const baseDiscountEur = estimatedDiscountKrw * 0.00057;
          const withDiscountMarkup = baseDiscountEur + 2000;
          newDiscountPrice = Math.ceil(withDiscountMarkup / 100) * 100;
        }
      }

      // Update the database
      await db.query(
        "UPDATE cars SET price = ?, discount_price = ? WHERE id = ?",
        [newPrice, newDiscountPrice, row.id]
      );

      console.log(`✅ Updated ${row.name} (ID: ${row.id}):`);
      console.log(`   Old Price: ${oldPrice} €  ==>  New Price (Durrës): ${newPrice} €`);
      if (newDiscountPrice) {
        console.log(`   Old Discount: ${row.discount_price} €  ==>  New Discount (Durrës): ${newDiscountPrice} €`);
      }
      updatedCount++;
    }

    console.log(`\n🎉 Backfill complete! Successfully updated ${updatedCount} cars.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Backfill failed:", error);
    process.exit(1);
  }
}

main();

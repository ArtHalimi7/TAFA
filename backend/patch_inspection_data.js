require('dotenv').config({ path: 'c:/Projects/TAFA/.env' });
const db = require('./config/db_connect');

const detailHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Referer": "https://fem.encar.com/",
  "Accept": "application/json",
  "Accept-Language": "ko-KR,ko;q=0.9"
};

async function fetchAndPatchInspection() {
  // Get all encar cars missing inspection data
  const [cars] = await db.query(
    "SELECT id, encar_id, name FROM cars WHERE encar_id IS NOT NULL"
  );

  console.log(`Found ${cars.length} Encar cars to process`);

  for (const car of cars) {
    // Extract the raw listing ID from encar_id = "encar_XXXXXXXX"
    const listingId = car.encar_id.replace('encar_', '');

    try {
      // Step 1: Get vehicle detail to find vehicleId
      const detailUrl = `https://api.encar.com/v1/readside/vehicle/${listingId}?include=MANAGE,SPEC,CONDITION,ADVERTISEMENT`;
      const detailRes = await fetch(detailUrl, { headers: detailHeaders });

      if (!detailRes.ok) {
        console.warn(`[${car.name}] Detail fetch failed: ${detailRes.status}`);
        continue;
      }

      const detailData = await detailRes.json();
      const vehicleId = detailData.vehicleId || listingId;

      // Step 2: Fetch inspection data using vehicleId
      const inspUrl = `https://api.encar.com/v1/readside/inspection/vehicle/${vehicleId}`;
      const inspRes = await fetch(inspUrl, { headers: detailHeaders });

      if (!inspRes.ok) {
        console.warn(`[${car.name}] Inspection fetch returned ${inspRes.status} (no inspection record)`);
        continue;
      }

      const inspData = await inspRes.json();
      const inspJson = JSON.stringify(inspData);

      await db.query(
        "UPDATE cars SET inspection_data = ? WHERE id = ?",
        [inspJson, car.id]
      );

      console.log(`✅ Patched inspection data for [${car.name}] (outers: ${inspData.outers?.length ?? 0}, inners: ${inspData.inners?.length ?? 0})`);

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));

    } catch (err) {
      console.error(`❌ Error patching [${car.name}]:`, err.message);
    }
  }

  console.log('\nDone! All cars patched.');
  process.exit(0);
}

fetchAndPatchInspection().catch(err => {
  console.error(err);
  process.exit(1);
});

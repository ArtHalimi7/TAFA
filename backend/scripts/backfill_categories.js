require('dotenv').config({ path: 'c:/Projects/TAFA/.env' });
const db = require('../config/db_connect');

// ── Maps (must match encarService.js) ──────────────────────────────────────

const BODY_TYPE_MAP = {
  "SUV": "SUV",
  "대형차": "Sedan",
  "중형차": "Sedan",
  "준중형차": "Sedan",
  "소형차": "Haxhbek",
  "경차": "Haxhbek",
  "승합차": "Minivan",
  "화물차": "Pickup",
  "RV": "Minivan",
  "스포츠카": "Kupe",
  "쿠페": "Kupe",
  "컨버터블": "Kabriolet",
  "리무진": "Sedan",
  "MPV": "Minivan",
  "픽업트럭": "Pickup",
};

const ALLOWED_CATEGORIES = ["SUV", "Sedan", "Kupe", "Kabriolet", "Haxhbek", "Karavan", "Minivan", "Pickup", "Elektrik", "Performancë"];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJson(url, headers) {
  const res = await fetch(url, { headers });
  if (!res.ok) return null;
  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────
async function backfillCars() {
  console.log("🔍 Fetching all Encar imported cars from DB...");
  const [cars] = await db.query(
    "SELECT id, encar_id, name, category, brand FROM cars WHERE encar_id IS NOT NULL ORDER BY id"
  );
  console.log(`Found ${cars.length} Encar cars`);

  let catUpdated = 0;
  let catSkipped = 0;
  let catErrors = 0;

  const detailHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://fem.encar.com/",
    "Accept": "application/json",
    "Accept-Language": "ko-KR,ko;q=0.9"
  };

  for (const car of cars) {
    const listingId = car.encar_id.replace("encar_", "");
    console.log(`\n[${car.name}] encar_id=${listingId} category="${car.category}"`);

    // ── Category update ──
    try {
      const data = await fetchJson(
        `https://api.encar.com/v1/readside/vehicle/${listingId}?include=SPEC`,
        detailHeaders
      );

      if (!data) {
        console.log(`  ⚠️ Detail API failed, skipping`);
        catSkipped++;
        await sleep(500);
        continue;
      }

      const bodyName = data.spec?.bodyName;
      if (!bodyName) {
        console.log(`  ⚠️ No bodyName in spec, skipping`);
        catSkipped++;
        await sleep(500);
        continue;
      }

      const correctCat = BODY_TYPE_MAP[bodyName];
      if (!correctCat || !ALLOWED_CATEGORIES.includes(correctCat)) {
        console.log(`  ⚠️ Unknown bodyName "${bodyName}", skipping`);
        catSkipped++;
        await sleep(500);
        continue;
      }

      if (car.category === correctCat) {
        console.log(`  🏷️ Category already correct ("${correctCat}")`);
        catSkipped++;
      } else {
        await db.query("UPDATE cars SET category = ? WHERE id = ?", [correctCat, car.id]);
        console.log(`  🏷️ Category updated: "${car.category}" → "${correctCat}"`);
        catUpdated++;
      }
    } catch (err) {
      console.error(`  ❌ Category error: ${err.message}`);
      catErrors++;
    }

    await sleep(500);
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Categories updated: ${catUpdated}`);
  console.log(`   Categories skipped: ${catSkipped}`);
  console.log(`   Category errors:    ${catErrors}`);
  console.log(`\n📝 Note: Badge/trim info (e.g. "40 TDI") cannot be retroactively fetched`);
  console.log(`   for already-imported cars. Future syncs will include badge info in names.`);
  process.exit(0);
}

backfillCars().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

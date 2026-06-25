require('dotenv').config({ path: 'c:/Projects/TAFA/.env' });
const db = require('../config/db_connect');

const BADGE_MAP = {
  "디젤": "Diesel",
  "가솔린": "Gasoline",
  "터보": "Turbo",
  "프리미엄": "Premium",
  "익스클루시브": "Exclusive",
  "스페셜": "Special",
  "프레스티지": "Prestige",
  "프레지던트": "President",
  "마스터즈": "Masters",
  "노블레스": "Noblesse",
  "스포츠": "Sport",
  "리미티드": "Limited",
  "콰트로": "Quattro",
  "하이브리드": "Hybrid",
  "전기": "Electric",
  "LPG": "LPG",
};

// Same mapping as encarService.js
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

async function backfillCategories() {
  console.log("🔍 Fetching all Encar imported cars...");
  const [cars] = await db.query(
    "SELECT id, encar_id, name, category FROM cars WHERE encar_id IS NOT NULL ORDER BY id"
  );
  console.log(`Found ${cars.length} Encar cars`);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const car of cars) {
    const listingId = car.encar_id.replace('encar_', '');
    const currentCategory = car.category;

    console.log(`\n[${car.name}] encar_id=${listingId} current category="${currentCategory}"`);

    try {
      const url = `https://api.encar.com/v1/readside/vehicle/${listingId}?include=SPEC`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Referer": "https://fem.encar.com/",
          "Accept": "application/json",
          "Accept-Language": "ko-KR,ko;q=0.9"
        }
      });

      if (!res.ok) {
        console.warn(`  ⚠️ API returned ${res.status}, skipping`);
        skippedCount++;
        continue;
      }

      const data = await res.json();
      const bodyName = data.spec?.bodyName;

      if (!bodyName) {
        console.warn(`  ⚠️ No bodyName in API response (may no longer be listed), skipping`);
        skippedCount++;
        continue;
      }

      const correctCategory = BODY_TYPE_MAP[bodyName];
      if (!correctCategory) {
        console.warn(`  ⚠️ Unknown bodyName "${bodyName}", skipping`);
        skippedCount++;
        continue;
      }

      if (!ALLOWED_CATEGORIES.includes(correctCategory)) {
        console.warn(`  ⚠️ Mapped category "${correctCategory}" is not allowed, skipping`);
        skippedCount++;
        continue;
      }

      if (currentCategory === correctCategory) {
        console.log(`  ✅ Category already correct ("${correctCategory}")`);
        skippedCount++;
        continue;
      }

      console.log(`  🔄 Updating category "${currentCategory}" → "${correctCategory}"`);
      await db.query(
        "UPDATE cars SET category = ? WHERE id = ?",
        [correctCategory, car.id]
      );
      updatedCount++;
      console.log(`  ✅ Updated`);
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      errorCount++;
    }

    // Be kind to the Encar API
    await sleep(500);
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  console.log(`   Errors:  ${errorCount}`);
  process.exit(0);
}

backfillCategories().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

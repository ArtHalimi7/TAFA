require('dotenv').config({ path: 'c:/Projects/TAFA/.env' });
const db = require('./config/db_connect');

async function run() {
  try {
    const [rows] = await db.query("SELECT id, name, inspection_data IS NOT NULL AS has_inspection, LEFT(inspection_data, 100) AS insp_preview FROM cars ORDER BY id DESC LIMIT 5");
    console.log("Latest 5 cars:");
    rows.forEach(r => console.log(`  ID ${r.id}: ${r.name} | has_inspection=${r.has_inspection} | preview: ${r.insp_preview}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

require('dotenv').config({ path: 'c:/Projects/TAFA/.env' });
const db = require('./config/db_connect');

async function listCars() {
  try {
    const [rows] = await db.query("SELECT id, name, slug, encar_id, inspection_data IS NOT NULL AS has_inspection FROM cars WHERE encar_id IS NOT NULL");
    console.log("Imported cars in DB:");
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Error listing cars:", err);
    process.exit(1);
  }
}

listCars();

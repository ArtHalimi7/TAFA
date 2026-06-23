require('dotenv').config();
const db = require('./backend/config/db_connect');

async function run() {
  try {
    const [rows] = await db.query("SELECT id, name, price, year, mileage, encar_id FROM cars WHERE name LIKE '%Audi%'");
    console.log("Audis in our database:");
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

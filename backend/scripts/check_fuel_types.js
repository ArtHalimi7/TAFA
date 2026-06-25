const pool = require("../config/db_connect");

async function run() {
  const [rows] = await pool.query("SELECT DISTINCT fuel_type, COUNT(*) as cnt FROM cars GROUP BY fuel_type ORDER BY cnt DESC");
  console.log('Fuel types:');
  rows.forEach(r => console.log('  "' + r.fuel_type + '" -> ' + r.cnt));
  await pool.end();
}
run().catch(console.error);

require('dotenv').config({ path: 'c:/Projects/TAFA/.env' });
const pool = require('../config/db_connect');

async function run() {
  console.log('Checking fuel_type values in DB...');

  const [rows] = await pool.query(
    `SELECT fuel_type, COUNT(*) as cnt FROM cars GROUP BY fuel_type ORDER BY cnt DESC`
  );
  console.log('Current fuel types:');
  rows.forEach(r => console.log(`  "${r.fuel_type}" -> ${r.cnt}`));

  const replacements = {
    'DIESEL': 'Dizell',
    'Diesel': 'Dizell',
    'diesel': 'Dizell',
    'BENZINE': 'Benzin',
    'Benzine': 'Benzin',
    'benzine': 'Benzin',
    'GASOLINE': 'Benzin',
    'Gasoline': 'Benzin',
    'gasoline': 'Benzin',
    'Petrol': 'Benzin',
    'petrol': 'Benzin',
  };

  let totalFixed = 0;
  for (const [from, to] of Object.entries(replacements)) {
    const [result] = await pool.query(
      'UPDATE cars SET fuel_type = ? WHERE fuel_type = ?',
      [to, from]
    );
    if (result.affectedRows > 0) {
      console.log(`Fixed ${result.affectedRows} cars: "${from}" -> "${to}"`);
      totalFixed += result.affectedRows;
    }
  }

  if (totalFixed === 0) {
    console.log('No fuel types needed normalization.');
  } else {
    console.log(`Total: ${totalFixed} cars updated.`);
  }

  // Verify
  const [after] = await pool.query(
    `SELECT fuel_type, COUNT(*) as cnt FROM cars GROUP BY fuel_type ORDER BY cnt DESC`
  );
  console.log('\nFuel types after normalization:');
  after.forEach(r => console.log(`  "${r.fuel_type}" -> ${r.cnt}`));

  await pool.end();
}

run().catch(err => { console.error(err); process.exit(1); });

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mysql = require('mysql2/promise');

(async () => {
  const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
  };

  if (process.env.DB_SSL === 'true') {
    config.ssl = { rejectUnauthorized: false };
  }

  let pool;
  try {
    pool = mysql.createPool(config);

    const [rows] = await pool.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'cars' AND COLUMN_NAME = 'status'`,
      [process.env.DB_NAME]
    );

    if (rows.length > 0) {
      console.log('Column `status` already exists in `cars` table.');
      await pool.end();
      process.exit(0);
    }

    console.log('Adding `status` column to `cars` table...');
    await pool.query("ALTER TABLE cars ADD COLUMN status ENUM('active','draft','sold') DEFAULT 'active'");
    console.log('Column `status` added successfully.');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Failed to add `status` column:', err);
    if (pool) await pool.end();
    process.exit(1);
  }
})();

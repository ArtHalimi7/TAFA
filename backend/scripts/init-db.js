#!/usr/bin/env node

/**
 * Standalone Database Initialization Script
 * Run with: node backend/scripts/init-db.js
 */

require("dotenv").config();
const db = require("../config/db_connect");
const { initializeDatabase } = require("../config/db_init");

async function main() {
  console.log("\n╔════════════════════════════════════════════════════╗");
  console.log("║   TAFA Database Initialization Script              ║");
  console.log("╚════════════════════════════════════════════════════╝\n");

  try {
    console.log("📡 Connecting to database...");
    await db.getConnection();
    console.log("✅ Database connection successful\n");

    console.log("📝 Initializing tables...");
    await initializeDatabase();
    console.log("\n✅ All tables initialized successfully!\n");

    console.log("✨ Database setup complete. You can now:");
    console.log("   • Run: npm run server");
    console.log("   • Visit: http://localhost:5173/dashboard");
    console.log("   • PIN: 1234\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:");
    console.error(`   ${error.message}\n`);

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error(
        "💡 Hint: Check your database username and password in .env\n",
      );
    } else if (error.code === "ECONNREFUSED") {
      console.error(
        "💡 Hint: Ensure database server is running and accessible\n",
      );
    }

    process.exit(1);
  }
}

main();

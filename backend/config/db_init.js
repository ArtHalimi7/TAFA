const db = require("./db_connect");

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const connection = await db.getConnection();

    // Create cars table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        tagline VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        price DECIMAL(12, 2) NOT NULL,
        year INT NOT NULL,
        mileage INT DEFAULT 0,
        exterior_color VARCHAR(100),
        interior_color VARCHAR(100),
        engine VARCHAR(100),
        horsepower INT,
        torque INT,
        acceleration DECIMAL(4, 2),
        top_speed INT,
        transmission VARCHAR(100),
        drivetrain VARCHAR(100),
        fuel_type VARCHAR(50),
        mpg VARCHAR(50),
        vin VARCHAR(50) UNIQUE,
        description TEXT,
        status ENUM('active', 'draft', 'sold') DEFAULT 'draft',
        showcase_image INT DEFAULT 0,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_brand (brand),
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_year (year),
        INDEX idx_price (price)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Cars table ready");

    // Add status column if it doesn't exist (migration for existing tables)
    try {
      await connection.query(`
        ALTER TABLE cars 
        ADD COLUMN status ENUM('active', 'draft', 'sold') DEFAULT 'draft'
      `);
      console.log("✅ Added status column to cars table");
    } catch (err) {
      // Column already exists, ignore error
      if (err.code !== "ER_DUP_FIELDNAME") {
        console.log("ℹ️ Status column already exists");
      }
    }

    // Add showcase_image column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE cars 
        ADD COLUMN showcase_image INT DEFAULT 0
      `);
      console.log("✅ Added showcase_image column to cars table");
    } catch (err) {
      // Column already exists, ignore error
      if (err.code !== "ER_DUP_FIELDNAME") {
        console.log("ℹ️ Showcase_image column already exists");
      }
    }

    // Add views column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE cars 
        ADD COLUMN views INT DEFAULT 0
      `);
      console.log("✅ Added views column to cars table");
    } catch (err) {
      // Column already exists, ignore error
      if (err.code !== "ER_DUP_FIELDNAME") {
        console.log("ℹ️ Views column already exists");
      }
    }

    // Add is_featured column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE cars 
        ADD COLUMN is_featured BOOLEAN DEFAULT false
      `);
      console.log("✅ Added is_featured column to cars table");
    } catch (err) {
      // Column already exists, ignore error
      if (err.code !== "ER_DUP_FIELDNAME") {
        console.log("ℹ️ is_featured column already exists");
      }
    }

    // Add is_showcase column if it doesn't exist (for the exclusive showcase car)
    try {
      await connection.query(`
        ALTER TABLE cars 
        ADD COLUMN is_showcase BOOLEAN DEFAULT false
      `);
      console.log("✅ Added is_showcase column to cars table");
    } catch (err) {
      // Column already exists, ignore error
      if (err.code !== "ER_DUP_FIELDNAME") {
        console.log("ℹ️ is_showcase column already exists");
      }
    }

    // Add discount_price column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE cars 
        ADD COLUMN discount_price DECIMAL(12, 2) DEFAULT NULL
      `);
      console.log("✅ Added discount_price column to cars table");
    } catch (err) {
      // Column already exists, ignore error
      if (err.code !== "ER_DUP_FIELDNAME") {
        console.log("ℹ️ discount_price column already exists");
      }
    }

    // Add is_sold column if it doesn't exist (separate from status for visibility control)
    try {
      await connection.query(`
        ALTER TABLE cars 
        ADD COLUMN is_sold BOOLEAN DEFAULT false
      `);
      console.log("✅ Added is_sold column to cars table");
    } catch (err) {
      // Column already exists, ignore error
      if (err.code !== "ER_DUP_FIELDNAME") {
        console.log("ℹ️ is_sold column already exists");
      }
    }

    // Migrate existing sold status to is_sold field
    try {
      await connection.query(`
        UPDATE cars SET is_sold = 1, status = 'active' WHERE status = 'sold'
      `);
      console.log("✅ Migrated sold cars to new is_sold field");
    } catch (err) {
      console.log("ℹ️ Migration may have already been done");
    }

    // Create car_images table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS car_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT NOT NULL,
        image_url TEXT NOT NULL,
        image_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
        INDEX idx_car_id (car_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Car images table ready");

    // Create car_features table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS car_features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT NOT NULL,
        feature VARCHAR(255) NOT NULL,
        feature_order INT DEFAULT 0,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
        INDEX idx_car_id (car_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Car features table ready");

    // Create settings table for site configuration
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Settings table ready");

    // Create contact_inquiries table for storing contact form submissions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT,
        status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Contact inquiries table ready");

    // Create admin_2fa_requests table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_2fa_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(128) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL,
        code_hash VARCHAR(255) NOT NULL,
        expires_at BIGINT NOT NULL,
        attempts INT DEFAULT 0,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ admin_2fa_requests table ready");

    // Create admin_sessions table for server-side device sessions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_token VARCHAR(128) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at BIGINT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ admin_sessions table ready");

    connection.release();
    console.log("✅ All database tables initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize tables:", error.message);
    throw error;
  }
};

module.exports = { initializeDatabase };

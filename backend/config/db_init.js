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

    connection.release();
    console.log("✅ All database tables initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize tables:", error.message);
    throw error;
  }
};

module.exports = { initializeDatabase };

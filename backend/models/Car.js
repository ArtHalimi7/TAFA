const db = require("../config/db_connect");

const Car = {
  // Get all cars with images and features
  async getAll(filters = {}) {
    try {
      let query = `
        SELECT c.*, 
               GROUP_CONCAT(DISTINCT ci.image_url ORDER BY ci.image_order) as images,
               GROUP_CONCAT(DISTINCT cf.feature ORDER BY cf.feature_order) as features
        FROM cars c
        LEFT JOIN car_images ci ON c.id = ci.car_id
        LEFT JOIN car_features cf ON c.id = cf.car_id
      `;

      const conditions = [];
      const params = [];

      if (filters.status) {
        conditions.push("c.status = ?");
        params.push(filters.status);
      }

      if (filters.brand) {
        conditions.push("c.brand = ?");
        params.push(filters.brand);
      }

      if (filters.category) {
        conditions.push("c.category = ?");
        params.push(filters.category);
      }

      if (filters.minPrice) {
        conditions.push("c.price >= ?");
        params.push(filters.minPrice);
      }

      if (filters.maxPrice) {
        conditions.push("c.price <= ?");
        params.push(filters.maxPrice);
      }

      if (filters.year) {
        conditions.push("c.year = ?");
        params.push(filters.year);
      }

      if (filters.search) {
        conditions.push(
          "(c.name LIKE ? OR c.brand LIKE ? OR c.category LIKE ?)",
        );
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " GROUP BY c.id";

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            query += " ORDER BY c.price ASC";
            break;
          case "price-high":
            query += " ORDER BY c.price DESC";
            break;
          case "year-new":
            query += " ORDER BY c.year DESC";
            break;
          case "year-old":
            query += " ORDER BY c.year ASC";
            break;
          default:
            query += " ORDER BY c.created_at DESC";
        }
      } else {
        query += " ORDER BY c.created_at DESC";
      }

      // Pagination
      if (filters.limit) {
        query += " LIMIT ?";
        params.push(parseInt(filters.limit));

        if (filters.offset) {
          query += " OFFSET ?";
          params.push(parseInt(filters.offset));
        }
      }

      const [rows] = await db.query(query, params);

      return rows.map((row) => ({
        ...row,
        images: row.images ? row.images.split(",") : [],
        features: row.features ? row.features.split(",") : [],
        price: parseFloat(row.price),
        acceleration: parseFloat(row.acceleration),
      }));
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
  },

  // Get car by ID
  async getById(id) {
    try {
      const [rows] = await db.query(
        `SELECT c.*, 
                GROUP_CONCAT(DISTINCT ci.image_url ORDER BY ci.image_order) as images,
                GROUP_CONCAT(DISTINCT cf.feature ORDER BY cf.feature_order) as features
         FROM cars c
         LEFT JOIN car_images ci ON c.id = ci.car_id
         LEFT JOIN car_features cf ON c.id = cf.car_id
         WHERE c.id = ?
         GROUP BY c.id`,
        [id],
      );

      if (rows.length === 0) return null;

      const car = rows[0];
      return {
        ...car,
        images: car.images ? car.images.split(",") : [],
        features: car.features ? car.features.split(",") : [],
        price: parseFloat(car.price),
        acceleration: parseFloat(car.acceleration),
      };
    } catch (error) {
      console.error("Error fetching car by ID:", error);
      throw error;
    }
  },

  // Get car by slug
  async getBySlug(slug) {
    try {
      const [rows] = await db.query(
        `SELECT c.*, 
                GROUP_CONCAT(DISTINCT ci.image_url ORDER BY ci.image_order) as images,
                GROUP_CONCAT(DISTINCT cf.feature ORDER BY cf.feature_order) as features
         FROM cars c
         LEFT JOIN car_images ci ON c.id = ci.car_id
         LEFT JOIN car_features cf ON c.id = cf.car_id
         WHERE c.slug = ?
         GROUP BY c.id`,
        [slug],
      );

      if (rows.length === 0) return null;

      const car = rows[0];
      return {
        ...car,
        images: car.images ? car.images.split(",") : [],
        features: car.features ? car.features.split(",") : [],
        price: parseFloat(car.price),
        acceleration: parseFloat(car.acceleration),
      };
    } catch (error) {
      console.error("Error fetching car by slug:", error);
      throw error;
    }
  },

  // Create a new car
  async create(carData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const {
        name,
        slug,
        tagline,
        category,
        brand,
        price,
        year,
        mileage,
        exteriorColor,
        interiorColor,
        engine,
        horsepower,
        torque,
        acceleration,
        topSpeed,
        transmission,
        drivetrain,
        fuelType,
        mpg,
        vin,
        description,
        status,
        showcaseImage,
        images,
        features,
      } = carData;

      const [result] = await connection.query(
        `INSERT INTO cars (
          name, slug, tagline, category, brand, price, year, mileage,
          exterior_color, interior_color, engine, horsepower, torque,
          acceleration, top_speed, transmission, drivetrain, fuel_type,
          mpg, vin, description, status, showcase_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          slug,
          tagline,
          category,
          brand,
          price,
          year,
          mileage,
          exteriorColor,
          interiorColor,
          engine,
          horsepower,
          torque,
          acceleration,
          topSpeed,
          transmission,
          drivetrain,
          fuelType,
          mpg,
          vin,
          description,
          status || "draft",
          showcaseImage || 0,
        ],
      );

      const carId = result.insertId;

      // Insert images
      if (images && images.length > 0) {
        const imageValues = images.map((url, index) => [carId, url, index]);
        await connection.query(
          "INSERT INTO car_images (car_id, image_url, image_order) VALUES ?",
          [imageValues],
        );
      }

      // Insert features
      if (features && features.length > 0) {
        const featureValues = features
          .filter((f) => f && f.trim())
          .map((feature, index) => [carId, feature.trim(), index]);
        if (featureValues.length > 0) {
          await connection.query(
            "INSERT INTO car_features (car_id, feature, feature_order) VALUES ?",
            [featureValues],
          );
        }
      }

      await connection.commit();
      return await this.getById(carId);
    } catch (error) {
      await connection.rollback();
      console.error("Error creating car:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  // Update a car
  async update(id, carData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const {
        name,
        slug,
        tagline,
        category,
        brand,
        price,
        year,
        mileage,
        exteriorColor,
        interiorColor,
        engine,
        horsepower,
        torque,
        acceleration,
        topSpeed,
        transmission,
        drivetrain,
        fuelType,
        mpg,
        vin,
        description,
        status,
        showcaseImage,
        images,
        features,
      } = carData;

      await connection.query(
        `UPDATE cars SET
          name = ?, slug = ?, tagline = ?, category = ?, brand = ?,
          price = ?, year = ?, mileage = ?, exterior_color = ?,
          interior_color = ?, engine = ?, horsepower = ?, torque = ?,
          acceleration = ?, top_speed = ?, transmission = ?, drivetrain = ?,
          fuel_type = ?, mpg = ?, vin = ?, description = ?, status = ?,
          showcase_image = ?
        WHERE id = ?`,
        [
          name,
          slug,
          tagline,
          category,
          brand,
          price,
          year,
          mileage,
          exteriorColor,
          interiorColor,
          engine,
          horsepower,
          torque,
          acceleration,
          topSpeed,
          transmission,
          drivetrain,
          fuelType,
          mpg,
          vin,
          description,
          status,
          showcaseImage || 0,
          id,
        ],
      );

      // Delete existing images and features
      await connection.query("DELETE FROM car_images WHERE car_id = ?", [id]);
      await connection.query("DELETE FROM car_features WHERE car_id = ?", [id]);

      // Insert new images
      if (images && images.length > 0) {
        const imageValues = images.map((url, index) => [id, url, index]);
        await connection.query(
          "INSERT INTO car_images (car_id, image_url, image_order) VALUES ?",
          [imageValues],
        );
      }

      // Insert new features
      if (features && features.length > 0) {
        const featureValues = features
          .filter((f) => f && f.trim())
          .map((feature, index) => [id, feature.trim(), index]);
        if (featureValues.length > 0) {
          await connection.query(
            "INSERT INTO car_features (car_id, feature, feature_order) VALUES ?",
            [featureValues],
          );
        }
      }

      await connection.commit();
      return await this.getById(id);
    } catch (error) {
      await connection.rollback();
      console.error("Error updating car:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete a car
  async delete(id) {
    try {
      const [result] = await db.query("DELETE FROM cars WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error deleting car:", error);
      throw error;
    }
  },

  // Increment view count
  async incrementViews(id) {
    try {
      await db.query("UPDATE cars SET views = views + 1 WHERE id = ?", [id]);
      return true;
    } catch (error) {
      console.error("Error incrementing views:", error);
      throw error;
    }
  },

  // Get featured cars
  async getFeatured(limit = 3) {
    return await this.getAll({ status: "active", limit });
  },

  // Get stats for dashboard
  async getStats() {
    try {
      const [totalResult] = await db.query(
        "SELECT COUNT(*) as count FROM cars",
      );
      const [activeResult] = await db.query(
        "SELECT COUNT(*) as count FROM cars WHERE status = 'active'",
      );
      const [draftResult] = await db.query(
        "SELECT COUNT(*) as count FROM cars WHERE status = 'draft'",
      );
      const [soldResult] = await db.query(
        "SELECT COUNT(*) as count FROM cars WHERE status = 'sold'",
      );
      const [valueResult] = await db.query(
        "SELECT SUM(price) as total FROM cars",
      );
      const [viewsResult] = await db.query(
        "SELECT SUM(views) as total FROM cars",
      );
      const [avgPriceResult] = await db.query(
        "SELECT AVG(price) as avg FROM cars",
      );

      return {
        totalCars: totalResult[0].count,
        activeCars: activeResult[0].count,
        draftCars: draftResult[0].count,
        soldCars: soldResult[0].count,
        totalValue: valueResult[0].total || 0,
        totalViews: viewsResult[0].total || 0,
        avgPrice: avgPriceResult[0].avg || 0,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      throw error;
    }
  },

  // Toggle car status
  async toggleStatus(id) {
    try {
      const car = await this.getById(id);
      if (!car) return null;

      const newStatus = car.status === "active" ? "draft" : "active";
      await db.query("UPDATE cars SET status = ? WHERE id = ?", [
        newStatus,
        id,
      ]);
      return await this.getById(id);
    } catch (error) {
      console.error("Error toggling status:", error);
      throw error;
    }
  },
};

module.exports = Car;

const db = require("../config/db_connect");

// Simple in-memory cache for featured cars (expires after 5 minutes)
const cache = {
  featured: null,
  featuredExpiry: 0,
  stats: null,
  statsExpiry: 0,
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const Car = {
  // Get all cars with images and features - OPTIMIZED
  async getAll(filters = {}) {
    try {
      let query = `
        SELECT c.id, c.name, c.slug, c.tagline, c.category, c.brand, c.price, 
               c.year, c.mileage, c.exterior_color, c.interior_color, c.engine,
               c.horsepower, c.torque, c.acceleration, c.top_speed, c.transmission,
               c.drivetrain, c.fuel_type, c.mpg, c.vin, c.description, c.status,
               c.showcase_image, c.views, c.is_featured, c.created_at, c.updated_at,
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

      if (filters.isFeatured !== undefined) {
        conditions.push("c.is_featured = ?");
        params.push(filters.isFeatured ? 1 : 0);
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

      // Pagination with default limit for performance
      const limit = Math.min(parseInt(filters.limit) || 20, 100);
      query += " LIMIT ?";
      params.push(limit);

      if (filters.offset) {
        query += " OFFSET ?";
        params.push(parseInt(filters.offset));
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
        isFeatured,
        images,
        features,
      } = carData;

      const [result] = await connection.query(
        `INSERT INTO cars (
          name, slug, tagline, category, brand, price, year, mileage,
          exterior_color, interior_color, engine, horsepower, torque,
          acceleration, top_speed, transmission, drivetrain, fuel_type,
          mpg, vin, description, status, showcase_image, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          isFeatured ? 1 : 0,
        ],
      );

      const carId = result.insertId;

      // Insert images - filter out empty/invalid URLs and remove duplicates
      if (images && images.length > 0) {
        const validImages = [...new Set(images)].filter(
          (url) =>
            url &&
            typeof url === "string" &&
            url.trim() !== "" &&
            !url.startsWith("blob:") &&
            !url.startsWith("data:"),
        );

        if (validImages.length > 0) {
          const imageValues = validImages.map((url, index) => [
            carId,
            url.trim(),
            index,
          ]);
          await connection.query(
            "INSERT INTO car_images (car_id, image_url, image_order) VALUES ?",
            [imageValues],
          );
        }
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
      this._invalidateCache();
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
        isFeatured,
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
          showcase_image = ?, is_featured = ?
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
          isFeatured ? 1 : 0,
          id,
        ],
      );

      // Delete existing images and features
      await connection.query("DELETE FROM car_images WHERE car_id = ?", [id]);
      await connection.query("DELETE FROM car_features WHERE car_id = ?", [id]);

      // Insert new images
      // Insert images - filter out empty/invalid URLs and remove duplicates
      if (images && images.length > 0) {
        const validImages = [...new Set(images)].filter(
          (url) =>
            url &&
            typeof url === "string" &&
            url.trim() !== "" &&
            !url.startsWith("blob:") &&
            !url.startsWith("data:"),
        );

        if (validImages.length > 0) {
          const imageValues = validImages.map((url, index) => [
            id,
            url.trim(),
            index,
          ]);
          await connection.query(
            "INSERT INTO car_images (car_id, image_url, image_order) VALUES ?",
            [imageValues],
          );
        }
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
      this._invalidateCache();
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
      if (result.affectedRows > 0) {
        this._invalidateCache();
      }
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

  // Get featured cars with caching
  async getFeatured(limit = 3) {
    // Check cache
    if (cache.featured && cache.featuredExpiry > Date.now()) {
      return cache.featured.slice(0, limit);
    }

    // Get cars marked as featured, or fall back to active cars if none are featured
    let result = await this.getAll({ isFeatured: true, limit: 50 });

    // If no featured cars, fall back to active cars
    if (!result || result.length === 0) {
      result = await this.getAll({ status: "active", limit: 50 });
    }

    // Cache the result
    cache.featured = result;
    cache.featuredExpiry = Date.now() + CACHE_TTL;
    return result.slice(0, limit);
  },

  // Get stats for dashboard with caching
  async getStats() {
    // Check cache
    if (cache.stats && cache.statsExpiry > Date.now()) {
      return cache.stats;
    }

    try {
      // Use a single aggregation query instead of multiple queries
      const [statsResult] = await db.query(`
        SELECT 
          COUNT(*) as totalCars,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeCars,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draftCars,
          SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as soldCars,
          SUM(price) as totalValue,
          SUM(views) as totalViews,
          AVG(price) as avgPrice
        FROM cars
      `);

      const stats = {
        totalCars: statsResult[0].totalCars || 0,
        activeCars: statsResult[0].activeCars || 0,
        draftCars: statsResult[0].draftCars || 0,
        soldCars: statsResult[0].soldCars || 0,
        totalValue: parseFloat(statsResult[0].totalValue) || 0,
        totalViews: statsResult[0].totalViews || 0,
        avgPrice: parseFloat(statsResult[0].avgPrice) || 0,
      };

      // Cache the result
      cache.stats = stats;
      cache.statsExpiry = Date.now() + CACHE_TTL;
      return stats;
    } catch (error) {
      console.error("Error getting stats:", error);
      throw error;
    }
  },

  // Invalidate cache when data changes
  _invalidateCache() {
    cache.featured = null;
    cache.featuredExpiry = 0;
    cache.stats = null;
    cache.statsExpiry = 0;
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
      this._invalidateCache();
      return await this.getById(id);
    } catch (error) {
      console.error("Error toggling status:", error);
      throw error;
    }
  },
};

module.exports = Car;

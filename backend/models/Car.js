const db = require("../config/db_connect");

// Simple in-memory cache for featured cars (expires after 5 minutes)
const cache = {
  featured: null,
  featuredExpiry: 0,
  showcase: null,
  showcaseExpiry: 0,
  stats: null,
  statsExpiry: 0,
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper: parse GROUP_CONCAT / JSON / array values, trim and dedupe preserving order
function parseAndDedupe(val) {
  const SEP = "|||";
  if (!val) return [];
  // If it's already an array, normalize entries
  if (Array.isArray(val)) {
    const seen = new Set();
    const out = [];
    for (let v of val) {
      if (v == null) continue;
      v = String(v).trim();
      if (!v) continue;
      if (!seen.has(v)) {
        seen.add(v);
        out.push(v);
      }
    }
    return out;
  }

  // If string, try JSON parse, otherwise split by separator
  if (typeof val === "string") {
    // Try parse JSON array
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parseAndDedupe(parsed);
    } catch (e) {
      // not JSON
    }

    const parts = val.split(SEP);
    const seen = new Set();
    const out = [];
    for (let p of parts) {
      if (p == null) continue;
      p = String(p).trim();
      if (!p) continue;
      if (!seen.has(p)) {
        seen.add(p);
        out.push(p);
      }
    }
    return out;
  }

  return [];
}

// Heuristic: detect if a GROUP_CONCAT result was truncated (e.g. ends up as a folder path)
function isLikelyTruncatedImage(url) {
  if (!url || typeof url !== "string") return false;
  // Valid Cloudinary URLs will usually contain '/upload/' and a filename with an extension
  if (
    url.includes("/upload/") &&
    /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(url)
  ) {
    return false;
  }
  // If it ends with the folder or is missing an extension, consider it truncated
  if (url.endsWith("/tafa-cars") || !/\./.test(url.split("/").pop()))
    return true;
  return false;
}
const Car = {
  // Get all cars with images and features - OPTIMIZED
  async getAll(filters = {}) {
    try {
      let query = `
        SELECT c.id, c.name, c.slug, c.tagline, c.category, c.brand, c.price, c.discount_price,
               c.year, c.mileage, c.exterior_color, c.interior_color, c.engine,
               c.horsepower, c.torque, c.acceleration, c.top_speed, c.transmission,
               c.drivetrain, c.fuel_type, c.mpg, c.vin, c.description, c.status,
               c.showcase_image, c.views, c.is_featured, c.is_showcase, c.is_sold, c.created_at, c.updated_at,
               (SELECT GROUP_CONCAT(DISTINCT ci2.image_url ORDER BY ci2.image_order SEPARATOR '|||') FROM car_images ci2 WHERE ci2.car_id = c.id) as images,
               (SELECT GROUP_CONCAT(DISTINCT cf2.feature ORDER BY cf2.feature_order SEPARATOR '|||') FROM car_features cf2 WHERE cf2.car_id = c.id) as features
             FROM cars c
      `;

      const conditions = [];
      const params = [];

      if (filters.status) {
        conditions.push("c.status = ?");
        params.push(filters.status);
      }

      // Support for multiple statuses (e.g., active AND sold)
      if (
        filters.statusIn &&
        Array.isArray(filters.statusIn) &&
        filters.statusIn.length > 0
      ) {
        const placeholders = filters.statusIn.map(() => "?").join(", ");
        conditions.push(`c.status IN (${placeholders})`);
        params.push(...filters.statusIn);
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

      if (filters.isShowcase !== undefined) {
        conditions.push("c.is_showcase = ?");
        params.push(filters.isShowcase ? 1 : 0);
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

      // Resolve images/features and perform fallback fetch for truncated GROUP_CONCAT results
      const cars = await Promise.all(
        rows.map(async (row) => {
          let images = parseAndDedupe(row.images);

          // If any image looks truncated, fetch from car_images directly
          if (images.some(isLikelyTruncatedImage)) {
            try {
              const [imgRows] = await db.query(
                "SELECT image_url FROM car_images WHERE car_id = ? ORDER BY image_order",
                [row.id],
              );
              images = imgRows.map((r) => r.image_url).filter(Boolean);
            } catch (err) {
              console.warn(
                "Failed fallback fetch images for car",
                row.id,
                err.message,
              );
            }
          }

          return {
            ...row,
            images: images,
            features: parseAndDedupe(row.features),
            price: parseFloat(row.price),
            discountPrice: row.discount_price
              ? parseFloat(row.discount_price)
              : null,
            acceleration: parseFloat(row.acceleration),
            isSold: !!row.is_sold,
          };
        }),
      );

      return cars;
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
                (SELECT GROUP_CONCAT(DISTINCT ci2.image_url ORDER BY ci2.image_order SEPARATOR '|||') FROM car_images ci2 WHERE ci2.car_id = c.id) as images,
                (SELECT GROUP_CONCAT(DISTINCT cf2.feature ORDER BY cf2.feature_order SEPARATOR '|||') FROM car_features cf2 WHERE cf2.car_id = c.id) as features
         FROM cars c
         WHERE c.id = ?
         GROUP BY c.id`,
        [id],
      );

      if (rows.length === 0) return null;

      const car = rows[0];
      // Parse images and fallback if truncated
      let images = parseAndDedupe(car.images);
      if (images.some(isLikelyTruncatedImage)) {
        try {
          const [imgRows] = await db.query(
            "SELECT image_url FROM car_images WHERE car_id = ? ORDER BY image_order",
            [car.id],
          );
          images = imgRows.map((r) => r.image_url).filter(Boolean);
        } catch (err) {
          console.warn(
            "Failed fallback fetch images for car",
            car.id,
            err.message,
          );
        }
      }

      return {
        ...car,
        images: images,
        features: parseAndDedupe(car.features),
        price: parseFloat(car.price),
        discountPrice: car.discount_price
          ? parseFloat(car.discount_price)
          : null,
        acceleration: parseFloat(car.acceleration),
        isSold: !!car.is_sold,
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
                (SELECT GROUP_CONCAT(DISTINCT ci2.image_url ORDER BY ci2.image_order SEPARATOR '|||') FROM car_images ci2 WHERE ci2.car_id = c.id) as images,
                (SELECT GROUP_CONCAT(DISTINCT cf2.feature ORDER BY cf2.feature_order SEPARATOR '|||') FROM car_features cf2 WHERE cf2.car_id = c.id) as features
         FROM cars c
         WHERE c.slug = ?
         GROUP BY c.id`,
        [slug],
      );

      if (rows.length === 0) return null;

      const car = rows[0];
      // Parse images and fallback if truncated
      let images = parseAndDedupe(car.images);
      if (images.some(isLikelyTruncatedImage)) {
        try {
          const [imgRows] = await db.query(
            "SELECT image_url FROM car_images WHERE car_id = ? ORDER BY image_order",
            [car.id],
          );
          images = imgRows.map((r) => r.image_url).filter(Boolean);
        } catch (err) {
          console.warn(
            "Failed fallback fetch images for car",
            car.id,
            err.message,
          );
        }
      }

      return {
        ...car,
        images: images,
        features: parseAndDedupe(car.features),
        price: parseFloat(car.price),
        discountPrice: car.discount_price
          ? parseFloat(car.discount_price)
          : null,
        acceleration: parseFloat(car.acceleration),
        isSold: !!car.is_sold,
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
        discountPrice,
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
        isShowcase,
        isSold,
        images,
        features,
      } = carData;

      // If setting this car as showcase, remove showcase from all other cars first
      if (isShowcase) {
        await connection.query(
          "UPDATE cars SET is_showcase = 0 WHERE is_showcase = 1",
        );
      }

      const [result] = await connection.query(
        `INSERT INTO cars (
          name, slug, tagline, category, brand, price, discount_price, year, mileage,
          exterior_color, interior_color, engine, horsepower, torque,
          acceleration, top_speed, transmission, drivetrain, fuel_type,
          mpg, vin, description, status, showcase_image, is_featured, is_showcase, is_sold
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          slug,
          tagline,
          category,
          brand,
          price,
          discountPrice || null,
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
          isShowcase ? 1 : 0,
          isSold ? 1 : 0,
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
        discountPrice,
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
        isShowcase,
        isSold,
        images,
        features,
      } = carData;

      // If setting this car as showcase, remove showcase from all other cars first
      if (isShowcase) {
        await connection.query(
          "UPDATE cars SET is_showcase = 0 WHERE is_showcase = 1 AND id != ?",
          [id],
        );
      }

      await connection.query(
        `UPDATE cars SET
          name = ?, slug = ?, tagline = ?, category = ?, brand = ?,
          price = ?, discount_price = ?, year = ?, mileage = ?, exterior_color = ?,
          interior_color = ?, engine = ?, horsepower = ?, torque = ?,
          acceleration = ?, top_speed = ?, transmission = ?, drivetrain = ?,
          fuel_type = ?, mpg = ?, vin = ?, description = ?, status = ?,
          showcase_image = ?, is_featured = ?, is_showcase = ?, is_sold = ?
        WHERE id = ?`,
        [
          name,
          slug,
          tagline,
          category,
          brand,
          price,
          discountPrice || null,
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
          isShowcase ? 1 : 0,
          isSold ? 1 : 0,
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

    // Get only cars explicitly marked as featured (no fallback)
    // This includes both active AND sold cars - sold cars should still be visible with "I SHITUR" badge
    const result = await this.getAll({ isFeatured: true, limit: 50 });

    // Cache the result (even if empty)
    cache.featured = result || [];
    cache.featuredExpiry = Date.now() + CACHE_TTL;
    return cache.featured.slice(0, limit);
  },

  // Get the showcase car (the single most exclusive car)
  async getShowcase() {
    // Check cache
    if (cache.showcase && cache.showcaseExpiry > Date.now()) {
      return cache.showcase;
    }

    // Get the car marked as showcase (only one can exist)
    const result = await this.getAll({ isShowcase: true, limit: 1 });

    // Cache the result (even if empty/null)
    cache.showcase = result && result.length > 0 ? result[0] : null;
    cache.showcaseExpiry = Date.now() + CACHE_TTL;
    return cache.showcase;
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
    cache.showcase = null;
    cache.showcaseExpiry = 0;
    cache.stats = null;
    cache.statsExpiry = 0;
  },

  // Toggle car status (visibility: active/draft)
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

  // Toggle car sold status (isSold: true/false)
  async toggleSold(id) {
    try {
      const car = await this.getById(id);
      if (!car) return null;

      const newSoldStatus = !car.isSold;
      await db.query("UPDATE cars SET is_sold = ? WHERE id = ?", [
        newSoldStatus ? 1 : 0,
        id,
      ]);
      this._invalidateCache();
      return await this.getById(id);
    } catch (error) {
      console.error("Error toggling sold status:", error);
      throw error;
    }
  },
};

module.exports = Car;

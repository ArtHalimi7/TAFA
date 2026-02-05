const express = require("express");
const router = express.Router();
const Car = require("../models/Car");

// Get all active cars (public) - excludes drafts, includes sold cars if they're active
router.get("/public", async (req, res) => {
  try {
    const filters = {
      status: "active", // Only show active cars (visibility is controlled by status)
      brand: req.query.brand,
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      year: req.query.year,
      search: req.query.search,
      sortBy: req.query.sortBy,
      limit: req.query.limit,
      offset: req.query.offset,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined || filters[key] === "") {
        delete filters[key];
      }
    });

    const cars = await Car.getAll(filters);
    res.json({ success: true, data: cars, count: cars.length });
  } catch (error) {
    console.error("Error in getActiveCars:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cars",
      error: error.message,
    });
  }
});

// Get featured cars
router.get("/featured", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const cars = await Car.getFeatured(limit);
    res.json({ success: true, data: cars });
  } catch (error) {
    console.error("Error in getFeaturedCars:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured cars",
      error: error.message,
    });
  }
});

// Get showcase car (the single most exclusive car)
router.get("/showcase", async (req, res) => {
  try {
    const car = await Car.getShowcase();
    res.json({ success: true, data: car });
  } catch (error) {
    console.error("Error in getShowcaseCar:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch showcase car",
      error: error.message,
    });
  }
});

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const stats = await Car.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getStats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
});

// Get car by slug (public)
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const car = await Car.getBySlug(slug);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Increment views
    await Car.incrementViews(car.id);

    res.json({ success: true, data: car });
  } catch (error) {
    console.error("Error in getCarBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch car",
      error: error.message,
    });
  }
});

// Get all cars (admin)
router.get("/", async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      brand: req.query.brand,
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      year: req.query.year,
      search: req.query.search,
      sortBy: req.query.sortBy,
      limit: req.query.limit,
      offset: req.query.offset,
    };

    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined || filters[key] === "") {
        delete filters[key];
      }
    });

    const cars = await Car.getAll(filters);
    res.json({ success: true, data: cars, count: cars.length });
  } catch (error) {
    console.error("Error in getAllCars:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cars",
      error: error.message,
    });
  }
});

// Get car by ID (admin)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.getById(id);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.json({ success: true, data: car });
  } catch (error) {
    console.error("Error in getCarById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch car",
      error: error.message,
    });
  }
});

// Create new car
router.post("/", async (req, res) => {
  try {
    const carData = req.body;

    // Validate required fields
    if (
      !carData.name ||
      !carData.category ||
      !carData.brand ||
      !carData.price ||
      !carData.year
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, category, brand, price, year",
      });
    }

    // Generate slug if not provided
    if (!carData.slug) {
      carData.slug = carData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const car = await Car.create(carData);
    res
      .status(201)
      .json({ success: true, message: "Car created successfully", data: car });
  } catch (error) {
    console.error("Error in createCar:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "A car with this slug or VIN already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create car",
      error: error.message,
    });
  }
});

// Update car
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const carData = req.body;

    const existingCar = await Car.getById(id);
    if (!existingCar) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const car = await Car.update(id, carData);
    res.json({ success: true, message: "Car updated successfully", data: car });
  } catch (error) {
    console.error("Error in updateCar:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "A car with this slug or VIN already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update car",
      error: error.message,
    });
  }
});

// Delete car
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingCar = await Car.getById(id);
    if (!existingCar) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    await Car.delete(id);
    res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCar:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete car",
      error: error.message,
    });
  }
});

// Toggle car status (visibility: active/draft)
router.patch("/:id/toggle-status", async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.toggleStatus(id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.json({
      success: true,
      message: `Car status changed to ${car.status}`,
      data: car,
    });
  } catch (error) {
    console.error("Error in toggleCarStatus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle car status",
      error: error.message,
    });
  }
});

// Toggle car sold status (isSold: true/false)
router.patch("/:id/toggle-sold", async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.toggleSold(id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.json({
      success: true,
      message: `Car sold status changed to ${car.isSold ? "sold" : "available"}`,
      data: car,
    });
  } catch (error) {
    console.error("Error in toggleSoldStatus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle sold status",
      error: error.message,
    });
  }
});

module.exports = router;

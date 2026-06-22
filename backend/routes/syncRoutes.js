const express = require("express");
const router = express.Router();
const { syncEncarListings } = require("../services/encarService");

// POST /api/sync/encar
// Body: { limit, isDomestic, sortBy, pages }
router.post("/encar", async (req, res) => {
  try {
    const limit = parseInt(req.body.limit) || 30;
    const isDomestic = req.body.isDomestic !== false; // defaults to true (Domestic Korea)
    const sortBy = req.body.sortBy || "ModifiedDate"; // ModifiedDate, ViewCount, Price, Year, Mileage
    const pages = Math.min(parseInt(req.body.pages) || 1, 10); // max 10 pages

    console.log(`POST /api/sync/encar received: limit=${limit}, isDomestic=${isDomestic}, sortBy=${sortBy}, pages=${pages}`);
    
    // Trigger the background sync process
    const result = await syncEncarListings(limit, isDomestic, sortBy, pages);
    
    res.json({
      success: true,
      message: `Encar synchronization complete!`,
      data: {
        importedCount: result.importedCount,
        skippedCount: result.skippedCount,
        logs: result.logs
      }
    });
  } catch (error) {
    console.error("Error in syncEncar route:", error);
    res.status(500).json({
      success: false,
      message: "Encar sync failed",
      error: error.message
    });
  }
});

module.exports = router;

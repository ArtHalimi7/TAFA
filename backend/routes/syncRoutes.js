const express = require("express");
const router = express.Router();
const { syncEncarListings } = require("../services/encarService");

// POST /api/sync/encar
// Body: { limit, isDomestic }
router.post("/encar", async (req, res) => {
  try {
    const limit = parseInt(req.body.limit) || 10;
    const isDomestic = req.body.isDomestic !== false; // defaults to true (Domestic Korea)

    console.log(`POST /api/sync/encar received: limit=${limit}, isDomestic=${isDomestic}`);
    
    // Trigger the background sync process
    const result = await syncEncarListings(limit, isDomestic);
    
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

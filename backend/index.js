const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Load .env from parent folder (local dev) or use Render's environment variables (production)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
}

const db = require("./config/db_connect");
const { initializeDatabase } = require("./config/db_init");
const carRoutes = require("./routes/carRoutes");
const contactRoutes = require("./routes/contactRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// Middleware
app.use(
  cors({
    origin: [
      // Local development
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      // Netlify frontend
      "https://autotafa.netlify.app",
      "https://www.autotafa.netlify.app",
      // Custom domain frontend
      "https://autosallonitafa.com",
      "https://www.autosallonitafa.com",
      // Render backend (self)
      "https://autotafaonrender.com",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadsDir));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "TAFA Auto Dealership API",
    version: "1.0.0",
    endpoints: {
      cars: "/api/cars",
      contact: "/api/contact",
      upload: "/api/upload",
      health: "/api/health",
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Detailed health check with database
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1 + 1 AS solution");
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: err.message,
    });
  }
});

// API Routes
app.use("/api/cars", carRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error("Error:", err.stack);

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ error: "File too large. Maximum size is 10MB." });
  }
  if (err.code === "LIMIT_FILE_COUNT") {
    return res
      .status(400)
      .json({ error: "Too many files. Maximum is 20 files." });
  }

  // MySQL errors
  if (err.code === "ER_DUP_ENTRY") {
    return res
      .status(400)
      .json({ error: "Duplicate entry. This record already exists." });
  }

  res.status(500).json({ error: "Something went wrong!" });
});

// Start server with database initialization
async function startServer() {
  try {
    // Initialize database tables
    await initializeDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║   TAFA Auto Dealership API v1.0.0                 ║
╠═══════════════════════════════════════════════════╣
║   Server: http://localhost:${PORT}                    ║
║   Status: Running                                 ║
║   Database: Connected                             ║
╠═══════════════════════════════════════════════════╣
║   Endpoints:                                      ║
║   • GET    /api/cars                              ║
║   • GET    /api/cars/public                       ║
║   • GET    /api/cars/featured                     ║
║   • GET    /api/cars/slug/:slug                   ║
║   • POST   /api/cars                              ║
║   • PUT    /api/cars/:id                          ║
║   • DELETE /api/cars/:id                          ║
║   • POST   /api/upload/single                     ║
║   • POST   /api/upload/multiple                   ║
║   • POST   /api/contact                           ║
║   • GET    /api/health                            ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await db.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await db.end();
  process.exit(0);
});

module.exports = app;

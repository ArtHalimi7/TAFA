const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Upload directory path
const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `car-${uniqueSuffix}${ext}`);
  },
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."),
      false,
    );
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Upload single image
router.post("/single", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Error in uploadImage:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
  }
});

// Upload multiple images
router.post("/multiple", upload.array("images", 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const images = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    }));

    res.json({
      success: true,
      message: `${images.length} image(s) uploaded successfully`,
      data: images,
    });
  } catch (error) {
    console.error("Error in uploadImages:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to upload images",
        error: error.message,
      });
  }
});

// Delete image
router.delete("/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    fs.unlinkSync(filepath);

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete image",
        error: error.message,
      });
  }
});

module.exports = router;

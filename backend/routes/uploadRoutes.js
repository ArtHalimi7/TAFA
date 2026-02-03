const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

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

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "tafa-cars",
        resource_type: "image",
        public_id: `car-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        transformation: [
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(buffer);
  });
};

// Upload single image
router.post("/single", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        filename: result.public_id,
        originalName: req.file.originalname,
        size: req.file.size,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error("Error in uploadImage:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
});

// Upload multiple images
router.post("/multiple", upload.array("images", 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, file.originalname).then((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
        filename: result.public_id,
        originalName: file.originalname,
        size: file.size,
        width: result.width,
        height: result.height,
      })),
    );

    const images = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${images.length} image(s) uploaded successfully`,
      data: images,
    });
  } catch (error) {
    console.error("Error in uploadImages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload images",
      error: error.message,
    });
  }
});

// Delete image from Cloudinary
router.delete("/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;

    // Handle nested public IDs (folder/filename format)
    const fullPublicId = publicId.includes("/") ? publicId : `tafa-cars/${publicId}`;

    const result = await cloudinary.uploader.destroy(fullPublicId);

    if (result.result === "ok") {
      res.json({ success: true, message: "Image deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Image not found or already deleted" });
    }
  } catch (error) {
    console.error("Error in deleteImage:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
});

module.exports = router;

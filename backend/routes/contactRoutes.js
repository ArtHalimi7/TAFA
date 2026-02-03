const express = require("express");
const router = express.Router();
const ContactInquiry = require("../models/ContactInquiry");
const { sendContactEmail } = require("../services/emailService");

// Submit contact inquiry (public)
router.post("/", async (req, res) => {
  try {
    const { carId, name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const inquiry = await ContactInquiry.create({
      carId,
      name,
      email,
      phone,
      message,
    });

    // Send email notification
    try {
      await sendContactEmail(name, email, phone, message);
    } catch (emailError) {
      console.error("Email sending failed, but inquiry was saved:", emailError);
      // Don't fail the request if email fails, as inquiry is still saved
    }

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error("Error in createInquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
      error: error.message,
    });
  }
});

// Get all inquiries (admin)
router.get("/", async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      limit: req.query.limit,
    };

    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined || filters[key] === "") {
        delete filters[key];
      }
    });

    const inquiries = await ContactInquiry.getAll(filters);
    res.json({ success: true, data: inquiries, count: inquiries.length });
  } catch (error) {
    console.error("Error in getAllInquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
      error: error.message,
    });
  }
});

// Get inquiry counts (admin)
router.get("/counts", async (req, res) => {
  try {
    const counts = await ContactInquiry.getCounts();
    res.json({ success: true, data: counts });
  } catch (error) {
    console.error("Error in getInquiryCounts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiry counts",
      error: error.message,
    });
  }
});

// Get inquiry by ID (admin)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await ContactInquiry.getById(id);

    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    console.error("Error in getInquiryById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiry",
      error: error.message,
    });
  }
});

// Update inquiry status (admin)
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["new", "read", "replied", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    const inquiry = await ContactInquiry.updateStatus(id, status);
    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    res.json({
      success: true,
      message: "Inquiry status updated",
      data: inquiry,
    });
  } catch (error) {
    console.error("Error in updateInquiryStatus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update inquiry status",
      error: error.message,
    });
  }
});

// Delete inquiry (admin)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ContactInquiry.delete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Error in deleteInquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete inquiry",
      error: error.message,
    });
  }
});

module.exports = router;

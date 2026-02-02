const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
  servePdfInline
} = require("../../controllers/common/feature-controller");

const router = express.Router();

// Add a new feature/banner
router.post("/add", addFeatureImage);

// Get all features/banners
router.get("/get", getFeatureImages);

// Delete a feature/banner
router.delete("/delete/:id", deleteFeatureImage);

// Serve a PDF inline (proxy)
router.get("/serve-pdf", servePdfInline);

module.exports = router;

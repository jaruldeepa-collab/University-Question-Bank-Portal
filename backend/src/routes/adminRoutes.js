const express = require("express");

const {
  getDashboardStats,
  getRecentUploads,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("admin", "faculty"),
  getDashboardStats
);

router.get(
  "/recent-uploads",
  protect,
  authorize("admin", "faculty"),
  getRecentUploads
);

module.exports = router;
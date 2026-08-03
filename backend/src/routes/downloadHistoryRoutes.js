const express = require("express");
console.log("Download History Routes Loaded");

const {
  saveDownloadHistory,
  getDownloadHistory,
} = require("../controllers/downloadHistoryController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Student Routes

router.post(
  "/:paperId",
  protect,
  authorize("student", "faculty", "admin"),
  saveDownloadHistory
);

router.get(
  "/",
  protect,
  authorize("student", "faculty", "admin"),
  getDownloadHistory
);

module.exports = router;
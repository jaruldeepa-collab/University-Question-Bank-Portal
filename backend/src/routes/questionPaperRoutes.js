const express = require("express");

const {
  uploadQuestionPaper,
  getMyUploads,
  updateQuestionPaper,
} = require("../controllers/questionPaperController");

const upload = require("../middleware/uploadMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Upload Question Paper
router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  upload.single("pdf"),
  uploadQuestionPaper
);

// Get My Uploads
router.get(
  "/my-uploads",
  protect,
  authorize("faculty", "admin"),
  getMyUploads
);

// Update Question Paper
router.put(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  updateQuestionPaper
);

module.exports = router;
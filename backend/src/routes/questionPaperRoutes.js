const express = require("express");

const {
  uploadQuestionPaper,
} = require("../controllers/questionPaperController");

const upload = require("../middleware/uploadMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Faculty Upload Question Paper
router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  upload.single("pdf"),
  uploadQuestionPaper
);

module.exports = router;
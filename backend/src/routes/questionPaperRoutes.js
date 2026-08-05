const express = require("express");

const {
  uploadQuestionPaper,
  getMyUploads,
  updateQuestionPaper,
  getQuestionPapers,
  getQuestionPaperById,
  deleteQuestionPaper,
  searchQuestionPapers,
  filterQuestionPapers,
} = require("../controllers/questionPaperController");

const upload = require("../middleware/uploadMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

// ==========================
// Public Routes
// ==========================

// Search Question Papers
router.get("/search", searchQuestionPapers);

// Filter Question Papers
router.get("/filter", filterQuestionPapers);

// Get All Question Papers
router.get("/", getQuestionPapers);

// Get Single Question Paper
router.get(
  "/:id",
  validateObjectId,
  getQuestionPaperById
);

// ==========================
// Faculty / Admin Routes
// ==========================

// Upload Question Paper
router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  upload.single("pdf"),
  uploadQuestionPaper
);

// My Uploads
router.get(
  "/my-uploads",
  protect,
  authorize("faculty", "admin"),
  getMyUploads
);

// Update Question Paper
router.put(
  "/:id",
  validateObjectId,
  protect,
  authorize("faculty", "admin"),
  updateQuestionPaper
);

// Delete Question Paper
router.delete(
  "/:id",
  validateObjectId,
  protect,
  authorize("faculty", "admin"),
  deleteQuestionPaper
);

module.exports = router;
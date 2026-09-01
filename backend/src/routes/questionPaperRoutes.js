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

router.get("/search", searchQuestionPapers);

router.get("/filter", filterQuestionPapers);

router.get("/", getQuestionPapers);

// IMPORTANT:
// This must come BEFORE /:id
router.get("/my-uploads", protect, authorize("faculty", "admin"), getMyUploads);

router.get("/:id", validateObjectId, getQuestionPaperById);

// ==========================
// Faculty / Admin Routes
// ==========================

router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  upload.single("pdf"),
  uploadQuestionPaper
);

router.put(
  "/:id",
  validateObjectId,
  protect,
  authorize("faculty", "admin"),
  upload.single("pdf"),
  updateQuestionPaper
);

router.delete(
  "/:id",
  validateObjectId,
  protect,
  authorize("faculty", "admin"),
  deleteQuestionPaper
);

module.exports = router;
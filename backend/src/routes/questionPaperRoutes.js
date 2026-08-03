const express = require("express");

const {
  uploadQuestionPaper,
  getMyUploads,
  updateQuestionPaper,
  getQuestionPapers,
  getQuestionPaperById,
  deleteQuestionPaper,
  searchQuestionPapers,
} = require("../controllers/questionPaperController");

const upload = require("../middleware/uploadMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/search", searchQuestionPapers);
router.get("/", getQuestionPapers);
router.get("/:id", getQuestionPaperById);

// Faculty/Admin Routes
router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  upload.single("pdf"),
  uploadQuestionPaper
);

router.get(
  "/my-uploads",
  protect,
  authorize("faculty", "admin"),
  getMyUploads
);

router.put(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  updateQuestionPaper
);

router.delete(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  deleteQuestionPaper
);

module.exports = router;
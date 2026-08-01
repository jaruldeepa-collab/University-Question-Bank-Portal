const express = require("express");

const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getSubjects);
router.get("/:id", getSubjectById);

// Admin Routes
router.post("/", protect, authorize("admin"), createSubject);
router.put("/:id", protect, authorize("admin"), updateSubject);
router.delete("/:id", protect, authorize("admin"), deleteSubject);

module.exports = router;
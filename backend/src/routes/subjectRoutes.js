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

// Admin & Faculty Routes
router.post("/", protect, authorize("admin", "faculty"), createSubject);
router.put("/:id", protect, authorize("admin", "faculty"), updateSubject);
router.delete("/:id", protect, authorize("admin", "faculty"), deleteSubject);

module.exports = router;
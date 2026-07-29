const express = require("express");

const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public - Get all departments
router.get("/", getDepartments);

// Admin Only - Create Department
router.post("/", protect, authorize("admin"), createDepartment);

// Admin Only - Update Department
router.put("/:id", protect, authorize("admin"), updateDepartment);

// Admin Only - Delete Department
router.delete("/:id", protect, authorize("admin"), deleteDepartment);

module.exports = router;
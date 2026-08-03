const express = require("express");

const {
  addBookmark,
  getBookmarks,
  removeBookmark,
} = require("../controllers/bookmarkController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Student Routes
router.post(
  "/:paperId",
  protect,
  authorize("student", "faculty", "admin"),
  addBookmark
);

router.get(
  "/",
  protect,
  authorize("student", "faculty", "admin"),
  getBookmarks
);

router.delete(
  "/:paperId",
  protect,
  authorize("student", "faculty", "admin"),
  removeBookmark
);

module.exports = router;
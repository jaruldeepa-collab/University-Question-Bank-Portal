const Bookmark = require("../models/Bookmark");

// Add Bookmark
exports.addBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.create({
      student: req.user._id,
      questionPaper: req.params.paperId,
    });

    res.status(201).json({
      success: true,
      message: "Bookmark added successfully",
      bookmark,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Bookmarks
exports.getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({
      student: req.user._id,
    }).populate({
      path: "questionPaper",
      populate: [
        { path: "department", select: "name code" },
        { path: "subject", select: "name code" },
      ],
    });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// Remove Bookmark
exports.removeBookmark = async (req, res, next) => {
  try {
    await Bookmark.findOneAndDelete({
      student: req.user._id,
      questionPaper: req.params.paperId,
    });

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
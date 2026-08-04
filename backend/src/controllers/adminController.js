const User = require("../models/User");
const Department = require("../models/Department");
const Subject = require("../models/Subject");
const QuestionPaper = require("../models/QuestionPaper");
const Bookmark = require("../models/Bookmark");
const DownloadHistory = require("../models/DownloadHistory");

// Dashboard Statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const totalDepartments = await Department.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const totalQuestionPapers = await QuestionPaper.countDocuments();
    const totalBookmarks = await Bookmark.countDocuments();
    const totalDownloads = await DownloadHistory.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalFaculty,
        totalDepartments,
        totalSubjects,
        totalQuestionPapers,
        totalBookmarks,
        totalDownloads,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Recent Uploads
exports.getRecentUploads = async (req, res, next) => {
  try {
    const papers = await QuestionPaper.find()
      .populate("department", "name code")
      .populate("subject", "name code")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: papers.length,
      papers,
    });
  } catch (error) {
    next(error);
  }
};
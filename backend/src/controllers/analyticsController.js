const QuestionPaper = require("../models/QuestionPaper");
const Department = require("../models/Department");
const User = require("../models/User");
const DownloadHistory = require("../models/DownloadHistory");
const Bookmark = require("../models/Bookmark");

// Comprehensive Analytics Controller
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalPapers = await QuestionPaper.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalDepartments = await Department.countDocuments();
    const totalBookmarks = await Bookmark.countDocuments();
    const totalDownloadHistory = await DownloadHistory.countDocuments();

    // Sum of downloads across all question papers
    const totalDownloadsAgg = await QuestionPaper.aggregate([
      {
        $group: {
          _id: null,
          downloads: { $sum: "$downloadCount" },
        },
      },
    ]);
    const totalDownloads =
      totalDownloadsAgg.length > 0 ? totalDownloadsAgg[0].downloads : 0;

    // Top 5 Most Downloaded Papers
    const mostDownloaded = await QuestionPaper.find()
      .sort({ downloadCount: -1 })
      .limit(5)
      .populate("department", "name code")
      .populate("uploadedBy", "name email");

    // Department Distribution Aggregation
    const departmentDistribution = await QuestionPaper.aggregate([
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "deptInfo",
        },
      },
      { $unwind: { path: "$deptInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$deptInfo.name",
          deptCode: { $first: "$deptInfo.code" },
          paperCount: { $sum: 1 },
          totalDownloads: { $sum: "$downloadCount" },
        },
      },
      { $sort: { paperCount: -1 } },
    ]);

    // Exam Type Distribution Aggregation
    const examTypeDistribution = await QuestionPaper.aggregate([
      {
        $group: {
          _id: "$examType",
          count: { $sum: 1 },
          downloads: { $sum: "$downloadCount" },
        },
      },
    ]);

    // Academic Year Distribution Aggregation
    const yearDistribution = await QuestionPaper.aggregate([
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
          downloads: { $sum: "$downloadCount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top Active Faculty Uploaders Aggregation
    const topFacultyUploaders = await QuestionPaper.aggregate([
      {
        $group: {
          _id: "$uploadedBy",
          uploadsCount: { $sum: 1 },
          totalDownloads: { $sum: "$downloadCount" },
        },
      },
      { $sort: { uploadsCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: "$userInfo.name",
          email: "$userInfo.email",
          uploadsCount: 1,
          totalDownloads: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalPapers,
          totalDownloads,
          totalUsers,
          totalFaculty,
          totalStudents,
          totalDepartments,
          totalBookmarks,
          totalDownloadHistory,
        },
        mostDownloaded,
        departmentDistribution,
        examTypeDistribution,
        yearDistribution,
        topFacultyUploaders,
      },
    });
  } catch (error) {
    next(error);
  }
};
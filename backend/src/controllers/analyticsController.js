const QuestionPaper = require("../models/QuestionPaper");

// Analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalPapers = await QuestionPaper.countDocuments();

    const totalDownloads = await QuestionPaper.aggregate([
      {
        $group: {
          _id: null,
          downloads: {
            $sum: "$downloadCount",
          },
        },
      },
    ]);

    const mostDownloaded = await QuestionPaper.find()
      .sort({ downloadCount: -1 })
      .limit(5)
      .populate("department", "name code")
      .populate("subject", "name code");

    res.status(200).json({
      success: true,
      analytics: {
        totalPapers,
        totalDownloads:
          totalDownloads.length > 0
            ? totalDownloads[0].downloads
            : 0,
        mostDownloaded,
      },
    });
  } catch (error) {
    next(error);
  }
};
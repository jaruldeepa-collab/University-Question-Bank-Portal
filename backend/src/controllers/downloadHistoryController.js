const DownloadHistory = require("../models/DownloadHistory");
const QuestionPaper = require("../models/QuestionPaper");

// Save Download History
exports.saveDownloadHistory = async (req, res, next) => {
  try {
    const history = await DownloadHistory.create({
      student: req.user._id,
      questionPaper: req.params.paperId,
    });

    // Increase download count
    await QuestionPaper.findByIdAndUpdate(req.params.paperId, {
      $inc: { downloadCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Download history saved successfully",
      history,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Download History
exports.getDownloadHistory = async (req, res, next) => {
  try {
    const history = await DownloadHistory.find({
      student: req.user._id,
    })
      .populate({
        path: "questionPaper",
        populate: [
          { path: "department", select: "name code" },
          { path: "subject", select: "name code" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};
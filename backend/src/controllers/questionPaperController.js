const QuestionPaper = require("../models/QuestionPaper");

// @desc    Upload Question Paper
// @route   POST /api/question-papers
// @access  Faculty
exports.uploadQuestionPaper = async (req, res, next) => {
  try {
    const {
      title,
      department,
      subject,
      semester,
      year,
      regulation,
      examType,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const questionPaper = await QuestionPaper.create({
      title,
      department,
      subject,
      semester,
      year,
      regulation,
      examType,
      pdfUrl: req.file.path,
      publicId: req.file.filename,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Question Paper uploaded successfully",
      questionPaper,
    });
  } catch (error) {
    next(error);
  }
};
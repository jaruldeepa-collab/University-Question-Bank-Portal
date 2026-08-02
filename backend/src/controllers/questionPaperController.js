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
// @desc    Get My Uploaded Question Papers
// @route   GET /api/question-papers/my-uploads
// @access  Faculty/Admin
exports.getMyUploads = async (req, res, next) => {
  try {
    const papers = await QuestionPaper.find({
      uploadedBy: req.user._id,
    })
      .populate("department", "name code")
      .populate("subject", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: papers.length,
      papers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Question Paper
// @route   PUT /api/question-papers/:id
// @access  Faculty/Admin
exports.updateQuestionPaper = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    if (
      paper.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const updatedPaper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Question paper updated successfully",
      questionPaper: updatedPaper,
    });
  } catch (error) {
    next(error);
  }
};
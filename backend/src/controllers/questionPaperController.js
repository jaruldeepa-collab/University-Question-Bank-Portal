const QuestionPaper = require("../models/QuestionPaper");
const Department = require("../models/Department");
const Subject = require("../models/Subject");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

// Upload Question Paper
exports.uploadQuestionPaper = async (req, res, next) => {
  try {
    let {
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

    // Ensure valid Department ObjectId
    if (!mongoose.Types.ObjectId.isValid(department)) {
      let deptDoc = await Department.findOne({
        $or: [{ code: department }, { name: department }],
      });
      if (!deptDoc) {
        deptDoc = await Department.create({
          name: department || "General Engineering",
          code: (department || "GEN").toUpperCase().slice(0, 5),
        });
      }
      department = deptDoc._id;
    }

    // Ensure valid Subject ObjectId
    if (!mongoose.Types.ObjectId.isValid(subject)) {
      let subDoc = await Subject.findOne({
        $or: [{ code: subject }, { name: subject }],
      });
      if (!subDoc) {
        subDoc = await Subject.create({
          name: subject || "General Subject",
          code: (subject || "SUB101").toUpperCase().slice(0, 6),
          department,
          semester: Number(semester) || 1,
        });
      }
      subject = subDoc._id;
    }

    const questionPaper = await QuestionPaper.create({
      title,
      department,
      subject,
      semester: Number(semester),
      year: Number(year),
      regulation,
      examType,
      pdfUrl: req.file.path || req.file.secure_url,
      publicId: req.file.filename || req.file.public_id,
      uploadedBy: req.user._id,
    });

    const populatedPaper = await QuestionPaper.findById(questionPaper._id)
      .populate("department", "name code")
      .populate("subject", "name code")
      .populate("uploadedBy", "name email");

    res.status(201).json({
      success: true,
      message: "Question Paper uploaded successfully",
      questionPaper: populatedPaper,
    });
  } catch (error) {
    console.error("Upload Question Paper Error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to upload question paper",
    });
  }
};

// Get My Uploads
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

// Update Question Paper
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
    )
      .populate("department", "name code")
      .populate("subject", "name code");

    res.status(200).json({
      success: true,
      message: "Question paper updated successfully",
      questionPaper: updatedPaper,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Question Papers
exports.getQuestionPapers = async (req, res, next) => {
  try {
    const papers = await QuestionPaper.find()
      .populate("department", "name code")
      .populate("subject", "name code")
      .populate("uploadedBy", "name email")
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

// Get Single Question Paper
exports.getQuestionPaperById = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id)
      .populate("department", "name code")
      .populate("subject", "name code")
      .populate("uploadedBy", "name email");

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    res.status(200).json({
      success: true,
      paper,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Question Paper
exports.deleteQuestionPaper = async (req, res, next) => {
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

    if (paper.publicId) {
      try {
        await cloudinary.uploader.destroy(paper.publicId, {
          resource_type: "raw",
        });
      } catch (cloudErr) {
        console.warn("Cloudinary deletion warning:", cloudErr.message);
      }
    }

    await paper.deleteOne();

    res.status(200).json({
      success: true,
      message: "Question paper deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
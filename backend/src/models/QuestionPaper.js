const mongoose = require("mongoose");

const questionPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required"],
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8,
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
    },

    regulation: {
      type: String,
      required: [true, "Regulation is required"],
      trim: true,
    },

    examType: {
      type: String,
      enum: ["CIA 1", "CIA 2", "Model", "Semester"],
      required: [true, "Exam type is required"],
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Faculty is required"],
    },

    downloadCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QuestionPaper", questionPaperSchema);
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

    yearOfStudy: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year"],
      required: [true, "Year of study is required"],
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 6,
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 2021,
      max: 2025,
    },

    month: {
      type: String,
      enum: ["April", "November"],
      required: [true, "Month is required"],
    },

    examType: {
      type: String,
      enum: ["Semester", "Internal", "Model"],
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

module.exports = mongoose.model(
  "QuestionPaper",
  questionPaperSchema
);
const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },

    questionPaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionPaper",
      required: [true, "Question Paper is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate bookmarks
bookmarkSchema.index(
  {
    student: 1,
    questionPaper: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);
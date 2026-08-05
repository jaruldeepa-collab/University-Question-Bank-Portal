const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  const { id, paperId } = req.params;

  const value = id || paperId;

  if (value && !mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  next();
};
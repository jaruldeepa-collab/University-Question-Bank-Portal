const User = require("../models/User");

// Get All Users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Get Students
exports.getStudents = async (req, res, next) => {
  try {
    const students = await User.find({
      role: "student",
    }).select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
};

// Get Faculty
exports.getFaculty = async (req, res, next) => {
  try {
    const faculty = await User.find({
      role: "faculty",
    }).select("-password");

    res.status(200).json({
      success: true,
      count: faculty.length,
      faculty,
    });
  } catch (error) {
    next(error);
  }
};
// Approve Faculty
exports.approveFaculty = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Faculty approved successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
// Activate / Deactivate User
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};
// Delete User
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
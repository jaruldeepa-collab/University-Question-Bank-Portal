const Subject = require("../models/Subject");
const Department = require("../models/Department");

// @desc    Create Subject
// @route   POST /api/subjects
// @access  Admin
exports.createSubject = async (req, res, next) => {
  try {
    const { name, code, department, semester, credits } = req.body;

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const subjectExists = await Subject.findOne({ code });

    if (subjectExists) {
      return res.status(400).json({
        success: false,
        message: "Subject code already exists",
      });
    }

    const subject = await Subject.create({
      name,
      code,
      department,
      semester,
      credits,
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Subjects
// @route   GET /api/subjects
// @access  Public
exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find()
      .populate("department", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Subject
// @route   GET /api/subjects/:id
// @access  Public
exports.getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id).populate(
      "department",
      "name code"
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Subject
// @route   PUT /api/subjects/:id
// @access  Admin
exports.updateSubject = async (req, res, next) => {
  try {
    const { department } = req.body;

    if (department) {
      const departmentExists = await Department.findById(department);

      if (!departmentExists) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("department", "name code");

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Subject
// @route   DELETE /api/subjects/:id
// @access  Admin
exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    await subject.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
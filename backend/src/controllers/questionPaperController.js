const QuestionPaper = require("../models/QuestionPaper");
const Department = require("../models/Department");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const { compressAndUploadPdf } = require("../utils/cloudinaryUpload");

// ==========================================
// Upload Question Paper
// ==========================================
exports.uploadQuestionPaper = async (req, res, next) => {
  try {
    let {
      title,
      department,
      yearOfStudy,
      semester,
      year,
      month,
      examType,
    } = req.body;

    // Check PDF
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    // Validate required fields
    if (
      !title ||
      !department ||
      !yearOfStudy ||
      !semester ||
      !year ||
      !month ||
      !examType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // ==========================================
    // Find or Auto-Create Department
    // ==========================================
    const findOrCreateDepartment = async (deptInput) => {
      if (!deptInput) return null;
      const trimmed = String(deptInput).trim();

      if (mongoose.Types.ObjectId.isValid(trimmed)) {
        const docById = await Department.findById(trimmed);
        if (docById) return docById._id;
      }

      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      let docByName = await Department.findOne({
        name: { $regex: new RegExp(`^${escapeRegex(trimmed)}$`, "i") },
      });
      if (docByName) return docByName._id;

      let docByCode = await Department.findOne({
        code: { $regex: new RegExp(`^${escapeRegex(trimmed)}$`, "i") },
      });
      if (docByCode) return docByCode._id;

      // Auto-create department if it doesn't exist in DB
      const cleanWords = trimmed.split(/\s+/).filter(Boolean);
      let generatedCode = cleanWords
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
      
      if (!generatedCode) generatedCode = "DEPT";
      generatedCode = `${generatedCode.slice(0, 8)}_${Math.floor(100 + Math.random() * 900)}`;

      const newDept = await Department.create({
        name: trimmed,
        code: generatedCode,
        description: `${trimmed} Department`,
      });

      return newDept._id;
    };

    const departmentId = await findOrCreateDepartment(department);

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "Invalid department specified",
      });
    }

    // ==========================================
    // Compress (if > 10MB) & Upload to Cloudinary
    // ==========================================
    const uploadResult = await compressAndUploadPdf(
      req.file.buffer,
      req.file.originalname
    );

    // ==========================================
    // Create Question Paper
    // ==========================================
    const questionPaper = await QuestionPaper.create({
      title: title.trim(),

      department: departmentId,

      yearOfStudy,

      semester: Number(semester),

      year: Number(year),

      month,

      examType,

      pdfUrl:
        uploadResult.secure_url ||
        uploadResult.url ||
        "",

      publicId:
        uploadResult.public_id ||
        "",

      uploadedBy: req.user._id,
    });

    // ==========================================
    // Populate Response
    // ==========================================
    const populatedPaper =
      await QuestionPaper.findById(
        questionPaper._id
      )
        .populate(
          "department",
          "name code"
        )
        .populate(
          "uploadedBy",
          "name email"
        );

    return res.status(201).json({
      success: true,
      message:
        "Question Paper uploaded successfully",
      questionPaper: populatedPaper,
    });
  } catch (error) {
    console.error(
      "Upload Question Paper Error:",
      error
    );

    let userMessage = error.message || "Failed to upload question paper";

    if (userMessage.includes('missing permissions (actions=["create"])')) {
      userMessage = "Cloudinary API Key is missing write/upload permissions. Please verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env.";
    } else if (userMessage.includes("File size too large")) {
      userMessage = "File size exceeds Cloudinary raw upload limit. The file has been compressed, please ensure the file is under 50 MB.";
    }

    return res.status(400).json({
      success: false,
      message: userMessage,
    });
  }
};

// ==========================================
// Get My Uploads
// ==========================================
exports.getMyUploads = async (
  req,
  res,
  next
) => {
  try {
    const papers =
      await QuestionPaper.find({
        uploadedBy: req.user._id,
      })
        .populate(
          "department",
          "name code"
        )
        .populate(
          "uploadedBy",
          "name email"
        )
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: papers.length,
      papers,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Question Paper
// ==========================================
exports.updateQuestionPaper = async (
  req,
  res,
  next
) => {
  try {
    const paper =
      await QuestionPaper.findById(
        req.params.id
      );

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    // Authorization
    if (
      paper.uploadedBy.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const {
      title,
      department,
      yearOfStudy,
      semester,
      year,
      month,
      examType,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (department !== undefined) {
      const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const trimmed = String(department).trim();

      let departmentDoc;
      if (mongoose.Types.ObjectId.isValid(trimmed)) {
        departmentDoc = await Department.findById(trimmed);
      }
      if (!departmentDoc) {
        departmentDoc = await Department.findOne({
          name: { $regex: new RegExp(`^${escapeRegex(trimmed)}$`, "i") },
        });
      }
      if (!departmentDoc) {
        departmentDoc = await Department.findOne({
          code: { $regex: new RegExp(`^${escapeRegex(trimmed)}$`, "i") },
        });
      }
      if (!departmentDoc) {
        const cleanWords = trimmed.split(/\s+/).filter(Boolean);
        let generatedCode = cleanWords
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "");
        if (!generatedCode) generatedCode = "DEPT";
        generatedCode = `${generatedCode.slice(0, 8)}_${Math.floor(100 + Math.random() * 900)}`;

        departmentDoc = await Department.create({
          name: trimmed,
          code: generatedCode,
          description: `${trimmed} Department`,
        });
      }

      updateData.department = departmentDoc._id;
    }

    if (yearOfStudy !== undefined) {
      updateData.yearOfStudy =
        yearOfStudy;
    }

    if (semester !== undefined) {
      updateData.semester =
        Number(semester);
    }

    if (year !== undefined) {
      updateData.year = Number(year);
    }

    if (month !== undefined) {
      updateData.month = month;
    }

    if (examType !== undefined) {
      updateData.examType = examType;
    }

    // Handle Optional PDF File Update
    if (req.file) {
      // Upload new PDF to Cloudinary
      const uploadResult = await compressAndUploadPdf(
        req.file.buffer,
        req.file.originalname
      );

      // Delete old PDF from Cloudinary if existing
      if (paper.publicId) {
        try {
          await cloudinary.uploader.destroy(paper.publicId, {
            resource_type: "raw",
          });
        } catch (cloudErr) {
          console.warn("Cloudinary old file cleanup warning:", cloudErr.message);
        }
      }

      updateData.pdfUrl =
        uploadResult.secure_url || uploadResult.url || "";
      updateData.publicId = uploadResult.public_id || "";
    }

    const updatedPaper =
      await QuestionPaper.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "department",
          "name code"
        )
        .populate(
          "uploadedBy",
          "name email"
        );

    return res.status(200).json({
      success: true,
      message:
        "Question paper updated successfully",
      questionPaper: updatedPaper,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get All Question Papers
// ==========================================
exports.getQuestionPapers = async (
  req,
  res,
  next
) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const sort =
      req.query.sort || "-createdAt";

    const skip = (page - 1) * limit;

    const total =
      await QuestionPaper.countDocuments();

    const papers =
      await QuestionPaper.find()
        .populate(
          "department",
          "name code"
        )
        .populate(
          "uploadedBy",
          "name email"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(
        total / limit
      ),
      totalResults: total,
      count: papers.length,
      papers,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Single Question Paper
// ==========================================
exports.getQuestionPaperById = async (
  req,
  res,
  next
) => {
  try {
    const paper =
      await QuestionPaper.findById(
        req.params.id
      )
        .populate(
          "department",
          "name code"
        )
        .populate(
          "uploadedBy",
          "name email"
        );

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    return res.status(200).json({
      success: true,
      paper,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete Question Paper
// ==========================================
exports.deleteQuestionPaper = async (
  req,
  res,
  next
) => {
  try {
    const paper =
      await QuestionPaper.findById(
        req.params.id
      );

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    // Authorization: Allow uploader, faculty, or admin to delete paper
    if (
      paper.uploadedBy?.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "faculty"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this question paper",
      });
    }

    // Delete PDF from Cloudinary
    if (paper.publicId) {
      try {
        await cloudinary.uploader.destroy(
          paper.publicId,
          {
            resource_type: "raw",
          }
        );
      } catch (cloudErr) {
        console.warn(
          "Cloudinary deletion warning:",
          cloudErr.message
        );
      }
    }

    await paper.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Question paper deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Search Question Papers
// ==========================================
exports.searchQuestionPapers = async (
  req,
  res,
  next
) => {
  try {
    const { keyword } = req.query;

    let query = {};

    if (keyword) {
      query = {
        title: {
          $regex: keyword,
          $options: "i",
        },
      };
    }

    const papers =
      await QuestionPaper.find(query)
        .populate(
          "department",
          "name code"
        )
        .populate(
          "uploadedBy",
          "name email"
        )
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: papers.length,
      papers,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Filter Question Papers
// ==========================================
exports.filterQuestionPapers = async (
  req,
  res,
  next
) => {
  try {
    const {
      department,
      yearOfStudy,
      semester,
      year,
      month,
      examType,
    } = req.query;

    const query = {};

    // Department
    if (department) {
      if (
        mongoose.Types.ObjectId.isValid(
          department
        )
      ) {
        query.department = department;
      } else {
        const departmentDoc =
          await Department.findOne({
            name: department,
          });

        if (departmentDoc) {
          query.department =
            departmentDoc._id;
        }
      }
    }

    // Year of Study
    if (yearOfStudy) {
      query.yearOfStudy =
        yearOfStudy;
    }

    // Semester
    if (semester) {
      query.semester =
        Number(semester);
    }

    // Year
    if (year) {
      query.year = Number(year);
    }

    // Month
    if (month) {
      query.month = month;
    }

    // Exam Type
    if (examType) {
      query.examType = examType;
    }

    const papers =
      await QuestionPaper.find(query)
        .populate(
          "department",
          "name code"
        )
        .populate(
          "uploadedBy",
          "name email"
        )
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: papers.length,
      papers,
    });
  } catch (error) {
    next(error);
  }
};
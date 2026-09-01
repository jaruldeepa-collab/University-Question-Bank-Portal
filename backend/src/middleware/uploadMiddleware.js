const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("FILE FIELD NAME:", file.fieldname);
  console.log("FILE NAME:", file.originalname);
  console.log("FILE TYPE:", file.mimetype);

  if (
    file.fieldname === "pdf" &&
    (
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf")
    )
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    // 50 MB
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = upload;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const logger = require("./middleware/loggerMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const questionPaperRoutes = require("./routes/questionPaperRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const downloadHistoryRoutes = require("./routes/downloadHistoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userManagementRoutes = require("./routes/userManagementRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// ==========================
// Body Parser
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// Cookie Parser
// ==========================
app.use(cookieParser());

// ==========================
// CORS
// ==========================
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
      ].filter(Boolean);

      // Allow requests with no origin (like mobile apps, curl) or matching allowed origins
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// ==========================
// Logger Middleware
// ==========================
app.use(logger);

// ==========================
// API Routes
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/question-papers", questionPaperRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/download-history", downloadHistoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userManagementRoutes);
app.use("/api/analytics", analyticsRoutes);


// ==========================
// Home Route
// ==========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "University Question Bank API Running...",
  });
});

// ==========================
// Test Error Route
// ==========================
app.get("/api/error", (req, res, next) => {
  const error = new Error("This is a test error");
  error.statusCode = 500;
  next(error);
});

// ==========================
// 404 Route
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`,
  });
});

// ==========================
// Global Error Handler
// ==========================
app.use(errorHandler);

module.exports = app;
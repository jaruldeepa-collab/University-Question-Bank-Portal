const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const logger = require("./middleware/loggerMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

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
    origin: process.env.CLIENT_URL,
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
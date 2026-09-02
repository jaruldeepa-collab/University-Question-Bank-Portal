# 📑 Comprehensive Project Report: University Question Bank Portal

**Project Title**: University Question Bank Portal  
**Domain**: Web Application / Academic Knowledge Management System  
**Author**: Arul Deepa  
**Repository**: `jaruldeepa-collab/University-Question-Bank-Portal`  
**Date**: September 2026  

---

## 1. Executive Summary
The **University Question Bank Portal** is a web-based academic platform designed to streamline the storage, retrieval, verification, and distribution of previous semester university question papers. Built with a modern MERN-stack architecture (MongoDB, Express, React, Node.js) and enhanced with TailwindCSS v4 and Cloudinary PDF asset management, the application addresses common challenges faced by university students and faculty—such as fragmented study materials, unverified uploads, and inefficient search tools.

The platform provides dedicated user experiences for three primary user roles:
1. **Students**: Access verified semester exam papers, search/filter by academic criteria, preview PDFs in-browser, download papers, and maintain personal bookmarks and download history.
2. **Faculty**: Upload question paper PDFs with automated compression, manage published materials, track download statistics, and update subject metadata.
3. **Administrators**: Verify and approve pending faculty accounts, manage user statuses, perform CRUD operations on departments and course subjects, monitor system metrics, and export CSV/PDF analytical reports.

---

## 2. Problem Statement & Motivation
In many academic institutions, access to past question papers is decentralized or dependent on unofficial student drives, leading to:
- **Incomplete or Mislabeled Question Papers**: Students often spend significant time locating past paper sets.
- **Security & Authorization Risks**: Lack of verification for faculty members uploading materials.
- **Storage & Bandwidth Overhead**: Uploading large PDF files causes storage bloat and slow downloads without compression.
- **Absence of Central Analytics**: Academic departments lack visibility into which course subjects have sufficient reference materials or high student engagement.

**Solution**: The University Question Bank Portal solves these challenges by providing a secure, centralized repository equipped with role-based access control, Cloudinary PDF compression, real-time analytics, dynamic dark mode, and responsive UI interfaces.

---

## 3. System Architecture & Modules

```
+-----------------------------------------------------------------------+
|                             USER INTERFACE                            |
|    React 18 + Redux Toolkit + TailwindCSS v4 + Dark Mode Engine       |
+----------------------------------- font-------------------------------+
                                    | HTTP / REST API (Axios + Cookies)
                                    v
+-----------------------------------------------------------------------+
|                           BACKEND API ENGINE                          |
|    Node.js + Express.js + JWT Auth + Multer Upload Middleware         |
+-----------------------------------------------------------------------+
           |                                             |
           v MongoDB Driver (Mongoose ODM)               v Cloudinary SDK
+---------------------------------------+   +---------------------------+
|             MONGODB ATLAS             |   |     CLOUDINARY STORAGE    |
|   Users, Papers, Depts, Subjects,     |   |   Raw PDF Storage &       |
|   Bookmarks, DownloadHistory          |   |   Automated Compression   |
+---------------------------------------+   +---------------------------+
```

### Module Breakdown:
1. **Authentication & Authorization Module**:
   - Secure registration, login, and HttpOnly cookie JWT session handling.
   - Role-based middleware (`protect`, `authorize("admin", "faculty")`).
   - Forgot password and token-based password reset via Nodemailer.
2. **Question Paper Repository Module**:
   - PDF upload via Multer memory storage and Cloudinary raw upload handler with automatic PDF compression for files exceeding 10MB.
   - Comprehensive multi-parameter filtering engine (Department, Semester, Year of Study, Academic Year, Exam Type).
3. **Faculty Verification & User Management Module**:
   - Two-step verification queue for faculty members (`isApproved: false` by default until admin approval).
   - Account activation/deactivation toggle (`isActive`) and safe deletion handlers.
4. **Academic Catalog Module**:
   - Full Department CRUD and Subject/Course catalog management.
5. **Analytics & Reporting Engine Module**:
   - MongoDB aggregation pipelines calculating department paper density, exam type distribution ratios, academic year trends, and top faculty uploaders.
   - Browser-side CSV report exporter and printable PDF summary generator.

---

## 4. Database Schema Design (MongoDB Mongoose)

### 4.1 `User` Schema
```js
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["student", "faculty", "admin"], default: "student" },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true }
```

### 4.2 `QuestionPaper` Schema
```js
{
  title: { type: String, required: true, trim: true },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject" },
  yearOfStudy: { type: String, enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"] },
  semester: { type: Number, required: true, min: 1, max: 8 },
  year: { type: Number, required: true },
  month: { type: String, required: true },
  examType: { type: String, enum: ["Semester", "Internal", "Model"], required: true },
  pdfUrl: { type: String, required: true },
  publicId: { type: String },
  downloadCount: { type: Number, default: 0 },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true }
```

---

## 5. Security & Performance Considerations

- **Password Security**: Passwords hashed using `bcryptjs` with 10 salt rounds.
- **JWT Cookie Security**: Authentication tokens issued via HttpOnly, SameSite cookies to protect against XSS attacks.
- **Input Validation**: Sanitization of request parameters, Object ID validation middleware (`validateObjectId`), and regex escape routines.
- **PDF Compression**: Integration of `pdf-lib` to compress PDF streams prior to Cloudinary transmission, reducing bandwidth overhead by up to 60%.
- **Vite Production Bundling**: Client code compiled into optimized production chunks (`dist/`), built in under 1 second.

---

## 6. Conclusion & Future Scope

The **University Question Bank Portal** successfully provides a robust, scalable, and aesthetically engaging platform for academic resource management. Future enhancements may include:
- Optical Character Recognition (OCR) to automatically index text content within uploaded PDF question papers.
- AI-driven question classification and difficulty tagging.
- Mobile application client using React Native sharing the backend API layer.

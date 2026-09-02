# 🏛 University Question Bank Portal

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-emerald)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%20v4-sky)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

A modern, full-stack **University Question Bank Portal** built with React, Redux Toolkit, TailwindCSS, Node.js, Express, MongoDB Mongoose, and Cloudinary. Designed for academic institutions to centralize, search, filter, preview, download, and manage previous semester question papers with role-based access for **Students**, **Faculty**, and **Administrators**.

---

## 🌟 Key Features

### 🎓 Student Portal
- **Advanced Search & Filtering**: Search question papers by title, department, subject, semester, academic year, and exam type (Semester, Internal, Model).
- **PDF Preview & Fast Downloads**: Preview question paper PDFs directly in the browser via custom modal viewer or download with 1 click.
- **Bookmarks & History**: Save favorite papers for quick study access and review full personal download history.

### 👨‍🏫 Faculty Portal
- **PDF Question Paper Upload**: Upload question papers with automated Cloudinary raw PDF storage & compression for large files.
- **My Uploads & Management**: View, edit paper metadata, replace PDF documents, and track download counts.
- **Upload Analytics**: Departmental breakdown and download statistics for faculty contributions.

### 🛡 Administrator & Verification Hub
- **Executive Admin Dashboard**: Real-time KPI counters (Users, Students, Faculty, Pending Approvals, Papers, Downloads, Departments, Subjects).
- **Faculty Approval Workflow**: Verification queue to review and approve newly registered faculty accounts.
- **User Management**: Activate/deactivate accounts, assign roles, and manage system access.
- **Department & Subject Management**: Full CRUD operations for academic departments and course catalogs.
- **Analytics & Report Generation**: Visual bar and distribution charts with one-click **CSV Report Export** & **Print Summary PDF**.

### 🎨 User Experience & Polish
- **Dark Mode & Theme Persistence**: Instant Light / Dark mode toggle with `localStorage` preference memory.
- **Toast Notifications & Loading Skeletons**: Floating toast alert system and responsive card/table pulse skeletons.
- **Responsive & Accessible**: Mobile drawer navigation and optimized touch controls across all screen sizes.

---

## 🛠 Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Redux Toolkit, TailwindCSS v4 |
| **Backend** | Node.js, Express.js, Mongoose ODM, JWT, Cookie-Parser, Multer |
| **Cloud & Storage** | Cloudinary API (PDF Raw Uploads & Compression), MongoDB Atlas |
| **Deployment** | Vercel (Frontend SPA), Azure App Service (Backend API) |

---

## 📁 Repository Directory Structure

```
University-Question-Bank-Portal/
├── backend/
│   ├── src/
│   │   ├── config/         # Cloudinary & Database configuration
│   │   ├── controllers/    # Auth, Paper, Admin, User, Department, Subject, Analytics controllers
│   │   ├── middleware/     # Auth, Logger, Upload, ValidateObjectId, Error handler
│   │   ├── models/         # User, QuestionPaper, Department, Subject, Bookmark, DownloadHistory
│   │   ├── routes/         # Express API routing endpoints
│   │   ├── services/       # Email & utility services
│   │   ├── utils/          # Cloudinary PDF upload helper & JWT generators
│   │   ├── app.js          # Express app entry & CORS setup
│   │   └── server.js       # HTTP server launcher
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/         # Hero images & graphics
│   │   ├── components/     # Navbar, Sidebar, Modals, Cards, Skeletons, ThemeToggle, EmptyState
│   │   ├── context/        # ThemeContext & ToastContext
│   │   ├── layouts/        # MainLayout dashboard wrapper
│   │   ├── pages/          # Home, Search, Bookmarks, History, Upload, MyUploads, Admin, Users, Depts, Subjects, Analytics, 404
│   │   ├── redux/          # Auth Redux slice & store
│   │   ├── routes/         # AppRoutes React Router configuration
│   │   └── services/       # Axios API client
│   ├── vercel.json         # Vercel SPA rewrite configuration
│   └── package.json
├── DEPLOYMENT.md           # Step-by-step deployment guide
├── PROJECT_REPORT.md       # Comprehensive technical report
├── PROJECT_PRESENTATION_PPT.md # Presentation slide deck script
└── DEMO_VIDEO_SCRIPT.md    # Video walkthrough script
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.x or v20.x LTS)
- MongoDB Atlas or local MongoDB instance
- Cloudinary Account (for PDF file storage)

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/question_bank?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```
Run backend dev server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Run frontend dev server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoint Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue cookie |
| `GET` | `/api/question-papers` | Public | Fetch question papers with pagination |
| `GET` | `/api/question-papers/search` | Public | Search papers by keyword |
| `GET` | `/api/question-papers/filter` | Public | Filter papers by department, sem, year, exam |
| `GET` | `/api/question-papers/my-uploads` | Faculty/Admin | Get uploads by logged-in faculty |
| `POST` | `/api/question-papers` | Faculty/Admin | Upload new PDF question paper |
| `PUT` | `/api/question-papers/:id` | Faculty/Admin | Update paper metadata or replace PDF |
| `DELETE` | `/api/question-papers/:id` | Faculty/Admin | Delete question paper & Cloudinary asset |
| `GET` | `/api/admin/dashboard` | Admin/Faculty | Fetch dashboard counters & recent papers |
| `GET` | `/api/users/faculty` | Admin/Faculty | Fetch faculty members list |
| `PUT` | `/api/users/:id/approve` | Admin/Faculty | Approve pending faculty registration |
| `GET` | `/api/departments` | Public | Get all academic departments |
| `POST` | `/api/departments` | Admin/Faculty | Create new academic department |
| `GET` | `/api/analytics` | Admin/Faculty | Fetch aggregate distribution & stats |

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.

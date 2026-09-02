# 📊 Presentation Slide Deck (PPT Outline)
## Project: University Question Bank Portal

---

### Slide 1: Title Slide
- **Title**: University Question Bank Portal
- **Subtitle**: A Centralized Web Platform for Academic Resource Sharing, PDF Management, and Analytics
- **Presenter**: Arul Deepa
- **Tech Stack**: MERN Stack (MongoDB, Express, React, Node.js) + TailwindCSS v4 + Cloudinary

---

### Slide 2: Project Overview & Objectives
- **Central Goal**: Provide a secure, user-friendly, and searchable web portal for university question papers.
- **Key Objectives**:
  - Eliminate fragmented study drives and unverified upload links.
  - Implement role-based access for Students, Faculty, and Admins.
  - Automate PDF storage, Cloudinary compression, and download analytics.

---

### Slide 3: Problem Statement
- **Fragmented Materials**: Students struggle to find organized past question papers.
- **Verification Gaps**: Storage of unauthorized or inaccurate papers by non-faculty users.
- **Storage Bloat**: Large PDF files straining server memory without compression.
- **Zero Analytics**: Lack of insights into department upload coverage and paper usage.

---

### Slide 4: Proposed Solution & Core Value
- **Role-Based Access**: Dedicated portals tailored for Student, Faculty, and Admin personas.
- **Instant Search & Multi-Filters**: Filter by department, semester, exam type (Semester, Internal, Model), and academic year.
- **In-Browser PDF Preview**: View question paper PDFs directly in a custom modal before downloading.
- **Faculty Approval Queue**: Multi-tier verification ensuring only approved faculty can publish materials.

---

### Slide 5: System Architecture Diagram
```
[React 18 Frontend] <---> [Express.js API Router] <---> [MongoDB Atlas DB]
                                   |
                                   +---> [Cloudinary PDF Compression & Storage]
```

---

### Slide 6: Technology Stack Breakdown
- **Frontend**: React 18, Vite, Redux Toolkit, TailwindCSS v4, Lucide Icons
- **Backend**: Node.js, Express.js, JWT Authentication, Multer, `pdf-lib`
- **Cloud & Database**: MongoDB Atlas Mongoose ODM, Cloudinary SDK
- **Deployment**: Vercel (Frontend), Azure App Service (Backend API)

---

### Slide 7: Database Design (Mongoose Schema)
- **`User` Collection**: Stores Name, Email, Hashed Password, Role, Approval Status (`isApproved`), Active Status (`isActive`).
- **`QuestionPaper` Collection**: Stores Title, Department ID, Semester, Year, Exam Type, PDF URL, Public ID, Download Count, UploadedBy ID.
- **`Department` & `Subject` Collections**: Academic catalog taxonomies.
- **`Bookmark` & `DownloadHistory` Collections**: User student state tracking.

---

### Slide 8: Student Portal Features
- **Dashboard**: Quick search bar, featured papers, download metrics.
- **Filter Bar**: Department, Exam Type, Semester, Academic Year.
- **PDF Preview Modal**: Full-screen preview with instant download action.
- **Bookmarks & History**: Personal study library management.

---

### Slide 9: Faculty Portal & PDF Upload Engine
- **PDF Upload Form**: Drag & drop PDF files with client validation.
- **Automatic Cloudinary Compression**: Automatic buffer compression via `pdf-lib` for large files.
- **My Uploads Management**: Edit paper details, replace PDF documents, and delete papers with Cloudinary asset cleanup.
- **Upload Statistics**: Visual cards showing total uploads, total downloads, and top department.

---

### Slide 10: Admin Dashboard & Verification Hub
- **Executive KPI Cards**: Real-time totals for Users, Students, Faculty, Pending Approvals, Papers, and Downloads.
- **Faculty Approval Queue**: One-click verification and access approval for new faculty sign-ups.
- **User Management Table**: Activate, deactivate, or remove user accounts.
- **Academic Catalog**: Complete CRUD management for Departments and Course Subjects.

---

### Slide 11: Analytics & Exportable Reports Engine
- **Visual Distribution Charts**: Department upload density bar visualizer and exam type distribution breakdown.
- **Leaderboards**: Top 5 most downloaded question papers & top faculty contributors.
- **CSV & PDF Report Export**: 1-click **Export CSV Report** download and printable summary layout.

---

### Slide 12: Dark Mode & User Experience Polish
- **Theme Persistence**: Dark / Light mode toggle with `localStorage` memory and system preferences check.
- **Toast Notifications**: Floating Toast alert system (`useToast()`).
- **Skeleton Loaders**: Smooth pulse skeletons for cards, tables, and metric blocks during API loading states.
- **Custom 404 Page**: Interactive error page with quick navigation shortcuts.

---

### Slide 13: Deployment Architecture
- **Database**: MongoDB Atlas Cluster with IP access control.
- **Backend API**: Azure App Service Linux Node instance configured with environment settings.
- **Frontend App**: Vercel Single-Page App deployment with automatic rewrite rules (`vercel.json`).

---

### Slide 14: Results & Demonstrable Metrics
- **Sub-Second Build Time**: Vite build completes in under 1 second (124 modules).
- **Reduced Storage Footprint**: PDF compression reduces file sizes by up to 60%.
- **Zero 404 Reload Issues**: Vercel rewrite configuration handles direct deep links.

---

### Slide 15: Conclusion & Q&A
- **Summary**: Delivered a complete, production-ready, full-stack Question Bank Portal.
- **Questions & Discussion**: Open for questions!

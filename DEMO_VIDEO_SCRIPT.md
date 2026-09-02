# 🎬 Project Demo Video Script & Walkthrough Guide

**Project Title**: University Question Bank Portal  
**Target Duration**: 5 to 6 minutes  
**Format**: Screen Recording + Voiceover Walkthrough  

---

## ⏱ Video Timeline Breakdown

| Timecode | Segment | Key Demo Actions & Voiceover Script |
| :--- | :--- | :--- |
| **00:00 - 00:30** | **1. Introduction** | **Screen**: Landing / Login Page.<br>**Voiceover**: "Welcome to the demonstration of the University Question Bank Portal—a full-stack web application designed for centralizing, searching, previewing, and managing university question papers for Students, Faculty, and Administrators." |
| **00:30 - 01:30** | **2. Student Experience** | **Screen**: Student Dashboard & Search Page (`/search`).<br>**Actions**: Demonstrate typing in the search bar, filtering by Department (`Computer Science`), Exam Type (`Semester`), and Semester (`5`). Click **Preview** to open the PDF preview modal. Click **Download** and **Bookmark**.<br>**Voiceover**: "Students can instantly search and filter past question papers, preview PDF documents directly in the browser, download files with 1 click, and manage their personal study bookmarks." |
| **01:30 - 03:00** | **3. Faculty Upload & Management** | **Screen**: Switch to Faculty Account → Upload Paper Page (`/faculty/upload`) & My Uploads (`/faculty/uploads`).<br>**Actions**: Show uploading a PDF paper form. Highlight automatic Cloudinary upload & compression. Navigate to **My Uploads**, edit paper metadata using `EditPaperModal`, and check **Upload Statistics** tab.<br>**Voiceover**: "Faculty members can upload PDF question papers. The backend handles Cloudinary storage and automated compression for large files. Faculty can edit metadata, replace PDFs, or delete papers, while monitoring paper download counts." |
| **03:00 - 04:30** | **4. Admin Portal & Faculty Approvals** | **Screen**: Switch to Admin Account → Admin Dashboard (`/admin`) & Faculty Approvals (`/admin/faculty-approvals`).<br>**Actions**: Show the 8 KPI stat cards. Show the **Pending Faculty Verification Queue**. Click **Approve Access** on a pending faculty member. Navigate to **Department Management** & **Subject Management**.<br>**Voiceover**: "Administrators have access to real-time system metrics and a dedicated verification queue. Newly registered faculty require admin approval before uploading materials. Admins can also manage user accounts and perform full CRUD operations on departments and subjects." |
| **04:30 - 05:30** | **5. Analytics, Reports & Dark Mode** | **Screen**: Analytics Page (`/admin/analytics`).<br>**Actions**: Show department bar charts, exam distribution, top 5 downloaded papers leaderboard. Click **Export CSV Report** to download the spreadsheet report. Click the **Dark Mode Toggle** (🌙 / ☀️) in the Navbar to showcase the dark theme transition across pages.<br>**Voiceover**: "The portal includes comprehensive analytics with visual charts and 1-click CSV report exporting. Plus, with built-in Dark Mode and theme persistence, users can switch between light and dark themes anytime." |
| **05:30 - 06:00** | **6. Conclusion** | **Screen**: Architecture slide / Project Summary.<br>**Voiceover**: "In summary, the University Question Bank Portal provides a production-ready, secure, and responsive solution for academic paper management. Thank you for watching!" |

---

## 📽 Recommended Recording Setup
1. **Resolution**: 1920x1080 (1080p 60fps)
2. **Browser Window**: Full screen or 16:9 viewport.
3. **Accounts to Prepare**:
   - `student@university.edu` (Student Role)
   - `faculty@university.edu` (Faculty Role - Approved)
   - `admin@university.edu` (Admin Role)

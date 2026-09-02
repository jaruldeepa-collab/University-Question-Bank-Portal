import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/HomePage";
import SearchPapersPage from "../pages/SearchPapersPage";
import BookmarksPage from "../pages/BookmarksPage";
import DownloadHistoryPage from "../pages/DownloadHistoryPage";
import ProfilePage from "../pages/ProfilePage";

import FacultyDashboardPage from "../pages/FacultyDashboardPage";
import UploadPaperPage from "../pages/UploadPaperPage";
import MyUploadsPage from "../pages/MyUploadsPage";

import AdminDashboardPage from "../pages/AdminDashboardPage";
import UserManagementPage from "../pages/UserManagementPage";
import DepartmentManagementPage from "../pages/DepartmentManagementPage";
import SubjectManagementPage from "../pages/SubjectManagementPage";
import FacultyApprovalsPage from "../pages/FacultyApprovalsPage";
import AnalyticsPage from "../pages/AnalyticsPage";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            Protected Routes
        ========================== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* Student / Common */}

            <Route
              path="/"
              element={<HomePage />}
            />

            <Route
              path="/search"
              element={<SearchPapersPage />}
            />

            <Route
              path="/bookmarks"
              element={<BookmarksPage />}
            />

            <Route
              path="/downloads"
              element={<DownloadHistoryPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            {/* =========================
                Faculty Routes
            ========================== */}

            {/* Faculty Dashboard */}
            <Route
              path="/faculty"
              element={<FacultyDashboardPage />}
            />

            {/* Upload Question Paper */}
            <Route
              path="/faculty/upload"
              element={<UploadPaperPage />}
            />

            {/* My Uploads */}
            <Route
              path="/faculty/uploads"
              element={<MyUploadsPage />}
            />

            {/* =========================
                Admin Routes
            ========================== */}

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={<AdminDashboardPage />}
            />

            {/* User Management */}
            <Route
              path="/admin/users"
              element={<UserManagementPage />}
            />

            {/* Department Management */}
            <Route
              path="/admin/departments"
              element={<DepartmentManagementPage />}
            />

            {/* Subject Management */}
            <Route
              path="/admin/subjects"
              element={<SubjectManagementPage />}
            />

            {/* Faculty Approvals */}
            <Route
              path="/admin/faculty-approvals"
              element={<FacultyApprovalsPage />}
            />

            {/* Analytics & Reports */}
            <Route
              path="/admin/analytics"
              element={<AnalyticsPage />}
            />

          </Route>
        </Route>

        {/* =========================
            Public Routes
        ========================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />

        {/* =========================
            404
        ========================== */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import SearchPapersPage from "../pages/SearchPapersPage";
import BookmarksPage from "../pages/BookmarksPage";
import DownloadHistoryPage from "../pages/DownloadHistoryPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProtectedRoute from "../components/ProtectedRoute";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">
          404
        </h1>

        <p className="mt-3 text-xl text-slate-600">
          Page Not Found
        </p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
  <Route path="/" element={<HomePage />} />

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
</Route>
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
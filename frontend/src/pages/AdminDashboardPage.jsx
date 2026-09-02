import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../services/api";
import PdfPreviewModal from "../components/PdfPreviewModal";

function AdminDashboardPage() {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalFaculty: 0,
    pendingFaculty: 0,
    totalDepartments: 0,
    totalSubjects: 0,
    totalQuestionPapers: 0,
    totalBookmarks: 0,
    totalDownloads: 0,
  });

  const [recentPapers, setRecentPapers] = useState([]);
  const [pendingFacultyList, setPendingFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [previewPaper, setPreviewPaper] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, recentRes, facultyRes] = await Promise.allSettled([
        api.get("/admin/dashboard"),
        api.get("/admin/recent-uploads"),
        api.get("/users/faculty"),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.data?.success) {
        setStats(statsRes.value.data.stats || {});
      }

      if (recentRes.status === "fulfilled" && recentRes.value.data?.success) {
        setRecentPapers(recentRes.value.data.papers || []);
      }

      if (facultyRes.status === "fulfilled" && facultyRes.value.data?.success) {
        const unapproved = (facultyRes.value.data.faculty || []).filter(
          (f) => !f.isApproved
        );
        setPendingFacultyList(unapproved);
      }
    } catch (err) {
      console.error("Admin Dashboard Fetch Error:", err);
      setError("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveFaculty = async (facultyId, facultyName) => {
    try {
      setApprovingId(facultyId);
      setError("");

      const response = await api.put(`/users/${facultyId}/approve`);

      if (response.data.success) {
        setSuccessMessage(`Faculty member "${facultyName}" has been approved!`);
        setPendingFacultyList((prev) => prev.filter((f) => f._id !== facultyId));
        setStats((prev) => ({
          ...prev,
          pendingFaculty: Math.max(0, (prev.pendingFaculty || 1) - 1),
        }));

        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Approve faculty error:", err);
      setError(
        err.response?.data?.message || "Failed to approve faculty member."
      );
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <span>🛡 System Administration</span>
            <span>•</span>
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-blue-300">
              {user?.role?.toUpperCase() || "ADMIN"}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-black sm:text-4xl">
            Welcome back, {user?.name || "Administrator"}! 👋
          </h1>

          <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-300">
            Overview of university question bank operations, user accounts, approval queues, and system statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-blue-500"
          >
            👥 Manage Users
          </Link>

          <button
            onClick={fetchDashboardData}
            title="Refresh Dashboard Metrics"
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            🔄
          </button>
        </div>
      </section>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <span>✅ {successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-600 hover:text-green-800"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Metrics Grid (8 Cards) */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-800">
          System Key Metrics
        </h2>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Users
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                  👥
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-800">
                {stats.totalUsers || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Registered platform accounts
              </p>
            </div>

            {/* Total Students */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Students
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-700">
                  🎓
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-800">
                {stats.totalStudents || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Active student accounts
              </p>
            </div>

            {/* Total Faculty */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                  Faculty Members
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-lg text-purple-700">
                  👨‍🏫
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-800">
                {stats.totalFaculty || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Registered teaching staff
              </p>
            </div>

            {/* Pending Approvals */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Pending Faculty
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-200 text-lg text-amber-900">
                  ⏳
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-amber-900">
                {stats.pendingFaculty || pendingFacultyList.length || 0}
              </p>
              <p className="mt-1 text-[11px] text-amber-700 font-medium">
                Awaiting admin verification
              </p>
            </div>

            {/* Question Papers */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                  Question Papers
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-lg text-sky-700">
                  📄
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-800">
                {stats.totalQuestionPapers || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Published question papers
              </p>
            </div>

            {/* Total Downloads */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                  Total Downloads
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-lg text-indigo-700">
                  ⬇
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-800">
                {stats.totalDownloads || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Student paper downloads
              </p>
            </div>

            {/* Total Departments */}
            <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                  Departments
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-lg text-rose-700">
                  🏛
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-800">
                {stats.totalDepartments || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Active academic departments
              </p>
            </div>

            {/* Total Subjects */}
            <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                  Subjects
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-lg text-violet-700">
                  📘
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-800">
                {stats.totalSubjects || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Cataloged course subjects
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Pending Faculty Approvals Banner Section */}
      {pendingFacultyList.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <span className="text-xl">⚠️</span>
              <h3 className="text-base font-bold">
                Pending Faculty Verification Queue ({pendingFacultyList.length})
              </h3>
            </div>

            <Link
              to="/admin/users?filter=pending"
              className="text-xs font-semibold text-amber-800 hover:underline"
            >
              View All in User Management →
            </Link>
          </div>

          <div className="divide-y divide-amber-200/60 rounded-xl bg-white p-2 shadow-inner">
            {pendingFacultyList.map((faculty) => (
              <div
                key={faculty._id}
                className="flex flex-col gap-3 py-3 px-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-900">
                    {faculty.name?.charAt(0)?.toUpperCase() || "F"}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {faculty.name}
                    </h4>
                    <p className="text-xs text-slate-500">{faculty.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                    Pending Approval
                  </span>

                  <button
                    onClick={() =>
                      handleApproveFaculty(faculty._id, faculty.name)
                    }
                    disabled={approvingId === faculty._id}
                    className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {approvingId === faculty._id
                      ? "Approving..."
                      : "✅ Approve Access"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Grid: Recent Uploads & Quick Navigation */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Uploaded Papers (2 cols) */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Recent Question Paper Uploads 📄
              </h3>
              <p className="text-xs text-slate-500">
                Latest papers published across all departments
              </p>
            </div>

            <Link
              to="/search"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Browse All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : recentPapers.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No recent uploads recorded.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPapers.map((paper) => {
                const deptName =
                  typeof paper.department === "object"
                    ? paper.department?.name
                    : paper.department || "General";
                const uploaderName =
                  typeof paper.uploadedBy === "object"
                    ? paper.uploadedBy?.name
                    : "Faculty";

                return (
                  <div
                    key={paper._id}
                    className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/60 px-2 rounded-xl transition"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-lg">
                        📄
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-slate-800">
                          {paper.title}
                        </h4>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {deptName}
                          </span>
                          <span>•</span>
                          <span>By {uploaderName}</span>
                          <span>•</span>
                          <span>
                            {paper.month} {paper.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-xs">
                      {paper.examType && (
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                          {paper.examType}
                        </span>
                      )}

                      {paper.pdfUrl && (
                        <button
                          onClick={() => setPreviewPaper(paper)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-100"
                        >
                          👁 Preview
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Column: Quick System Actions */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
            Quick Actions & Links ⚡️
          </h3>

          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 transition hover:border-blue-300 hover:bg-blue-50/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">
                  👥
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    User Management
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Manage roles, activate/deactivate
                  </p>
                </div>
              </div>
              <span className="text-slate-400">→</span>
            </Link>

            <Link
              to="/faculty/upload"
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 transition hover:border-emerald-300 hover:bg-emerald-50/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                  📤
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Upload Question Paper
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Add new question paper PDF
                  </p>
                </div>
              </div>
              <span className="text-slate-400">→</span>
            </Link>

            <Link
              to="/faculty/uploads"
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 transition hover:border-purple-300 hover:bg-purple-50/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-bold">
                  📄
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    My Uploads & Stats
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Edit papers and view stats
                  </p>
                </div>
              </div>
              <span className="text-slate-400">→</span>
            </Link>

            <Link
              to="/search"
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 transition hover:border-indigo-300 hover:bg-indigo-50/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold">
                  🔍
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Question Paper Search
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Filter by dept, semester, year
                  </p>
                </div>
              </div>
              <span className="text-slate-400">→</span>
            </Link>
          </div>
        </section>
      </div>

      {/* PDF Preview Modal */}
      {previewPaper && (
        <PdfPreviewModal
          paper={previewPaper}
          onClose={() => setPreviewPaper(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboardPage;

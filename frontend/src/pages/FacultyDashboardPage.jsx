import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import api from "../services/api";
import PdfPreviewModal from "../components/PdfPreviewModal";
import EditPaperModal from "../components/EditPaperModal";
import { useToast } from "../context/ToastContext";

function FacultyDashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const toast = useToast();

  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Preview, Edit & Delete State
  const [previewPaper, setPreviewPaper] = useState(null);
  const [editPaperTarget, setEditPaperTarget] = useState(null);
  const [deletePaperTarget, setDeletePaperTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyUploads = async () => {
    try {
      setLoading(true);
      setError("");

      let papersList = [];

      try {
        const resMy = await api.get("/question-papers/my-uploads");
        if (resMy.data.success && Array.isArray(resMy.data.papers)) {
          papersList = resMy.data.papers;
        }
      } catch (myErr) {
        console.warn("my-uploads fetch notice:", myErr?.response?.data?.message || myErr.message);
      }

      if (!papersList || papersList.length === 0) {
        const resAll = await api.get("/question-papers?limit=100");
        if (resAll.data.success && Array.isArray(resAll.data.papers)) {
          papersList = resAll.data.papers;
        }
      }

      setUploads(papersList || []);
    } catch (err) {
      console.error("FAILED STATUS:", err.response?.status);
      setError(
        err.response?.data?.message || "Failed to load question papers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyUploads();
  }, []);

  // Compute Stats
  const totalUploads = uploads.length;

  const totalDownloads = useMemo(() => {
    return uploads.reduce(
      (total, paper) => total + (Number(paper.downloadCount) || 0),
      0
    );
  }, [uploads]);

  const topPaper = useMemo(() => {
    if (uploads.length === 0) return null;
    return [...uploads].sort(
      (a, b) => (Number(b.downloadCount) || 0) - (Number(a.downloadCount) || 0)
    )[0];
  }, [uploads]);

  // Unique Departments in Faculty Uploads
  const uniqueDepartments = useMemo(() => {
    const deptSet = new Set();
    uploads.forEach((paper) => {
      const deptName =
        typeof paper.department === "object"
          ? paper.department?.name
          : paper.department;
      if (deptName) deptSet.add(deptName);
    });
    return Array.from(deptSet);
  }, [uploads]);

  // Filtered Uploads
  const filteredUploads = useMemo(() => {
    return uploads.filter((paper) => {
      const matchesSearch =
        !searchQuery.trim() ||
        paper.title?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (typeof paper.department === "object" &&
          paper.department?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase().trim()));

      const matchesExam =
        selectedExamType === "all" || paper.examType === selectedExamType;

      const deptName =
        typeof paper.department === "object"
          ? paper.department?.name
          : paper.department;
      const matchesDept =
        selectedDepartment === "all" || deptName === selectedDepartment;

      return matchesSearch && matchesExam && matchesDept;
    });
  }, [uploads, searchQuery, selectedExamType, selectedDepartment]);

  // Handle Edit Paper Success
  const handleEditSuccess = (updatedPaper) => {
    setUploads((prev) =>
      prev.map((item) => (item._id === updatedPaper._id ? updatedPaper : item))
    );
    toast.success(`"${updatedPaper.title}" updated successfully.`);
  };

  // Handle Delete Paper
  const handleDeletePaper = async () => {
    if (!deletePaperTarget) return;

    try {
      setDeletingId(deletePaperTarget._id);
      setError("");

      const response = await api.delete(
        `/question-papers/${deletePaperTarget._id}`
      );

      if (response.data.success) {
        setUploads((prev) =>
          prev.filter((item) => item._id !== deletePaperTarget._id)
        );
        toast.success(`"${deletePaperTarget.title}" deleted successfully.`);
      }
    } catch (err) {
      console.error("Delete paper error:", err);
      const errMsg =
        err.response?.data?.message || "Failed to delete question paper.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setDeletingId(null);
      setDeletePaperTarget(null);
    }
  };

  const isMyUploadsView = location.pathname.includes("/faculty/uploads");

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Faculty Portal
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
            Welcome back, {user?.name || "Faculty"}! 👋
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Manage your uploaded university question papers, view download statistics,
            and publish new subject papers for students.
          </p>
        </div>

        <Link
          to="/faculty/upload"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
        >
          <span className="text-lg">+</span> Upload Paper
        </Link>
      </section>

      {/* Success Notification */}
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

      {/* Error Notification */}
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

      {/* Statistics Cards */}
      <section className="grid gap-5 sm:grid-cols-3">
        {/* Total Uploads */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                My Total Uploads
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "..." : totalUploads}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Question papers published
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">
              📄
            </div>
          </div>
        </div>

        {/* Total Downloads */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Downloads
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "..." : totalDownloads}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Across all your uploaded papers
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-600">
              ⬇
            </div>
          </div>
        </div>

        {/* Most Downloaded Paper */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-sm font-medium text-slate-500">
                Top Performing Paper
              </p>

              <p className="mt-2 truncate text-base font-bold text-slate-800">
                {loading ? "..." : topPaper ? topPaper.title : "N/A"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {topPaper ? `${topPaper.downloadCount || 0} downloads` : "No downloads yet"}
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl text-amber-600">
              ⭐
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header & Filter Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isMyUploadsView ? "All Uploaded Papers" : "My Question Papers"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, preview, download, or manage your uploaded question papers.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search paper title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">
                🔍
              </span>
            </div>

            {/* Exam Type Filter */}
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="all">All Exam Types</option>
              <option value="Semester">Semester</option>
              <option value="Internal">Internal</option>
              <option value="Model">Model</option>
            </select>

            {/* Department Filter */}
            {uniqueDepartments.length > 0 && (
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              >
                <option value="all">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            )}

            {/* Refresh Button */}
            <button
              onClick={fetchMyUploads}
              title="Refresh List"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Papers List / Skeletons */}
        {loading ? (
          <div className="mt-6 space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredUploads.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="text-4xl">📄</div>

            <h3 className="mt-3 text-base font-semibold text-slate-800">
              {searchQuery || selectedExamType !== "all" || selectedDepartment !== "all"
                ? "No matching question papers found"
                : "No question papers uploaded yet"}
            </h3>

            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              {searchQuery || selectedExamType !== "all" || selectedDepartment !== "all"
                ? "Try clearing your search filters to view your uploaded papers."
                : "Start uploading university question papers to make them accessible to students."}
            </p>

            {!uploads.length && (
              <Link
                to="/faculty/upload"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                + Upload Your First Paper
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {filteredUploads.map((paper) => {
              const deptName =
                typeof paper.department === "object"
                  ? paper.department?.name
                  : paper.department || "General";

              return (
                <div
                  key={paper._id}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between transition hover:bg-slate-50/50 px-2 rounded-xl"
                >
                  {/* Paper Info */}
                  <div className="flex min-w-0 items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                      📄
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-800">
                        {paper.title}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">
                          {deptName}
                        </span>
                        <span>•</span>
                        <span>{paper.yearOfStudy || "N/A"}</span>
                        <span>•</span>
                        <span>Sem {paper.semester}</span>
                        <span>•</span>
                        <span>{paper.month} {paper.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Badges */}
                  <div className="flex flex-wrap shrink-0 items-center justify-between sm:justify-end gap-3 text-xs">
                    {/* Downloads count */}
                    <div className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                      <span>⬇</span>
                      <span>{paper.downloadCount || 0} downloads</span>
                    </div>

                    {/* Exam Type Badge */}
                    {paper.examType && (
                      <span className="rounded-lg bg-blue-50 px-3 py-1.5 font-semibold text-blue-700">
                        {paper.examType}
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Preview PDF */}
                      {paper.pdfUrl && (
                        <button
                          onClick={() => setPreviewPaper(paper)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          👁 Preview
                        </button>
                      )}

                      {/* Edit Paper */}
                      <button
                        onClick={() => setEditPaperTarget(paper)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-blue-600 transition hover:border-blue-300 hover:bg-blue-50"
                      >
                        ✏️ Edit
                      </button>

                      {/* Download PDF */}
                      {paper.pdfUrl && (
                        <a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          ⬇ Download
                        </a>
                      )}

                      {/* Delete Paper */}
                      <button
                        onClick={() => setDeletePaperTarget(paper)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 font-medium text-red-600 transition hover:bg-red-50"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PDF Preview Modal */}
      {previewPaper && (
        <PdfPreviewModal
          paper={previewPaper}
          onClose={() => setPreviewPaper(null)}
        />
      )}

      {/* Edit Paper Modal */}
      {editPaperTarget && (
        <EditPaperModal
          paper={editPaperTarget}
          onClose={() => setEditPaperTarget(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletePaperTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-bold text-slate-800">
                Delete Question Paper
              </h3>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <strong className="text-slate-800">
                "{deletePaperTarget.title}"
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletePaperTarget(null)}
                disabled={Boolean(deletingId)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeletePaper}
                disabled={Boolean(deletingId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyDashboardPage;
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import api from "../services/api";
import PdfPreviewModal from "../components/PdfPreviewModal";
import EditPaperModal from "../components/EditPaperModal";
import UploadStatistics from "../components/UploadStatistics";
import QuestionPaperCard from "../components/QuestionPaperCard";
import { useToast } from "../context/ToastContext";

function MyUploadsPage() {
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();

  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // View Mode: "grid" | "table"
  const [viewMode, setViewMode] = useState("grid");

  // Tab State: "list" | "stats"
  const [activeTab, setActiveTab] = useState("list");

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modals
  const [previewPaper, setPreviewPaper] = useState(null);
  const [editPaperTarget, setEditPaperTarget] = useState(null);
  const [deletePaperTarget, setDeletePaperTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyUploads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/question-papers/my-uploads");

      if (response.data.success) {
        setUploads(response.data.papers || []);
      }
    } catch (err) {
      console.error("Fetch My Uploads Error:", err);
      setError(
        err.response?.data?.message || "Failed to load your uploads."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyUploads();
  }, []);

  // Compute Unique Departments
  const uniqueDepartments = useMemo(() => {
    const set = new Set();
    uploads.forEach((paper) => {
      const deptName =
        typeof paper.department === "object"
          ? paper.department?.name
          : paper.department;
      if (deptName) set.add(deptName);
    });
    return Array.from(set);
  }, [uploads]);

  // Filtered & Sorted Papers
  const filteredAndSortedPapers = useMemo(() => {
    let result = uploads.filter((paper) => {
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

      const matchesSem =
        selectedSemester === "all" ||
        String(paper.semester) === String(selectedSemester);

      return matchesSearch && matchesExam && matchesDept && matchesSem;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === "downloads") {
        return (Number(b.downloadCount) || 0) - (Number(a.downloadCount) || 0);
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return result;
  }, [
    uploads,
    searchQuery,
    selectedExamType,
    selectedDepartment,
    selectedSemester,
    sortBy,
  ]);

  // Handle Edit Success Callback
  const handleEditSuccess = (updatedPaper) => {
    setUploads((prev) =>
      prev.map((item) => (item._id === updatedPaper._id ? updatedPaper : item))
    );
    toast.success(`"${updatedPaper.title}" updated successfully.`);
  };

  // Handle Delete Confirmation
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Faculty Portal
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800 dark:text-white sm:text-4xl">
            My Uploaded Papers 📄
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            View, edit, search, filter, and delete your published question papers anytime.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/faculty/upload"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
          >
            <span className="text-base">+</span> Upload New Paper
          </Link>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-300">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-xs font-bold transition ${
            activeTab === "list"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <span>📄</span>
          <span>Question Papers ({uploads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-xs font-bold transition ${
            activeTab === "stats"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <span>📊</span>
          <span>Upload Statistics</span>
        </button>
      </div>

      {/* Tab 1: Question Papers List */}
      {activeTab === "list" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 space-y-6">
          {/* Filters Bar & View Mode Switcher */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search paper title or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
              />
              <span className="absolute left-3.5 top-3 text-xs text-slate-400 dark:text-slate-500">
                🔍
              </span>
            </div>

            {/* Select Dropdowns & View Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Department */}
              {uniqueDepartments.length > 0 && (
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="all">All Departments</option>
                  {uniqueDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              )}

              {/* Exam Type */}
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">All Exam Types</option>
                <option value="Semester">Semester</option>
                <option value="Internal">Internal</option>
                <option value="Model">Model</option>
              </select>

              {/* View Switcher Toggle */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                >
                  田 Cards
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    viewMode === "table"
                      ? "bg-white text-blue-600 shadow dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                >
                  ☰ List
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={fetchMyUploads}
                title="Refresh Uploads List"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                🔄
              </button>
            </div>
          </div>

          {/* List Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : filteredAndSortedPapers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
              <div className="text-4xl">📄</div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                No uploaded question papers found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchQuery ||
                selectedExamType !== "all" ||
                selectedDepartment !== "all" ||
                selectedSemester !== "all"
                  ? "Try resetting your search query or filters."
                  : "You haven't uploaded any question papers yet."}
              </p>
              {!uploads.length && (
                <Link
                  to="/faculty/upload"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700"
                >
                  + Upload First Paper
                </Link>
              )}
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View Mode */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
              {filteredAndSortedPapers.map((paper) => (
                <div
                  key={paper._id}
                  className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug">
                        {paper.title}
                      </h3>

                      {paper.examType && (
                        <span className="shrink-0 rounded-lg bg-blue-50 dark:bg-blue-950 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                          {paper.examType}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {typeof paper.department === "object"
                          ? paper.department?.name
                          : paper.department || "General"}
                      </span>
                      <span>•</span>
                      <span>Sem {paper.semester}</span>
                      <span>•</span>
                      <span>{paper.yearOfStudy || "N/A"}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1 font-bold text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                      <span>⬇</span>
                      <span>{paper.downloadCount || 0} downloads</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {paper.pdfUrl && (
                        <button
                          onClick={() => setPreviewPaper(paper)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          👁 Preview
                        </button>
                      )}

                      <button
                        onClick={() => setEditPaperTarget(paper)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => setDeletePaperTarget(paper)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950 dark:text-red-400"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table/List View Mode */
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAndSortedPapers.map((paper) => {
                const deptName =
                  typeof paper.department === "object"
                    ? paper.department?.name
                    : paper.department || "General";

                return (
                  <div
                    key={paper._id}
                    className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between px-3 rounded-xl transition hover:bg-slate-50/80 dark:hover:bg-slate-800/60"
                  >
                    {/* Details */}
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-800 text-xl text-blue-600 dark:text-blue-400">
                        📄
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-800 dark:text-white">
                          {paper.title}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            {deptName}
                          </span>
                          <span>•</span>
                          <span>{paper.yearOfStudy || "N/A"}</span>
                          <span>•</span>
                          <span>Sem {paper.semester}</span>
                          <span>•</span>
                          <span>
                            {paper.month} {paper.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Controls & Badges */}
                    <div className="flex flex-wrap shrink-0 items-center justify-between sm:justify-end gap-3 text-xs">
                      {/* Download Count */}
                      <div className="flex items-center gap-1 font-bold text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg">
                        <span>⬇</span>
                        <span>{paper.downloadCount || 0}</span>
                      </div>

                      {/* Exam Type Badge */}
                      {paper.examType && (
                        <span className="rounded-lg bg-blue-50 dark:bg-blue-950 px-3 py-1.5 font-bold text-blue-700 dark:text-blue-300">
                          {paper.examType}
                        </span>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Preview */}
                        {paper.pdfUrl && (
                          <button
                            onClick={() => setPreviewPaper(paper)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            👁 Preview
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => setEditPaperTarget(paper)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700"
                        >
                          ✏️ Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeletePaperTarget(paper)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-bold text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                          🗑 Delete
                        </button>

                        {/* Download */}
                        {paper.pdfUrl && (
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950 dark:text-emerald-300"
                          >
                            ⬇ PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Upload Statistics */}
      {activeTab === "stats" && (
        <UploadStatistics uploads={uploads} />
      )}

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Delete Question Paper
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-slate-900 dark:text-white">
                "{deletePaperTarget.title}"
              </strong>
              ? This action will permanently remove the paper from the portal and Cloudinary storage.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletePaperTarget(null)}
                disabled={Boolean(deletingId)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeletePaper}
                disabled={Boolean(deletingId)}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-500/20 transition hover:bg-red-700 disabled:opacity-50"
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

export default MyUploadsPage;

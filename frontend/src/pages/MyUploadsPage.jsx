import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import api from "../services/api";
import PdfPreviewModal from "../components/PDFPreviewModal";
import EditPaperModal from "../components/EditPaperModal";
import UploadStatistics from "../components/UploadStatistics";

function MyUploadsPage() {
  const { user } = useSelector((state) => state.auth);

  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage(`"${updatedPaper.title}" updated successfully.`);
    setTimeout(() => setSuccessMessage(""), 4000);
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
        setSuccessMessage(
          `"${deletePaperTarget.title}" deleted successfully.`
        );
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Delete paper error:", err);
      setError(
        err.response?.data?.message || "Failed to delete question paper."
      );
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
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Faculty Portal
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
            My Uploaded Papers 📄
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            View, edit, search, filter, and track statistics for all your published university question papers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/faculty/upload"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
          >
            <span className="text-lg">+</span> Upload Paper
          </Link>
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === "list"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>📄</span>
          <span>Question Papers ({uploads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === "stats"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>📊</span>
          <span>Upload Statistics</span>
        </button>
      </div>

      {/* Tab 1: Question Papers List */}
      {activeTab === "list" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search paper title or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <span className="absolute left-3.5 top-3 text-sm text-slate-400">
                🔍
              </span>
            </div>

            {/* Select Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Department */}
              {uniqueDepartments.length > 0 && (
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
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
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              >
                <option value="all">All Exam Types</option>
                <option value="Semester">Semester</option>
                <option value="Internal">Internal</option>
                <option value="Model">Model</option>
              </select>

              {/* Semester */}
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              >
                <option value="all">All Semesters</option>
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <option key={s} value={String(s)}>
                    Semester {s}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 outline-none transition focus:border-blue-500"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="downloads">Sort: Most Downloaded</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>

              {/* Refresh */}
              <button
                onClick={fetchMyUploads}
                title="Refresh Uploads List"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
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
                  className="h-20 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : filteredAndSortedPapers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center space-y-3">
              <div className="text-4xl">📄</div>
              <h3 className="text-base font-semibold text-slate-800">
                No question papers found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
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
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700"
                >
                  + Upload Paper
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAndSortedPapers.map((paper) => {
                const deptName =
                  typeof paper.department === "object"
                    ? paper.department?.name
                    : paper.department || "General";

                return (
                  <div
                    key={paper._id}
                    className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between px-2 rounded-xl transition hover:bg-slate-50/60"
                  >
                    {/* Details */}
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                        📄
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-800">
                          {paper.title}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">
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
                      <div className="flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                        <span>⬇</span>
                        <span>{paper.downloadCount || 0}</span>
                      </div>

                      {/* Exam Type Badge */}
                      {paper.examType && (
                        <span className="rounded-lg bg-blue-50 px-3 py-1.5 font-semibold text-blue-700">
                          {paper.examType}
                        </span>
                      )}

                      {/* Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Preview */}
                        {paper.pdfUrl && (
                          <button
                            onClick={() => setPreviewPaper(paper)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                          >
                            👁 Preview
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => setEditPaperTarget(paper)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-blue-600 transition hover:border-blue-300 hover:bg-blue-50"
                        >
                          ✏️ Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeletePaperTarget(paper)}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 font-medium text-red-600 transition hover:bg-red-50"
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
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-emerald-600 transition hover:border-emerald-300 hover:bg-emerald-50"
                          >
                            ⬇ Download
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
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeletePaper}
                disabled={Boolean(deletingId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
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

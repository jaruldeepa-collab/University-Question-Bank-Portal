import { useEffect, useState, useMemo } from "react";
import api from "../services/api";

function FacultyApprovalsPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filters
  const [activeTab, setActiveTab] = useState("pending"); // "pending" | "approved" | "deactivated" | "all"
  const [searchQuery, setSearchQuery] = useState("");

  // Action Loading Id
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Delete Target Modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/faculty");

      if (response.data.success) {
        setFacultyList(response.data.faculty || []);
      }
    } catch (err) {
      console.error("Fetch Faculty Error:", err);
      setError(
        err.response?.data?.message || "Failed to load faculty registrations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = facultyList.length;
    const pending = facultyList.filter((f) => !f.isApproved).length;
    const approved = facultyList.filter((f) => f.isApproved && f.isActive !== false).length;
    const deactivated = facultyList.filter((f) => f.isActive === false).length;

    return { total, pending, approved, deactivated };
  }, [facultyList]);

  // Filtered List
  const filteredFaculty = useMemo(() => {
    return facultyList.filter((faculty) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faculty.name?.toLowerCase().includes(q) ||
        faculty.email?.toLowerCase().includes(q);

      let matchesTab = true;
      if (activeTab === "pending") {
        matchesTab = !faculty.isApproved;
      } else if (activeTab === "approved") {
        matchesTab = faculty.isApproved && faculty.isActive !== false;
      } else if (activeTab === "deactivated") {
        matchesTab = faculty.isActive === false;
      }

      return matchesSearch && matchesTab;
    });
  }, [facultyList, activeTab, searchQuery]);

  // Action: Approve Faculty
  const handleApproveFaculty = async (facultyItem) => {
    try {
      setActionLoadingId(facultyItem._id);
      setError("");

      const response = await api.put(`/users/${facultyItem._id}/approve`);

      if (response.data.success) {
        setFacultyList((prev) =>
          prev.map((f) =>
            f._id === facultyItem._id ? { ...f, isApproved: true } : f
          )
        );
        setSuccessMessage(
          `Faculty account for "${facultyItem.name}" approved successfully!`
        );
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Approve faculty error:", err);
      setError(
        err.response?.data?.message || "Failed to approve faculty account."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Toggle Active Status
  const handleToggleStatus = async (facultyItem) => {
    try {
      setActionLoadingId(facultyItem._id);
      setError("");

      const response = await api.put(`/users/${facultyItem._id}/status`);

      if (response.data.success) {
        const updatedUser = response.data.user;
        setFacultyList((prev) =>
          prev.map((f) => (f._id === updatedUser._id ? updatedUser : f))
        );
        setSuccessMessage(
          `Faculty member "${facultyItem.name}" has been ${
            updatedUser.isActive ? "activated" : "deactivated"
          }.`
        );
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      setError(err.response?.data?.message || "Failed to update account status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Delete Faculty
  const handleDeleteFaculty = async () => {
    if (!deleteTarget) return;

    try {
      setActionLoadingId(deleteTarget._id);
      setError("");

      const response = await api.delete(`/users/${deleteTarget._id}`);

      if (response.data.success) {
        setFacultyList((prev) =>
          prev.filter((f) => f._id !== deleteTarget._id)
        );
        setSuccessMessage(
          `Faculty registration for "${deleteTarget.name}" deleted successfully.`
        );
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Delete faculty error:", err);
      setError(
        err.response?.data?.message || "Failed to delete faculty account."
      );
    } finally {
      setActionLoadingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Admin Verification Hub
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
            Faculty Approval UI 👨‍🏫
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Review, verify, approve, and manage faculty registration requests across university departments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchFaculty}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            🔄 Refresh Approvals
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

      {/* Stat Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => setActiveTab("pending")}
          className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition ${
            activeTab === "pending"
              ? "border-amber-400 bg-amber-100/60 ring-2 ring-amber-200"
              : "border-amber-200 bg-amber-50/60 hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Pending Verification
            </span>
            <span className="text-xl">⏳</span>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-900">
            {stats.pending}
          </p>
          <p className="mt-1 text-[11px] text-amber-700">
            Awaiting administrator review
          </p>
        </div>

        <div
          onClick={() => setActiveTab("approved")}
          className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition ${
            activeTab === "approved"
              ? "border-emerald-400 bg-emerald-100/60 ring-2 ring-emerald-200"
              : "border-emerald-200 bg-emerald-50/60 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Verified Faculty
            </span>
            <span className="text-xl">✅</span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-900">
            {stats.approved}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700">
            Active verified teaching accounts
          </p>
        </div>

        <div
          onClick={() => setActiveTab("deactivated")}
          className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition ${
            activeTab === "deactivated"
              ? "border-red-400 bg-red-100/60 ring-2 ring-red-200"
              : "border-red-200 bg-red-50/60 hover:border-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-800">
              Deactivated
            </span>
            <span className="text-xl">🔒</span>
          </div>
          <p className="mt-2 text-2xl font-black text-red-900">
            {stats.deactivated}
          </p>
          <p className="mt-1 text-[11px] text-red-700">
            Suspended faculty accounts
          </p>
        </div>

        <div
          onClick={() => setActiveTab("all")}
          className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition ${
            activeTab === "all"
              ? "border-blue-400 bg-blue-100/60 ring-2 ring-blue-200"
              : "border-slate-200 bg-white hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Registrations
            </span>
            <span className="text-xl">👨‍🏫</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-800">
            {stats.total}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            All registered faculty members
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        {/* Filters Bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
          {/* Tab buttons */}
          <div className="flex border-b sm:border-b-0 border-slate-200 gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "pending"
                  ? "bg-amber-100 text-amber-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>⏳ Pending Requests ({stats.pending})</span>
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "approved"
                  ? "bg-emerald-100 text-emerald-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>✅ Approved ({stats.approved})</span>
            </button>

            <button
              onClick={() => setActiveTab("deactivated")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "deactivated"
                  ? "bg-red-100 text-red-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>🔒 Deactivated ({stats.deactivated})</span>
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "all"
                  ? "bg-blue-100 text-blue-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>All ({stats.total})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs">
            <input
              type="text"
              placeholder="Search faculty name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 focus:bg-white"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">
              🔍
            </span>
          </div>
        </div>

        {/* Faculty List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center space-y-2">
            <div className="text-4xl">👨‍🏫</div>
            <h3 className="text-base font-semibold text-slate-800">
              No faculty records match current tab or filter
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === "pending"
                ? "Great! All faculty registration requests have been reviewed and approved."
                : "Try resetting your search query or tab filter."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFaculty.map((faculty) => {
              const isApproved = faculty.isApproved;
              const isActive = faculty.isActive !== false;

              return (
                <div
                  key={faculty._id}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between px-3 rounded-2xl hover:bg-slate-50/70 transition"
                >
                  {/* Faculty Details */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white text-lg shadow-md">
                      {faculty.name?.charAt(0)?.toUpperCase() || "F"}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-800">
                          {faculty.name}
                        </h3>

                        {isApproved ? (
                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            ✅ Approved
                          </span>
                        ) : (
                          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            ⏳ Pending Verification
                          </span>
                        )}

                        {!isActive && (
                          <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                            🔒 Deactivated
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {faculty.email}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Registered:{" "}
                        {faculty.createdAt
                          ? new Date(faculty.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Approve Button */}
                    {!isApproved && (
                      <button
                        onClick={() => handleApproveFaculty(faculty)}
                        disabled={actionLoadingId === faculty._id}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {actionLoadingId === faculty._id
                          ? "Approving..."
                          : "✅ Approve Faculty Access"}
                      </button>
                    )}

                    {/* Toggle Activate / Deactivate */}
                    <button
                      onClick={() => handleToggleStatus(faculty)}
                      disabled={actionLoadingId === faculty._id}
                      className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                        isActive
                          ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      } disabled:opacity-50`}
                    >
                      {actionLoadingId === faculty._id
                        ? "Updating..."
                        : isActive
                        ? "🔒 Deactivate"
                        : "🔓 Activate"}
                    </button>

                    {/* Delete Request */}
                    <button
                      onClick={() => setDeleteTarget(faculty)}
                      disabled={actionLoadingId === faculty._id}
                      className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Delete Faculty Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-bold text-slate-800">
                Delete Faculty Registration
              </h3>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to delete the faculty account for{" "}
              <strong className="text-slate-800">
                "{deleteTarget.name}" ({deleteTarget.email})
              </strong>
              ? This action will remove all registration data permanently.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={Boolean(actionLoadingId)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteFaculty}
                disabled={Boolean(actionLoadingId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoadingId ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyApprovalsPage;

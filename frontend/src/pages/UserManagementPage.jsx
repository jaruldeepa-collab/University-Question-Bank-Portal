import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

function UserManagementPage() {
  const [searchParams] = useSearchParams();
  const initialFilterParam = searchParams.get("filter");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState(
    initialFilterParam === "pending" ? "pending" : "all"
  );

  // Loading States for Actions
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Delete Modal Target
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
      setError(
        err.response?.data?.message || "Failed to load system users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = users.length;
    const students = users.filter((u) => u.role === "student").length;
    const faculty = users.filter((u) => u.role === "faculty").length;
    const pendingFaculty = users.filter(
      (u) => u.role === "faculty" && !u.isApproved
    ).length;
    const active = users.filter((u) => u.isActive !== false).length;
    const inactive = users.filter((u) => u.isActive === false).length;

    return { total, students, faculty, pendingFaculty, active, inactive };
  }, [users]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // Role Filter
      const matchesRole =
        selectedRole === "all" || user.role === selectedRole;

      // Status Filter
      const userIsActive = user.isActive !== false;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && userIsActive) ||
        (selectedStatus === "inactive" && !userIsActive);

      // Approval Filter
      const matchesApproval =
        approvalFilter === "all" ||
        (approvalFilter === "approved" && user.isApproved) ||
        (approvalFilter === "pending" &&
          user.role === "faculty" &&
          !user.isApproved);

      return matchesSearch && matchesRole && matchesStatus && matchesApproval;
    });
  }, [users, searchQuery, selectedRole, selectedStatus, approvalFilter]);

  // Action 1: Approve Faculty Access
  const handleApproveFaculty = async (userToApprove) => {
    try {
      setActionLoadingId(userToApprove._id);
      setError("");

      const response = await api.put(`/users/${userToApprove._id}/approve`);

      if (response.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userToApprove._id ? { ...u, isApproved: true } : u
          )
        );
        setSuccessMessage(
          `Faculty account for "${userToApprove.name}" approved successfully.`
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

  // Action 2: Toggle Active / Inactive Status
  const handleToggleStatus = async (userToToggle) => {
    try {
      setActionLoadingId(userToToggle._id);
      setError("");

      const response = await api.put(`/users/${userToToggle._id}/status`);

      if (response.data.success) {
        const updatedUser = response.data.user;
        setUsers((prev) =>
          prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
        );
        setSuccessMessage(
          `User "${userToToggle.name}" has been ${
            updatedUser.isActive ? "activated" : "deactivated"
          }.`
        );
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Toggle user status error:", err);
      setError(
        err.response?.data?.message || "Failed to change user status."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action 3: Confirm Delete User
  const handleDeleteUser = async () => {
    if (!deleteUserTarget) return;

    try {
      setActionLoadingId(deleteUserTarget._id);
      setError("");

      const response = await api.delete(`/users/${deleteUserTarget._id}`);

      if (response.data.success) {
        setUsers((prev) =>
          prev.filter((u) => u._id !== deleteUserTarget._id)
        );
        setSuccessMessage(
          `User "${deleteUserTarget.name}" deleted successfully.`
        );
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Delete user error:", err);
      setError(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setActionLoadingId(null);
      setDeleteUserTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Admin Panel
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
            User Management 👥
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Manage student, faculty, and admin accounts, approve pending faculty requests, and toggle user access statuses.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            🔄 Refresh List
          </button>
        </div>
      </section>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div
          onClick={() => {
            setSelectedRole("all");
            setApprovalFilter("all");
          }}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-400"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Users
          </p>
          <p className="mt-1 text-2xl font-black text-slate-800">
            {metrics.total}
          </p>
        </div>

        <div
          onClick={() => {
            setSelectedRole("student");
            setApprovalFilter("all");
          }}
          className="cursor-pointer rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm transition hover:border-emerald-400"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Students
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-900">
            {metrics.students}
          </p>
        </div>

        <div
          onClick={() => {
            setSelectedRole("faculty");
            setApprovalFilter("all");
          }}
          className="cursor-pointer rounded-2xl border border-purple-100 bg-purple-50/50 p-4 shadow-sm transition hover:border-purple-400"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">
            Faculty Members
          </p>
          <p className="mt-1 text-2xl font-black text-purple-900">
            {metrics.faculty}
          </p>
        </div>

        <div
          onClick={() => {
            setSelectedRole("faculty");
            setApprovalFilter("pending");
          }}
          className="cursor-pointer rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm transition hover:border-amber-400"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Pending Faculty
          </p>
          <p className="mt-1 text-2xl font-black text-amber-900">
            {metrics.pendingFaculty}
          </p>
        </div>

        <div
          onClick={() => {
            setSelectedStatus("active");
            setApprovalFilter("all");
          }}
          className="cursor-pointer rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm transition hover:border-blue-400"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Active Accounts
          </p>
          <p className="mt-1 text-2xl font-black text-blue-900">
            {metrics.active}
          </p>
        </div>
      </div>

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

      {/* Filter Bar & Table Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        {/* Search & Filter Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <span className="absolute left-3.5 top-3 text-sm text-slate-400">
              🔍
            </span>
          </div>

          {/* Select Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Role */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>

            {/* Account Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="inactive">Deactivated Accounts</option>
            </select>

            {/* Approval Filter */}
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 outline-none transition focus:border-amber-400"
            >
              <option value="all">All Faculty Statuses</option>
              <option value="pending">Faculty Pending Approval ⏳</option>
              <option value="approved">Faculty Approved ✅</option>
            </select>

            {/* Reset Filters */}
            {(searchQuery ||
              selectedRole !== "all" ||
              selectedStatus !== "all" ||
              approvalFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRole("all");
                  setSelectedStatus("all");
                  setApprovalFilter("all");
                }}
                className="text-xs font-semibold text-blue-600 hover:underline px-2"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center space-y-2">
            <div className="text-4xl">👥</div>
            <h3 className="text-base font-semibold text-slate-800">
              No matching users found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try updating your search keyword or clearing filter selections.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">User Details</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Faculty Verification</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((userItem) => {
                  const isActive = userItem.isActive !== false;
                  const isFaculty = userItem.role === "faculty";
                  const isApproved = userItem.isApproved;

                  return (
                    <tr
                      key={userItem._id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-sm">
                            {userItem.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-800 text-sm">
                              {userItem.name}
                            </p>
                            <p className="truncate text-slate-500 text-xs">
                              {userItem.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block rounded-lg px-2.5 py-1 font-bold text-[11px] capitalize ${
                            userItem.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : userItem.role === "faculty"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {userItem.role}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        {isFaculty ? (
                          isApproved ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                              <span>✅</span> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 font-bold text-amber-800">
                              <span>⏳</span> Pending Approval
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 font-normal">
                            N/A (Student)
                          </span>
                        )}
                      </td>

                      {/* Account Active Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-600" : "bg-red-600"
                            }`}
                          />
                          {isActive ? "Active" : "Deactivated"}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {userItem.createdAt
                          ? new Date(userItem.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Approve Button */}
                          {isFaculty && !isApproved && (
                            <button
                              onClick={() => handleApproveFaculty(userItem)}
                              disabled={actionLoadingId === userItem._id}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {actionLoadingId === userItem._id
                                ? "..."
                                : "✅ Approve"}
                            </button>
                          )}

                          {/* Activate / Deactivate Toggle */}
                          <button
                            onClick={() => handleToggleStatus(userItem)}
                            disabled={actionLoadingId === userItem._id}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                              isActive
                                ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                            } disabled:opacity-50`}
                          >
                            {actionLoadingId === userItem._id
                              ? "..."
                              : isActive
                              ? "🔒 Deactivate"
                              : "🔓 Activate"}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteUserTarget(userItem)}
                            disabled={actionLoadingId === userItem._id}
                            className="rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            title="Delete User"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Delete User Confirmation Modal */}
      {deleteUserTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-bold text-slate-800">
                Delete User Account
              </h3>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to delete user{" "}
              <strong className="text-slate-800">
                "{deleteUserTarget.name}" ({deleteUserTarget.email})
              </strong>
              ? All account access and records will be permanently removed. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteUserTarget(null)}
                disabled={Boolean(actionLoadingId)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteUser}
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

export default UserManagementPage;

import { useEffect, useState, useMemo } from "react";
import api from "../services/api";

function SubjectManagementPage() {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    semester: "1",
    credits: "3",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [subjectsRes, deptRes] = await Promise.allSettled([
        api.get("/subjects"),
        api.get("/departments"),
      ]);

      if (subjectsRes.status === "fulfilled" && subjectsRes.value.data?.success) {
        setSubjects(subjectsRes.value.data.subjects || []);
      }

      if (deptRes.status === "fulfilled" && deptRes.value.data?.success) {
        setDepartments(deptRes.value.data.departments || []);
      }
    } catch (err) {
      console.error("Fetch Subjects Error:", err);
      setError("Failed to load subjects and departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Subjects List
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        subject.name?.toLowerCase().includes(q) ||
        subject.code?.toLowerCase().includes(q);

      const deptId =
        typeof subject.department === "object"
          ? subject.department?._id
          : subject.department;

      const matchesDept =
        selectedDeptFilter === "all" || String(deptId) === String(selectedDeptFilter);

      return matchesSearch && matchesDept;
    });
  }, [subjects, searchQuery, selectedDeptFilter]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingSubject(null);
    setFormData({
      name: "",
      code: "",
      department: departments[0]?._id || "",
      semester: "1",
      credits: "3",
    });
    setError("");
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (sub) => {
    const deptId =
      typeof sub.department === "object"
        ? sub.department?._id
        : sub.department || "";

    setEditingSubject(sub);
    setFormData({
      name: sub.name || "",
      code: sub.code || "",
      department: deptId,
      semester: String(sub.semester || "1"),
      credits: String(sub.credits || "3"),
    });
    setError("");
    setIsFormModalOpen(true);
  };

  // Submit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Subject name is required.");
      return;
    }
    if (!formData.code.trim()) {
      setError("Subject code is required.");
      return;
    }
    if (!formData.department) {
      setError("Please select a department.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        department: formData.department,
        semester: Number(formData.semester),
        credits: Number(formData.credits),
      };

      if (editingSubject) {
        // Update
        const response = await api.put(
          `/subjects/${editingSubject._id}`,
          payload
        );

        if (response.data.success) {
          const updated = response.data.subject;
          setSubjects((prev) =>
            prev.map((s) => (s._id === updated._id ? updated : s))
          );
          setSuccessMessage(`Subject "${updated.name}" updated successfully.`);
          setIsFormModalOpen(false);
          setTimeout(() => setSuccessMessage(""), 4000);
        }
      } else {
        // Create
        const response = await api.post("/subjects", payload);

        if (response.data.success) {
          const created = response.data.subject;
          setSubjects((prev) => [created, ...prev]);
          setSuccessMessage(`Subject "${created.name}" created successfully.`);
          setIsFormModalOpen(false);
          setTimeout(() => setSuccessMessage(""), 4000);
        }
      }
    } catch (err) {
      console.error("Subject form submit error:", err);
      setError(
        err.response?.data?.message || "Failed to save subject details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Delete Subject
  const handleDeleteSubject = async () => {
    if (!deleteTarget) return;

    try {
      setSubmitting(true);
      setError("");

      const response = await api.delete(`/subjects/${deleteTarget._id}`);

      if (response.data.success) {
        setSubjects((prev) =>
          prev.filter((s) => s._id !== deleteTarget._id)
        );
        setSuccessMessage(
          `Subject "${deleteTarget.name}" deleted successfully.`
        );
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Delete subject error:", err);
      setError(err.response?.data?.message || "Failed to delete subject.");
    } finally {
      setSubmitting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Academic Catalog
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
            Subject Management 📘
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Add, update, and manage curriculum course subjects across departments and semesters.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
          >
            <span className="text-lg">+</span> Create Subject
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

      {/* Search & Filter Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search subject title or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <span className="absolute left-3.5 top-3 text-sm text-slate-400">
              🔍
            </span>
          </div>

          {/* Department Filter Dropdown */}
          <div className="flex items-center gap-3">
            {departments.length > 0 && (
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              >
                <option value="all">All Departments ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={fetchData}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              title="Refresh List"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Subjects Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center space-y-3">
            <div className="text-4xl">📘</div>
            <h3 className="text-base font-semibold text-slate-800">
              No course subjects found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedDeptFilter !== "all"
                ? "Try resetting your search query or department filter."
                : "No course subjects cataloged yet."}
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700"
            >
              + Create First Subject
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subject) => {
              const deptObj =
                typeof subject.department === "object"
                  ? subject.department
                  : null;

              return (
                <div
                  key={subject._id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 text-lg font-bold">
                        📘
                      </span>
                      <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-black text-purple-800 uppercase tracking-wider">
                        {subject.code}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-800">
                      {subject.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {deptObj && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                          {deptObj.name}
                        </span>
                      )}
                      <span>•</span>
                      <span>Semester {subject.semester}</span>
                      <span>•</span>
                      <span>{subject.credits || 3} Credits</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Sem {subject.semester}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(subject)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(subject)}
                        className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
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

      {/* Create / Edit Subject Modal */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">
                {editingSubject ? "Edit Subject" : "Create New Subject"}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures and Algorithms"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS8591"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semester *
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        semester: e.target.value,
                      }))
                    }
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={String(s)}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Credits
                  </label>
                  <select
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        credits: e.target.value,
                      }))
                    }
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {[1, 2, 3, 4, 5, 6].map((c) => (
                      <option key={c} value={String(c)}>
                        {c} Credit{c > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  disabled={submitting}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingSubject
                    ? "Save Changes"
                    : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Subject Modal */}
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
                Delete Subject
              </h3>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to delete subject{" "}
              <strong className="text-slate-800">
                "{deleteTarget.name}" ({deleteTarget.code})
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={submitting}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteSubject}
                disabled={submitting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectManagementPage;

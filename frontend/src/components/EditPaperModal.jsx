import { useState, useEffect } from "react";
import api from "../services/api";

function EditPaperModal({ paper, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const defaultDepartments = [
    "B.Sc Computer Science",
    "B.Sc Physics",
    "BBA",
    "B.Com",
    "B.Com CA",
    "B.Sc Maths",
    "B.A Tamil",
    "B.A English",
  ];

  const [departments, setDepartments] = useState(defaultDepartments);

  const currentDeptName =
    typeof paper?.department === "object"
      ? paper.department?.name
      : paper?.department || "";

  const [formData, setFormData] = useState({
    title: paper?.title || "",
    department: currentDeptName,
    yearOfStudy: paper?.yearOfStudy || "1st Year",
    semester: String(paper?.semester || "1"),
    year: String(paper?.year || "2025"),
    month: paper?.month || "April",
    examType: paper?.examType || "Semester",
    pdf: null,
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/departments");
        if (response.data.success && Array.isArray(response.data.departments)) {
          const apiDeptNames = response.data.departments.map((d) => d.name);
          const combined = Array.from(
            new Set([...defaultDepartments, currentDeptName, ...apiDeptNames])
          ).filter(Boolean);
          setDepartments(combined);
        }
      } catch (err) {
        console.warn("Could not fetch departments list:", err);
      }
    };

    fetchDepartments();
  }, [currentDeptName]);

  const yearsOfStudy = ["1st Year", "2nd Year", "3rd Year"];
  const semesters = ["1", "2", "3", "4", "5", "6"];
  const years = ["2021", "2022", "2023", "2024", "2025"];
  const months = ["November", "April"];
  const examTypes = ["Semester", "Internal", "Model"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateAndSetPdf = (file) => {
    setError("");
    if (!file) {
      setFormData((prev) => ({ ...prev, pdf: null }));
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      setFormData((prev) => ({ ...prev, pdf: null }));
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size too large. Maximum allowed size is 50 MB.");
      setFormData((prev) => ({ ...prev, pdf: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, pdf: file }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetPdf(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetPdf(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Paper title is required.");
      return;
    }
    if (!formData.department) {
      setError("Department is required.");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("department", formData.department);
      submitData.append("yearOfStudy", formData.yearOfStudy);
      submitData.append("semester", formData.semester);
      submitData.append("year", formData.year);
      submitData.append("month", formData.month);
      submitData.append("examType", formData.examType);

      if (formData.pdf) {
        submitData.append("pdf", formData.pdf);
      }

      const response = await api.put(
        `/question-papers/${paper._id}`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        onSuccess(response.data.questionPaper);
        onClose();
      }
    } catch (err) {
      console.error("Edit Question Paper Error:", err);
      setError(
        err.response?.data?.message || "Failed to update question paper."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!paper) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-6 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Edit Question Paper
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update details or replace PDF for "{paper.title}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paper Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Department + Year of Study */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Year of Study *
              </label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {yearsOfStudy.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Semester + Year */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {semesters.map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Year *
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Month + Exam Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Examination Month *
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exam Type *
              </label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {examTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional PDF File Replacement */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Replace PDF File <span className="font-normal text-slate-400">(Optional)</span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-4 text-center transition ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-300 bg-slate-50 hover:border-blue-400"
              }`}
            >
              {!formData.pdf ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-600">
                    Drag new PDF here or{" "}
                    <label
                      htmlFor="edit-pdf"
                      className="text-blue-600 hover:underline cursor-pointer font-semibold"
                    >
                      browse
                    </label>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Leave empty to keep the existing PDF file.
                  </p>
                  <input
                    id="edit-pdf"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 min-w-0 text-xs">
                    <span className="text-green-600 font-bold">📄</span>
                    <span className="truncate font-semibold text-slate-800">
                      {formData.pdf.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({(formData.pdf.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, pdf: null }))}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold px-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPaperModal;

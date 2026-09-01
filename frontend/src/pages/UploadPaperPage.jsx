import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function UploadPaperPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    yearOfStudy: "",
    semester: "",
    year: "",
    month: "",
    examType: "",
    pdf: null,
  });

  // ==========================
  // Fetch Departments from Backend
  // ==========================
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/departments");
        if (response.data.success && Array.isArray(response.data.departments)) {
          const apiDeptNames = response.data.departments.map((d) => d.name);
          const combined = Array.from(
            new Set([...defaultDepartments, ...apiDeptNames])
          );
          setDepartments(combined);
        }
      } catch (err) {
        console.warn("Could not fetch departments from API, using default list:", err);
      }
    };

    fetchDepartments();
  }, []);

  const yearsOfStudy = [
    "1st Year",
    "2nd Year",
    "3rd Year",
  ];

  const semesters = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
  ];

  const years = [
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
  ];

  const months = [
    "November",
    "April",
  ];

  const examTypes = [
    "Semester",
    "Internal",
    "Model",
  ];

  // ==========================
  // Handle Input Changes
  // ==========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // ==========================
  // Validate & Process Selected PDF File
  // ==========================
  const validateAndSetPdf = (file) => {
    setError("");
    setMessage("");

    if (!file) {
      setFormData((previous) => ({
        ...previous,
        pdf: null,
      }));
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      setFormData((previous) => ({
        ...previous,
        pdf: null,
      }));
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxSize) {
      setError("File size too large. Maximum allowed size is 50 MB.");
      setFormData((previous) => ({
        ...previous,
        pdf: null,
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      pdf: file,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    validateAndSetPdf(file);
  };

  // Drag and Drop Handlers
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

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, pdf: null }));
    const fileInput = document.getElementById("pdf");
    if (fileInput) fileInput.value = "";
  };

  // ==========================
  // Submit Form
  // ==========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    // Validation
    if (!formData.title.trim()) {
      setError("Please enter a question paper title.");
      return;
    }

    if (!formData.department) {
      setError("Please select a department.");
      return;
    }

    if (!formData.yearOfStudy) {
      setError("Please select year of study.");
      return;
    }

    if (!formData.semester) {
      setError("Please select a semester.");
      return;
    }

    if (!formData.year) {
      setError("Please select a year.");
      return;
    }

    if (!formData.month) {
      setError("Please select a month.");
      return;
    }

    if (!formData.examType) {
      setError("Please select an exam type.");
      return;
    }

    if (!formData.pdf) {
      setError("Please select a PDF file.");
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (formData.pdf.size > maxSize) {
      setError("File size too large. Maximum allowed size is 50 MB.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("department", formData.department);
      data.append("yearOfStudy", formData.yearOfStudy);
      data.append("semester", formData.semester);
      data.append("year", formData.year);
      data.append("month", formData.month);
      data.append("examType", formData.examType);
      data.append("pdf", formData.pdf);

      const response = await api.post("/question-papers", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setMessage(
          response.data.message || "Question paper uploaded successfully!"
        );

        // Reset form
        setFormData({
          title: "",
          department: "",
          yearOfStudy: "",
          semester: "",
          year: "",
          month: "",
          examType: "",
          pdf: null,
        });

        const fileInput = document.getElementById("pdf");
        if (fileInput) {
          fileInput.value = "";
        }
      }
    } catch (err) {
      console.error("Question paper upload failed:", err);
      console.error("STATUS:", err.response?.status);
      console.error("RESPONSE:", err.response?.data);

      setError(
        err.response?.data?.message || "Failed to upload question paper."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Faculty Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
            Upload Question Paper
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Upload a university question paper PDF with the required academic details.
          </p>
        </div>

        <Link
          to="/faculty"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ← Back to Dashboard
        </Link>
      </section>

      {/* Success Message */}
      {message && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="text-base font-bold text-green-800">
                  Upload Successful!
                </h3>
                <p className="text-sm text-green-700 mt-0.5">{message}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/faculty/uploads"
                className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-green-800"
              >
                View My Uploads
              </Link>
              <button
                onClick={() => setMessage("")}
                className="rounded-xl border border-green-300 bg-white px-4 py-2 text-xs font-semibold text-green-800 transition hover:bg-green-100"
              >
                Upload Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
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

      {/* Upload Form */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Question Paper Title <span className="text-red-500">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Data Structures April 2025"
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
            />
          </div>

          {/* Department + Year of Study */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Department <span className="text-red-500">*</span>
              </label>

              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Year of Study */}
            <div>
              <label
                htmlFor="yearOfStudy"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Year of Study <span className="text-red-500">*</span>
              </label>

              <select
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="">Select Year of Study</option>
                {yearsOfStudy.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Semester + Year */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Semester */}
            <div>
              <label
                htmlFor="semester"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Semester <span className="text-red-500">*</span>
              </label>

              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Academic Year <span className="text-red-500">*</span>
              </label>

              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Month + Exam Type */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Month */}
            <div>
              <label
                htmlFor="month"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Examination Month <span className="text-red-500">*</span>
              </label>

              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="">Select Month</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Type */}
            <div>
              <label
                htmlFor="examType"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Exam Type <span className="text-red-500">*</span>
              </label>

              <select
                id="examType"
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="">Select Exam Type</option>
                {examTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PDF Upload Drop Zone */}
          <div>
            <label
              htmlFor="pdf"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Question Paper PDF File <span className="text-red-500">*</span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition ${
                isDragging
                  ? "border-blue-500 bg-blue-50/70 scale-[1.01]"
                  : "border-slate-300 bg-slate-50/50 hover:border-blue-400"
              }`}
            >
              {!formData.pdf ? (
                <div>
                  <div className="text-5xl">📄</div>

                  <p className="mt-3 text-base font-semibold text-slate-800">
                    Drag & Drop your PDF here, or{" "}
                    <label
                      htmlFor="pdf"
                      className="cursor-pointer text-blue-600 hover:underline"
                    >
                      browse
                    </label>
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Only PDF files are accepted. Maximum size allowed: 50 MB.
                  </p>

                  <input
                    id="pdf"
                    name="pdf"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />

                  <label
                    htmlFor="pdf"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 cursor-pointer hover:bg-blue-100 transition"
                  >
                    📂 Choose PDF File
                  </label>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl text-green-700">
                    📄
                  </div>

                  <div>
                    <p className="text-base font-bold text-slate-800">
                      {formData.pdf.name}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      File size: {(formData.pdf.size / (1024 * 1024)).toFixed(2)} MB
                      {formData.pdf.size > 10 * 1024 * 1024 && (
                        <span className="ml-2 inline-block rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800">
                          ⚡ Auto-Compression Enabled (&gt; 10 MB)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={loading}
                      className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      ✕ Remove / Change File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/faculty")}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? formData.pdf && formData.pdf.size > 10 * 1024 * 1024
                  ? "Compressing & Uploading..."
                  : "Uploading PDF..."
                : "Upload Question Paper"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default UploadPaperPage;
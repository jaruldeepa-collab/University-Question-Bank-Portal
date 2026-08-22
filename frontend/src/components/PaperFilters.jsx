import { useEffect, useState } from "react";

import api from "../services/api";

function PaperFilters({ filters, onFilterChange, onClear }) {
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);

        const response = await api.get("/departments");

        if (response.data.success) {
          setDepartments(response.data.departments || []);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    onFilterChange(name, value);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800">
          Advanced Filters
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Narrow down question papers using the filters below.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Department */}
        <div>
          <label
            htmlFor="department"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Department
          </label>

          <select
            id="department"
            name="department"
            value={filters.department}
            onChange={handleChange}
            disabled={loadingDepartments}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="">
              {loadingDepartments
                ? "Loading departments..."
                : "All Departments"}
            </option>

            {departments.map((department) => (
              <option
                key={department._id}
                value={department._id}
              >
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label
            htmlFor="semester"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Semester
          </label>

          <select
            id="semester"
            name="semester"
            value={filters.semester}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Semesters</option>

            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label
            htmlFor="year"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Year
          </label>

          <select
            id="year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Years</option>

            {[2026, 2025, 2024, 2023, 2022, 2021].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Regulation */}
        <div>
          <label
            htmlFor="regulation"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Regulation
          </label>

          <select
            id="regulation"
            name="regulation"
            value={filters.regulation}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Regulations</option>
            <option value="2021">2021 Regulation</option>
            <option value="2022">2022 Regulation</option>
            <option value="2023">2023 Regulation</option>
            <option value="2024">2024 Regulation</option>
          </select>
        </div>

        {/* Exam Type */}
        <div>
          <label
            htmlFor="examType"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Exam Type
          </label>

          <select
            id="examType"
            name="examType"
            value={filters.examType}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Exam Types</option>
            <option value="Internal">Internal</option>
            <option value="Model">Model</option>
            <option value="Semester">Semester</option>
            <option value="Arrear">Arrear</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default PaperFilters;
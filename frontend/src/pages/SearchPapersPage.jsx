import { useCallback, useEffect, useState } from "react";

import api from "../services/api";
import SearchBar from "../components/SearchBar";
import PaperFilters from "../components/PaperFilters";
import Pagination from "../components/Pagination";

function SearchPapersPage() {
  const [papers, setPapers] = useState([]);

  const [keyword, setKeyword] = useState("");

  const [filters, setFilters] = useState({
    department: "",
    semester: "",
    year: "",
    regulation: "",
    examType: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasFilters = Object.values(filters).some(
    (value) => value !== ""
  );

  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Search
      if (keyword) {
        const response = await api.get(
          `/question-papers/search?keyword=${encodeURIComponent(
            keyword
          )}`
        );

        if (response.data.success) {
          setPapers(response.data.papers || []);
          setTotalResults(response.data.count || 0);
          setTotalPages(1);
        }

        return;
      }

      // Advanced Filters
      if (hasFilters) {
        const params = new URLSearchParams();

        if (filters.department) {
          params.append("department", filters.department);
        }

        if (filters.semester) {
          params.append("semester", filters.semester);
        }

        if (filters.year) {
          params.append("year", filters.year);
        }

        if (filters.regulation) {
          params.append("regulation", filters.regulation);
        }

        if (filters.examType) {
          params.append("examType", filters.examType);
        }

        const response = await api.get(
          `/question-papers/filter?${params.toString()}`
        );

        if (response.data.success) {
          setPapers(response.data.papers || []);
          setTotalResults(response.data.count || 0);
          setTotalPages(1);
        }

        return;
      }

      // Normal pagination
      const response = await api.get(
        `/question-papers?page=${currentPage}&limit=10`
      );

      if (response.data.success) {
        setPapers(response.data.papers || []);
        setTotalResults(response.data.totalResults || 0);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch question papers:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load question papers."
      );

      setPapers([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [keyword, filters, currentPage, hasFilters]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    setCurrentPage(1);
  };

  const handleFilterChange = (name, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));

    setKeyword("");
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      department: "",
      semester: "",
      year: "",
      regulation: "",
      examType: "",
    });

    setKeyword("");
    setCurrentPage(1);
    setError("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section>
        <p className="text-sm font-medium text-blue-600">
          Question Bank
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
          Search Question Papers
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Search and filter university question papers by
          department, semester, year, regulation, and exam type.
        </p>
      </section>

      {/* Search */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Filters */}
      <PaperFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Results Header */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Question Paper Results
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Browse available question papers.
          </p>
        </div>

        <span className="text-sm font-medium text-slate-500">
          {totalResults}{" "}
          {totalResults === 1 ? "result" : "results"}
        </span>
      </section>

      {/* Loading */}
      {loading && (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading question papers...
          </p>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <div className="text-3xl">⚠️</div>

          <h3 className="mt-3 font-semibold text-red-700">
            Something went wrong
          </h3>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchPapers}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </section>
      )}

      {/* Results */}
      {!loading && !error && papers.length > 0 && (
        <>
          <section className="space-y-4">
            {papers.map((paper) => (
              <div
                key={paper._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {paper.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {paper.department?.name && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                          {paper.department.name}
                        </span>
                      )}

                      {paper.subject?.name && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                          {paper.subject.name}
                        </span>
                      )}

                      {paper.semester && (
                        <span className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-700">
                          Semester {paper.semester}
                        </span>
                      )}

                      {paper.year && (
                        <span className="rounded-full bg-purple-50 px-3 py-1 font-medium text-purple-700">
                          {paper.year}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    View Paper
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Empty State */}
      {!loading && !error && papers.length === 0 && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="text-5xl">📄</div>

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            No question papers found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Try changing your search keyword or filters to
            find more question papers.
          </p>

          {(keyword || hasFilters) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear Search & Filters
            </button>
          )}
        </section>
      )}
    </div>
  );
}

export default SearchPapersPage;
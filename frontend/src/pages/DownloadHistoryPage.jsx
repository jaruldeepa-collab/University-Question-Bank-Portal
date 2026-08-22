import { useEffect, useState } from "react";

import api from "../services/api";

function DownloadHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDownloadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/download-history");

      if (response.data.success) {
        setHistory(response.data.history || []);
      }
    } catch (err) {
      console.error(
        "Failed to fetch download history:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load download history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloadHistory();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-blue-600">
          Student Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
          Download History
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          View the question papers you have previously
          downloaded.
        </p>
      </section>

      {/* Loading */}
      {loading && (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading download history...
          </p>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <div className="text-3xl">⚠️</div>

          <h2 className="mt-3 font-semibold text-red-700">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDownloadHistory}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </section>
      )}

      {/* History */}
      {!loading && !error && history.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-800">
              Recently Downloaded
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {history.length}{" "}
              {history.length === 1
                ? "download"
                : "downloads"}{" "}
              recorded
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Question Paper
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subject
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Semester
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Year
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Downloaded
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {history.map((item) => {
                  const paper = item.questionPaper;

                  if (!paper) {
                    return null;
                  }

                  return (
                    <tr
                      key={item._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                            📄
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {paper.title}
                            </p>

                            {paper.regulation && (
                              <p className="mt-1 text-xs text-slate-500">
                                Regulation {paper.regulation}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {paper.department?.name || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {paper.subject?.name || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {paper.semester
                          ? `Semester ${paper.semester}`
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {paper.year || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {paper.pdfUrl ? (
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                          >
                            View PDF
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">
                            PDF unavailable
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {history.map((item) => {
              const paper = item.questionPaper;

              if (!paper) {
                return null;
              }

              return (
                <div
                  key={item._id}
                  className="p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      📄
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-800">
                        {paper.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {paper.subject?.name || "Subject"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Department
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {paper.department?.name || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Semester
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {paper.semester
                          ? `Semester ${paper.semester}`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Year
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {paper.year || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Downloaded
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && history.length === 0 && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="text-5xl">⬇</div>

          <h2 className="mt-4 text-lg font-semibold text-slate-800">
            No download history
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Downloaded question papers will appear here so
            you can access them again easily.
          </p>
        </section>
      )}
    </div>
  );
}

export default DownloadHistoryPage;
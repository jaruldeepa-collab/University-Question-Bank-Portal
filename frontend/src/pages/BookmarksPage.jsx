import { useEffect, useState } from "react";

import api from "../services/api";

function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookmarks");

      if (response.data.success) {
        setBookmarks(response.data.bookmarks || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load bookmarks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (paperId) => {
    try {
      await api.delete(`/bookmarks/${paperId}`);

      setBookmarks((previousBookmarks) =>
        previousBookmarks.filter(
          (bookmark) =>
            bookmark.questionPaper?._id !== paperId
        )
      );
    } catch (err) {
      console.error("Failed to remove bookmark:", err);

      setError(
        err.response?.data?.message ||
          "Failed to remove bookmark."
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-blue-600">
          Student Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
          My Bookmarks
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Access the question papers you have saved for
          quick reference.
        </p>
      </section>

      {/* Loading */}
      {loading && (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading bookmarks...
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
            onClick={fetchBookmarks}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </section>
      )}

      {/* Results */}
      {!loading && !error && bookmarks.length > 0 && (
        <>
          <section className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Saved Papers
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {bookmarks.length}{" "}
                {bookmarks.length === 1
                  ? "paper"
                  : "papers"}{" "}
                saved
              </p>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            {bookmarks.map((bookmark) => {
              const paper = bookmark.questionPaper;

              if (!paper) {
                return null;
              }

              return (
                <article
                  key={bookmark._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Paper Header */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      📄
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-slate-800">
                        {paper.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {paper.subject?.name || "Subject"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveBookmark(paper._id)
                      }
                      className="rounded-lg px-3 py-2 text-xl text-red-500 transition hover:bg-red-50"
                      title="Remove bookmark"
                      aria-label="Remove bookmark"
                    >
                      🔖
                    </button>
                  </div>

                  {/* Details */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Department
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {paper.department?.name || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Subject
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {paper.subject?.name || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Semester
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {paper.semester
                          ? `Semester ${paper.semester}`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">
                        Year
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {paper.year || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View PDF
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveBookmark(paper._id)
                      }
                      className="flex-1 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Remove Bookmark
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && bookmarks.length === 0 && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="text-5xl">🔖</div>

          <h2 className="mt-4 text-lg font-semibold text-slate-800">
            No bookmarks yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Save your favorite question papers from the
            Question Papers page and they will appear here.
          </p>
        </section>
      )}
    </div>
  );
}

export default BookmarksPage;
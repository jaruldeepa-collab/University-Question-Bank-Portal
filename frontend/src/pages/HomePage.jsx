import { useEffect, useState } from "react";

import api from "../services/api";

function HomePage() {
  const [questionPaperCount, setQuestionPaperCount] = useState(0);
const [downloadCount, setDownloadCount] = useState(0);
const [bookmarkCount, setBookmarkCount] = useState(0);
const [subjectCount, setSubjectCount] = useState(0);
  useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const [
        questionPaperResponse,
        bookmarkResponse,
        downloadResponse,
        subjectResponse,
      ] = await Promise.all([
        api.get("/question-papers?limit=1"),
        api.get("/bookmarks"),
        api.get("/download-history"),
        api.get("/subjects"),
      ]);

      if (questionPaperResponse.data.success) {
        setQuestionPaperCount(
          questionPaperResponse.data.totalResults || 0
        );
      }

      if (bookmarkResponse.data.success) {
        setBookmarkCount(
          bookmarkResponse.data.count || 0
        );
      }

      if (downloadResponse.data.success) {
        setDownloadCount(
          downloadResponse.data.count || 0
        );
      }

      if (subjectResponse.data.success) {
        setSubjectCount(
          subjectResponse.data.count || 0
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch dashboard statistics:",
        error
      );
    }
  };

  fetchDashboardStats();
}, []);
  const stats = [
    {
     
  title: "Question Papers",
  value: questionPaperCount,
  description: "Available papers",
  icon: "📄",
},
    
    {
      title: "Bookmarks",
      value: bookmarkCount,
      description: "Saved papers",
      icon: "🔖",
    },
    {
      title: "Downloads",
      value: downloadCount,
      description: "Downloaded papers",
      icon: "⬇",
    },
   {
  title: "Subjects",
  value: subjectCount,
  description: "Available subjects",
  icon: "📚",
},
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <p className="text-sm font-medium text-blue-600">
          Student Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
          Welcome back! 👋
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Find university question papers, manage your bookmarks,
          and track your downloads from one place.
        </p>
      </section>

      {/* Statistics Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-800">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {stat.description}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quickly access the most useful features.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-2xl">📄</div>

            <h3 className="mt-4 font-semibold text-slate-800">
              Search Papers
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Find question papers by department, subject,
              semester, or year.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-2xl">🔖</div>

            <h3 className="mt-4 font-semibold text-slate-800">
              My Bookmarks
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Access the question papers you have saved.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-2xl">⬇</div>

            <h3 className="mt-4 font-semibold text-slate-800">
              Download History
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              View your previously downloaded question papers.
            </p>
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="text-4xl">📚</div>

        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          Start exploring question papers
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
          Your statistics will appear here once question papers,
          bookmarks, and downloads are available.
        </p>
      </section>
    </div>
  );
}

export default HomePage;
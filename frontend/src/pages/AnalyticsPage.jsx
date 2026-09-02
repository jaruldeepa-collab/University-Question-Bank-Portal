import { useEffect, useState, useMemo } from "react";
import api from "../services/api";

function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [allPapers, setAllPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "departments" | "contributors"

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsRes, papersRes] = await Promise.allSettled([
        api.get("/analytics"),
        api.get("/question-papers?limit=100"),
      ]);

      if (
        analyticsRes.status === "fulfilled" &&
        analyticsRes.value.data?.success
      ) {
        setAnalyticsData(analyticsRes.value.data.analytics || {});
      }

      if (papersRes.status === "fulfilled" && papersRes.value.data?.success) {
        setAllPapers(papersRes.value.data.papers || []);
      }
    } catch (err) {
      console.error("Fetch Analytics Error:", err);
      setError("Failed to load analytics metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const overview = analyticsData?.overview || {};
  const departmentDistribution = analyticsData?.departmentDistribution || [];
  const examTypeDistribution = analyticsData?.examTypeDistribution || [];
  const yearDistribution = analyticsData?.yearDistribution || [];
  const mostDownloaded = analyticsData?.mostDownloaded || [];
  const topFacultyUploaders = analyticsData?.topFacultyUploaders || [];

  // Compute total paper count across departments for percentages
  const maxDeptPapers = useMemo(() => {
    if (!departmentDistribution.length) return 1;
    return Math.max(...departmentDistribution.map((d) => d.paperCount || 0), 1);
  }, [departmentDistribution]);

  // Compute total exam count for donut percentages
  const totalExamCount = useMemo(() => {
    return examTypeDistribution.reduce((acc, curr) => acc + (curr.count || 0), 0) || 1;
  }, [examTypeDistribution]);

  // CSV Report Generator & Downloader
  const handleExportCSV = () => {
    if (!allPapers.length && !mostDownloaded.length) return;

    const exportList = allPapers.length > 0 ? allPapers : mostDownloaded;

    const headers = [
      "Title",
      "Department",
      "Semester",
      "Year",
      "Exam Month",
      "Exam Type",
      "Download Count",
      "Uploaded By",
      "Upload Date",
    ];

    const rows = exportList.map((paper) => {
      const deptName =
        typeof paper.department === "object"
          ? paper.department?.name
          : paper.department || "General";
      const uploaderName =
        typeof paper.uploadedBy === "object"
          ? paper.uploadedBy?.name
          : "Faculty";

      return [
        `"${(paper.title || "").replace(/"/g, '""')}"`,
        `"${deptName.replace(/"/g, '""')}"`,
        paper.semester || 1,
        paper.year || "",
        `"${paper.month || ""}"`,
        `"${paper.examType || ""}"`,
        paper.downloadCount || 0,
        `"${uploaderName.replace(/"/g, '""')}"`,
        paper.createdAt ? new Date(paper.createdAt).toISOString().split("T")[0] : "",
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Question_Bank_Analytics_Report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Summary PDF Report Trigger
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Reports & Insights
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
            Analytics Charts & Reports 📊
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Real-time visual distribution charts, student download analytics, department benchmarks, and exportable CSV reports.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 print:hidden">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-700"
          >
            📥 Export CSV Report
          </button>

          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            🖨 Print / PDF Summary
          </button>

          <button
            onClick={fetchAnalytics}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            title="Refresh Metrics"
          >
            🔄
          </button>
        </div>
      </section>

      {/* Error Alert */}
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

      {/* Primary KPI Overview Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Question Papers
            </span>
            <span className="text-2xl">📚</span>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-800">
            {overview.totalPapers || 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Published university exam papers
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Student Downloads
            </span>
            <span className="text-2xl">⬇</span>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-800">
            {overview.totalDownloads || 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Cumulative paper downloads
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5 shadow-sm">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-bold uppercase tracking-wider">
              Active Registered Users
            </span>
            <span className="text-2xl">👥</span>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-800">
            {overview.totalUsers || 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {overview.totalFaculty || 0} Faculty • {overview.totalStudents || 0} Students
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider">
              Active Departments
            </span>
            <span className="text-2xl">🏛</span>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-800">
            {overview.totalDepartments || 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Participating academic departments
          </p>
        </div>
      </section>

      {/* Navigation Tabs for Views */}
      <div className="flex border-b border-slate-200 print:hidden">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>📊</span>
          <span>Distribution Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === "departments"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>🏛</span>
          <span>Department Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab("contributors")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === "contributors"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <span>🏆</span>
          <span>Top Papers & Faculty</span>
        </button>
      </div>

      {/* Section 1: Distribution Analytics */}
      {(activeTab === "overview" || activeTab === "departments") && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Department Bar Chart Visualizer */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Department Upload Distribution 🏛
                </h3>
                <p className="text-xs text-slate-500">
                  Number of papers uploaded per department
                </p>
              </div>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {departmentDistribution.length} Departments
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 animate-pulse bg-slate-100 rounded-xl" />
                ))}
              </div>
            ) : departmentDistribution.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No department uploads recorded.
              </p>
            ) : (
              <div className="space-y-4 pt-2">
                {departmentDistribution.map((dept) => {
                  const paperCount = dept.paperCount || 0;
                  const widthPercent = Math.round(
                    (paperCount / maxDeptPapers) * 100
                  );

                  return (
                    <div key={dept._id || dept.deptCode} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {dept._id || "Department"}
                          </span>
                          {dept.deptCode && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-600 text-[10px]">
                              {dept.deptCode}
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-blue-600">
                          {paperCount} paper{paperCount !== 1 ? "s" : ""} (
                          {dept.totalDownloads || 0} downloads)
                        </span>
                      </div>

                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700"
                          style={{ width: `${Math.max(widthPercent, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Exam Type & Year Distribution Charts */}
          <div className="space-y-6">
            {/* Exam Type Segment Chart */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                Exam Type Breakdown 📝
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {["Semester", "Internal", "Model"].map((type, idx) => {
                  const found = examTypeDistribution.find(
                    (e) => e._id === type
                  );
                  const count = found?.count || 0;
                  const pct = Math.round((count / totalExamCount) * 100);

                  const colors = [
                    "border-blue-100 bg-blue-50/60 text-blue-700",
                    "border-emerald-100 bg-emerald-50/60 text-emerald-700",
                    "border-purple-100 bg-purple-50/60 text-purple-700",
                  ];

                  return (
                    <div
                      key={type}
                      className={`rounded-2xl border p-4 text-center ${colors[idx % 3]}`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider block">
                        {type}
                      </span>
                      <span className="mt-2 text-2xl font-black block text-slate-800">
                        {count}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 block">
                        {pct}% of papers
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Academic Year Chart */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                Academic Year Trends 📅
              </h3>

              {yearDistribution.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No year trend data recorded.
                </p>
              ) : (
                <div className="flex items-end justify-between gap-2 pt-4 h-36 border-b border-slate-100 pb-2">
                  {yearDistribution.map((yItem) => {
                    const yearLabel = yItem._id || "2025";
                    const count = yItem.count || 0;
                    const maxYearCount = Math.max(
                      ...yearDistribution.map((y) => y.count || 1),
                      1
                    );
                    const barHeightPct = Math.round((count / maxYearCount) * 100);

                    return (
                      <div
                        key={yearLabel}
                        className="flex flex-1 flex-col items-center gap-2 h-full justify-end"
                      >
                        <span className="text-[10px] font-bold text-slate-600">
                          {count}
                        </span>
                        <div
                          className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-blue-600 to-sky-400 transition-all duration-500"
                          style={{ height: `${Math.max(barHeightPct, 15)}%` }}
                        />
                        <span className="text-[11px] font-bold text-slate-700">
                          {yearLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* Section 2: Leaderboards & Contributor Tables */}
      {(activeTab === "overview" || activeTab === "contributors") && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top 5 Most Downloaded Papers */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Most Downloaded Question Papers 🏆
                </h3>
                <p className="text-xs text-slate-500">
                  Top performing papers among students
                </p>
              </div>

              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                Top 5
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse bg-slate-100 rounded-xl" />
                ))}
              </div>
            ) : mostDownloaded.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No paper download activity recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {mostDownloaded.map((paper, index) => {
                  const deptName =
                    typeof paper.department === "object"
                      ? paper.department?.name
                      : paper.department || "General";

                  return (
                    <div
                      key={paper._id}
                      className="flex items-center justify-between py-3 text-xs hover:bg-slate-50 px-2 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 font-black text-amber-800 text-xs">
                          #{index + 1}
                        </span>

                        <div className="min-w-0">
                          <h4 className="truncate font-bold text-slate-800 text-sm">
                            {paper.title}
                          </h4>
                          <p className="truncate text-slate-500 text-[11px]">
                            {deptName} • {paper.examType || "Semester"}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-black text-emerald-700">
                          ⬇ {paper.downloadCount || 0}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Top Faculty Contributors */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Top Faculty Contributors 👨‍🏫
                </h3>
                <p className="text-xs text-slate-500">
                  Faculty members with most uploads & downloads
                </p>
              </div>

              <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
                Leaderboard
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse bg-slate-100 rounded-xl" />
                ))}
              </div>
            ) : topFacultyUploaders.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No faculty upload contributions recorded.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {topFacultyUploaders.map((faculty, index) => (
                  <div
                    key={faculty._id}
                    className="flex items-center justify-between py-3 text-xs hover:bg-slate-50 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 font-black text-blue-800 text-xs">
                        #{index + 1}
                      </span>

                      <div className="min-w-0">
                        <h4 className="truncate font-bold text-slate-800 text-sm">
                          {faculty.name || "Faculty Member"}
                        </h4>
                        <p className="truncate text-slate-500 text-[11px]">
                          {faculty.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-right">
                      <span className="rounded-lg bg-blue-50 px-2 py-1 font-bold text-blue-700 text-[11px]">
                        📚 {faculty.uploadsCount || 0} uploads
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Exportable Report Breakdown Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 print:block">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              System Question Paper Master Report 📜
            </h3>
            <p className="text-xs text-slate-500">
              Complete tabular summary for reporting & audit compliance
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 print:hidden"
          >
            📥 Export CSV
          </button>
        </div>

        {allPapers.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No papers recorded in full master list.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Exam Type</th>
                  <th className="py-3 px-3">Year / Month</th>
                  <th className="py-3 px-3">Downloads</th>
                  <th className="py-3 px-3">Uploaded By</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {allPapers.slice(0, 15).map((paper) => {
                  const deptName =
                    typeof paper.department === "object"
                      ? paper.department?.name
                      : paper.department || "General";
                  const uploaderName =
                    typeof paper.uploadedBy === "object"
                      ? paper.uploadedBy?.name
                      : "Faculty";

                  return (
                    <tr key={paper._id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {paper.title}
                      </td>
                      <td className="py-3 px-3 text-slate-700">{deptName}</td>
                      <td className="py-3 px-3">
                        <span className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                          {paper.examType || "Semester"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {paper.month} {paper.year}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-600">
                        {paper.downloadCount || 0}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {uploaderName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AnalyticsPage;

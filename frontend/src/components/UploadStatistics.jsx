import { useMemo } from "react";

function UploadStatistics({ uploads = [] }) {
  const totalUploads = uploads.length;

  const totalDownloads = useMemo(() => {
    return uploads.reduce(
      (sum, paper) => sum + (Number(paper.downloadCount) || 0),
      0
    );
  }, [uploads]);

  const avgDownloads = useMemo(() => {
    if (totalUploads === 0) return 0;
    return (totalDownloads / totalUploads).toFixed(1);
  }, [totalUploads, totalDownloads]);

  // Department distribution
  const departmentStats = useMemo(() => {
    const map = {};
    uploads.forEach((paper) => {
      const deptName =
        typeof paper.department === "object"
          ? paper.department?.name
          : paper.department || "General";
      
      if (!map[deptName]) {
        map[deptName] = { name: deptName, count: 0, downloads: 0 };
      }
      map[deptName].count += 1;
      map[deptName].downloads += Number(paper.downloadCount) || 0;
    });

    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [uploads]);

  // Exam Type distribution
  const examTypeStats = useMemo(() => {
    const map = {
      Semester: 0,
      Internal: 0,
      Model: 0,
    };

    uploads.forEach((paper) => {
      if (paper.examType && map[paper.examType] !== undefined) {
        map[paper.examType] += 1;
      }
    });

    return map;
  }, [uploads]);

  // Top 3 downloaded papers
  const topPapers = useMemo(() => {
    return [...uploads]
      .sort((a, b) => (Number(b.downloadCount) || 0) - (Number(a.downloadCount) || 0))
      .slice(0, 3);
  }, [uploads]);

  if (totalUploads === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="text-4xl">📊</div>
        <h3 className="mt-3 font-semibold text-slate-800">
          No Upload Statistics Available
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Upload question papers to see detailed analytics, department distribution, and student download metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Total Uploads
            </span>
            <span className="text-xl">📚</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {totalUploads}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Question papers published
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Total Downloads
            </span>
            <span className="text-xl">⬇</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {totalDownloads}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Student downloads across papers
          </p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Avg Downloads / Paper
            </span>
            <span className="text-xl">📈</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {avgDownloads}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Average downloads per paper
          </p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Top Department
            </span>
            <span className="text-xl">🏛</span>
          </div>
          <p className="mt-2 truncate text-lg font-bold text-slate-800">
            {departmentStats[0]?.name || "N/A"}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {departmentStats[0] ? `${departmentStats[0].count} papers` : "No papers"}
          </p>
        </div>
      </div>

      {/* Grid for Distribution Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 flex items-center justify-between">
            <span>Department Breakdown</span>
            <span className="text-xs font-normal text-slate-500">
              {departmentStats.length} departments
            </span>
          </h3>

          <div className="mt-4 space-y-3.5">
            {departmentStats.map((dept) => {
              const percentage = Math.round((dept.count / totalUploads) * 100);
              return (
                <div key={dept.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                      {dept.name}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {dept.count} paper{dept.count !== 1 ? "s" : ""} ({percentage}%)
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exam Type Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800">
            Exam Type Distribution
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3 text-center">
              <span className="text-xs font-semibold text-blue-600 block">
                Semester
              </span>
              <span className="mt-1 text-xl font-bold text-slate-800 block">
                {examTypeStats.Semester || 0}
              </span>
              <span className="text-[10px] text-slate-400">Papers</span>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-center">
              <span className="text-xs font-semibold text-emerald-600 block">
                Internal
              </span>
              <span className="mt-1 text-xl font-bold text-slate-800 block">
                {examTypeStats.Internal || 0}
              </span>
              <span className="text-[10px] text-slate-400">Papers</span>
            </div>

            <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-3 text-center">
              <span className="text-xs font-semibold text-purple-600 block">
                Model
              </span>
              <span className="mt-1 text-xl font-bold text-slate-800 block">
                {examTypeStats.Model || 0}
              </span>
              <span className="text-[10px] text-slate-400">Papers</span>
            </div>
          </div>

          {/* Top Downloaded Papers List */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Top Downloaded Papers
            </h4>

            <div className="divide-y divide-slate-100">
              {topPapers.map((paper, idx) => (
                <div
                  key={paper._id}
                  className="flex items-center justify-between py-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-800 text-[10px]">
                      #{idx + 1}
                    </span>
                    <span className="truncate font-semibold text-slate-800">
                      {paper.title}
                    </span>
                  </div>

                  <span className="shrink-0 font-bold text-emerald-600">
                    ⬇ {paper.downloadCount || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadStatistics;

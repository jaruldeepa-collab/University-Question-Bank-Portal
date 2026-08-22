function QuestionPaperCard({
  paper,
  onPreview,
  onDownload,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
                📄
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-slate-800">
                  {paper.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Question Paper
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {paper.department?.name && (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Department
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {paper.department.name}
              </p>
            </div>
          )}

          {paper.subject?.name && (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Subject
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {paper.subject.name}
              </p>
            </div>
          )}

          {paper.semester && (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Semester
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                Semester {paper.semester}
              </p>
            </div>
          )}

          {paper.year && (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">
                Year
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {paper.year}
              </p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="flex flex-wrap gap-2">
          {paper.regulation && (
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              Regulation: {paper.regulation}
            </span>
          )}

          {paper.examType && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {paper.examType}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
          <button
            type="button"
            onClick={() => onPreview(paper)}
            className="flex-1 rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            👁 Preview PDF
          </button>

          <button
            type="button"
            onClick={() => onDownload(paper)}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            ⬇ Download
          </button>
        </div>
      </div>
    </article>
  );
}

export default QuestionPaperCard;
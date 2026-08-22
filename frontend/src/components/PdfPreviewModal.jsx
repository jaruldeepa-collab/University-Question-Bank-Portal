function PdfPreviewModal({ paper, onClose }) {
  if (!paper) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="PDF Preview"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-800">
              {paper.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              PDF Preview
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close PDF preview"
          >
            ✕
          </button>
        </div>

        {/* PDF */}
        <div className="min-h-0 flex-1 bg-slate-100">
          {paper.pdfUrl ? (
            <iframe
              src={paper.pdfUrl}
              title={`${paper.title} PDF Preview`}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <div>
                <div className="text-5xl">📄</div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  PDF not available
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  This question paper does not have a valid PDF URL.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PdfPreviewModal;
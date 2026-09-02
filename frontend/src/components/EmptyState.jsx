import { Link } from "react-router-dom";

function EmptyState({
  icon = "📂",
  title = "No Data Found",
  description = "There are no records matching your current filter selection.",
  actionLabel,
  onAction,
  actionLink,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center dark:border-slate-800 dark:bg-slate-900/50 space-y-3 my-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-slate-800 text-3xl shadow-inner">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h3>

      <p className="max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        <div className="pt-2">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
            >
              {actionLabel}
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default EmptyState;

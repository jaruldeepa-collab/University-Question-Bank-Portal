export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="space-y-2">
            <div className="h-5 w-3/4 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/2 rounded-md bg-slate-100 dark:bg-slate-800/60" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="h-4 w-20 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-7 w-16 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-1.5">
              <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-8 w-16 rounded-md bg-slate-300 dark:bg-slate-700" />
          <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
      ))}
    </div>
  );
}

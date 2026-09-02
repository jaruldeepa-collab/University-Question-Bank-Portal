import { Link, useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 transition-colors duration-300 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-xl text-center space-y-6">
        {/* Visual Badge */}
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-5xl font-black text-white shadow-2xl shadow-blue-500/30 animate-bounce">
          404
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black sm:text-5xl tracking-tight text-slate-900 dark:text-white">
            Lost in the Question Bank? 🗺
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The page or question paper resource you are looking for doesn't exist or has been moved to a different directory.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            ← Go Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700"
          >
            🏠 Return to Dashboard
          </Link>

          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950 dark:text-blue-300"
          >
            🔍 Search Papers
          </Link>
        </div>

        {/* Footer Support Tag */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-6">
          University Question Bank Portal • Error Code HTTP 404
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;

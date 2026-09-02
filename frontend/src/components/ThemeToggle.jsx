import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-lg transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      <span className="transition-transform duration-300 transform hover:scale-110">
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}

export default ThemeToggle;

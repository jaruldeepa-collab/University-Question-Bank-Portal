import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar({ isOpen, onClose }) {
  const { user } = useSelector((state) => state.auth);

  const role = user?.role || "student";

  const studentNavItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "⌂",
      end: true,
    },
    {
      name: "Question Papers",
      path: "/search",
      icon: "📄",
      end: true,
    },
    {
      name: "Bookmarks",
      path: "/bookmarks",
      icon: "🔖",
      end: true,
    },
    {
      name: "Download History",
      path: "/downloads",
      icon: "⬇",
      end: true,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
      end: true,
    },
  ];

  const facultyNavItems = [
    {
      name: "Dashboard",
      path: "/faculty",
      icon: "⌂",
      end: true,
    },
    {
      name: "Upload Paper",
      path: "/faculty/upload",
      icon: "📤",
      end: true,
    },
    {
      name: "My Uploads",
      path: "/faculty/uploads",
      icon: "📄",
      end: true,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
      end: true,
    },
  ];

  const adminNavItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "⌂",
      end: true,
    },
    {
      name: "Faculty Approvals",
      path: "/admin/faculty-approvals",
      icon: "⏳",
      end: true,
    },
    {
      name: "User Management",
      path: "/admin/users",
      icon: "👥",
      end: true,
    },
    {
      name: "Departments",
      path: "/admin/departments",
      icon: "🏛",
      end: true,
    },
    {
      name: "Subjects",
      path: "/admin/subjects",
      icon: "📘",
      end: true,
    },
    {
      name: "Analytics & Reports",
      path: "/admin/analytics",
      icon: "📊",
      end: true,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
      end: true,
    },
  ];

  const navItems =
    role === "faculty"
      ? facultyNavItems
      : role === "admin"
        ? adminNavItems
        : studentNavItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 transform
          border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900
          transition-colors duration-300 transition-transform
          lg:static lg:z-auto lg:block
          lg:min-h-[calc(100vh-4rem)]
          lg:w-64 lg:translate-x-0
          lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col p-4">

          {/* Mobile Header */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Menu
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6 rounded-xl bg-blue-50 dark:bg-slate-800/80 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-xs capitalize text-slate-500 dark:text-slate-400">
                  {role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={`${item.name}-${item.path}`}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                  }`
                }
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Account */}
          <div className="mt-auto rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Account
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
              {role}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
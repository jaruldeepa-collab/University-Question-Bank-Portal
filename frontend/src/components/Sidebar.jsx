import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar({ isOpen, onClose }) {
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "⌂",
    },
    {
  name: "Question Papers",
  path: "/search",
  icon: "📄",
},
    {
      name: "Bookmarks",
      path: "/bookmarks",
      icon: "🔖",
    },
    {
      name: "Download History",
      path: "/downloads",
      icon: "⬇",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
    },
  ];

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
          fixed inset-y-0 left-0 z-50 w-72 transform border-r
          border-slate-200 bg-white transition-transform duration-300
          lg:static lg:z-auto lg:block lg:min-h-[calc(100vh-4rem)]
          lg:w-64 lg:translate-x-0 lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col p-4">

          {/* Mobile Header */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-bold text-slate-800">
              Menu
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-600 hover:bg-slate-100"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6 rounded-xl bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-xs capitalize text-slate-500">
                  {user?.role || "Student"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
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
          <div className="mt-auto rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Account
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
              {user?.role || "Student"}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../services/api";
import { clearUser } from "../redux/slices/authSlice";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(clearUser());
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left Section */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              UQ
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-800">
                University Question Bank
              </h1>

              <p className="text-xs text-slate-500">
                Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">

          {user && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user.name}
              </p>

              <p className="text-xs capitalize text-slate-500">
                {user.role}
              </p>
            </div>
          )}

          {/* Profile */}
          <Link
            to="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 transition hover:bg-blue-200"
            title="Profile"
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="hidden rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:block"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
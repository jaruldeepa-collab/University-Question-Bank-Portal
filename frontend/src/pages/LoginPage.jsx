import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../services/api";
import {
  setLoading,
  setUser,
  setAuthError,
} from "../redux/slices/authSlice";
import ThemeToggle from "../components/ThemeToggle";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError("");
      dispatch(setLoading(true));

      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        dispatch(setLoading(false));

        navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please try again.";

      setServerError(message);
      dispatch(setAuthError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 transition-colors duration-300 dark:bg-slate-950">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white text-xl shadow-lg shadow-blue-500/20">
            UQ
          </div>

          <h1 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
            Welcome Back 👋
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Login to your University Question Bank account
          </p>
        </div>

        {serverError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-300">
            ⚠️ {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              Email Address *
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your university email"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-xs font-semibold text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                Password *
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot Password?
              </Link>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="mt-1 text-xs font-semibold text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Login to Account
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-5 text-center dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:underline dark:text-blue-400"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setSuccessMessage("");

      const response = await api.put(
        `/auth/reset-password/${token}`,
        {
          password: data.password,
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          response.data.message ||
            "Password reset successful. Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to reset password. Link may be expired."
      );
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white text-xl shadow-lg shadow-blue-500/20">
            🔐
          </div>

          <h1 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
            Reset Password
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Enter your new password below
          </p>
        </div>

        {/* Error */}
        {serverError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-300">
            ⚠️ {serverError}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-3.5 text-xs font-semibold text-green-700 dark:border-green-900/50 dark:bg-green-950/60 dark:text-green-300">
            ✅ {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-5"
        >
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              New Password *
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs font-semibold text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              Confirm New Password *
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-xs font-semibold text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 border-t border-slate-100 pt-5 text-center dark:border-slate-800">
          <Link
            to="/login"
            className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
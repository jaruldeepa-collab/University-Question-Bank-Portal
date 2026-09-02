import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setMessage("");
      setServerError("");

      const response = await api.post("/auth/forgot-password", {
        email: data.email,
      });

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "Password reset instructions have been sent to your email."
        );
        setSubmitted(true);
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
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
            🔑
          </div>

          <h1 className="text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
            Forgot Password?
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Enter your registered email to reset your password.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-3.5 text-xs font-semibold text-green-700 dark:border-green-900/50 dark:bg-green-950/60 dark:text-green-300">
            ✅ {message}
          </div>
        )}

        {serverError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-300">
            ⚠️ {serverError}
          </div>
        )}

        {!submitted && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-5"
          >
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
                placeholder="Enter your registered email"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
            </button>
          </form>
        )}

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

export default ForgotPasswordPage;
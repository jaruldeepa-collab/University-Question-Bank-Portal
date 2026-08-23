import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/auth/profile", {
  name: name.trim(),
  email: email.trim(),

      });

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "Profile updated successfully."
        );

        setEditing(false);

        // Update local Redux user if available
        if (user) {
          user.name = response.data.user.name;
        }
      }
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setEditing(false);
    setMessage("");
    setError("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-blue-600">
          Student Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
          My Profile
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          View and manage your account information.
        </p>
      </section>

      {/* Messages */}
      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Profile Overview */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* User Details */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {user?.name || "User"}
            </h2>

            <p className="mt-1 text-slate-500">
              {user?.email || "No email available"}
            </p>

            <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
              {user?.role || "student"}
            </span>
          </div>
        </div>
      </section>

      {/* Account Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your account details.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => {
                setName(user?.name || "");
                setEmail(user?.email || "");
                setMessage("");
                setError("");
                setEditing(true);
              }}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                  setMessage("");
                }}
                disabled={!editing || loading}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                  editing
                    ? "border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    : "border-slate-300 bg-slate-50 text-slate-700"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

             <input
  id="email"
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    setError("");
    setMessage("");
  }}
  disabled={!editing || loading}
  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
    editing
      ? "border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      : "border-slate-300 bg-slate-50 text-slate-700"
  }`}
/>
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Account Role
              </label>

              <input
                id="role"
                type="text"
                value={user?.role || "student"}
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-700"
              />
            </div>
          </div>

          {/* Buttons */}
          {editing && (
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default ProfilePage;
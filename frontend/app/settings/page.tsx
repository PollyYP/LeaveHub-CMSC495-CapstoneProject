"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import Header from "@/components/layout/Header";

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser({
        name: parsed.name,
        email: parsed.email,
        department: parsed.department,
        role: parsed.role || "Employee",
      });
    }
  }, []);

  const handlePasswordChange = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters.");
      return;
    }

    const stored = localStorage.getItem("user");
    if (!stored) return;
    const user = JSON.parse(stored);

    try {
      const res = await fetch("/_/backend/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setPasswordMessage(err.detail || "Failed to change password.");
        return;
      }

      setPasswordMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage("Could not connect to server.");
    }

    setTimeout(() => {
      if (user.role === "Manager") {
        window.location.href = "/manager";
      } else {
        window.location.href = "/employee";
      }
    }, 1500);
  };

  return (
    <div>
      <div className="md:hidden">
        <Header />
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile and account preferences.
        </p>
      </div>

      <div className="space-y-6">

        {/* Profile */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
          <div className="flex items-center gap-4">
            <Avatar name={user.name || "User"} size="lg" />
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="bg-gray-100 text-gray-900 p-3 rounded-xl text-sm">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="bg-gray-100 text-gray-900 p-3 rounded-xl text-sm">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
              <p className="bg-gray-100 text-gray-900 p-3 rounded-xl text-sm">{user.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
              <p className="bg-gray-100 text-gray-900 p-3 rounded-xl text-sm">{user.role}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Profile information is managed by your administrator. Contact IT to request changes.
          </p>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full bg-gray-100 text-gray-900 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">New Password</label>
              <input
                type="password"
                className="w-full bg-gray-100 text-gray-900 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full bg-gray-100 text-gray-900 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {passwordMessage && (
              <p className={`text-sm ${passwordMessage.includes("not") || passwordMessage.includes("must") ? "text-red-500" : "text-indigo-600"}`}>
                {passwordMessage}
              </p>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Logout</h3>
          <p className="text-sm text-gray-500 mb-4">Sign out of your account on this device.</p>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="px-6 py-2.5 rounded-full border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
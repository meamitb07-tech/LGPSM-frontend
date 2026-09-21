"use client";

import React, { useState } from "react";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";

export default function AddUserPage() {
  const { user } = useAuth();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    contactNo: "",
    email: "",
  });
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName) return;

    const newUserObj = {
      id: `usr_${Date.now()}`,
      name: formData.userName,
      fullName: formData.userName,
      email: formData.email,
      phone: formData.contactNo,
      assignedCountText: "0 Event & 0 Sessions",
      eventsList: [],
    };

    try {
      const keys = ["app_local_system_users", "app_local_users"];
      keys.forEach((k) => {
        const stored = localStorage.getItem(k);
        let list = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(list)) list = [];
        // Avoid duplicate emails/names if re-added
        list = [newUserObj, ...list.filter((u: any) => u.email !== formData.email && u.name !== formData.userName)];
        localStorage.setItem(k, JSON.stringify(list));
      });
    } catch (e) { }

    try {
      await userService.createUser({
        fullName: formData.userName,
        email: formData.email,
        phone: formData.contactNo,
        role: "SYSTEM_USER",
      });
    } catch (err) {
      console.error("Failed to create user:", err);
    } finally {
      setIsAddedSuccess(true);
      setIsAddUserModalOpen(false);
      setFormData({ userName: "", contactNo: "", email: "" });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <h1 className="text-xl font-bold text-gray-900">Add User</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-800">{user?.fullName || user?.email || "Super Admin"}</span>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 flex-1 flex flex-col">
          {/* Controls Bar: Title + Search Bar on Left, + Add User Button on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <h2 className="text-lg font-bold text-gray-900 shrink-0">System Users</h2>
              <div className="relative flex-1">
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add User</span>
            </button>
          </div>

          {/* Success Notification Banner */}
          {isAddedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-semibold text-center animate-in fade-in">
              User &quot;{formData.userName || "New User"}&quot; added successfully!
            </div>
          )}

          {/* Empty State Container (Image 1) */}
          <div className="flex-1 flex flex-col items-center justify-center my-auto py-16 space-y-4">
            {/* 3 People Icon */}
            <div className="w-20 h-20 text-gray-300 flex items-center justify-center">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                <path d="M18 11c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.25 0-.49.04-.71.11.45.82.71 1.76.71 2.76 0 1.01-.26 1.95-.71 2.78.22.07.46.1.71.1zm.9 3.01C20.2 14.86 21 16.02 21 17v2h3v-2c0-1.8-3.03-2.79-5.1-2.99z" />
                <path d="M6 11c.25 0 .49-.03.71-.1-.45-.83-.71-1.77-.71-2.78 0-1 .26-1.94.71-2.76C6.49 5.04 6.25 5 6 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-.9 3.01C3.03 14.21 0 15.2 0 17v2h3v-2c0-.98.8-2.14 2.1-2.99z" />
              </svg>
            </div>

            <p className="text-sm font-semibold text-gray-600">
              No users added yet. Add users now.
            </p>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-[#FF5B22] font-semibold text-xs rounded-md transition-colors cursor-pointer"
            >
              Add User
            </button>
          </div>
        </main>

      {/* Add User Modal (Image 2) */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden space-y-6">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Add User</h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddUserSubmit} className="px-6 space-y-5">
              {/* User Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  User Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter User Name"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              {/* Contact No */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Contact No<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter Contact No"
                  value={formData.contactNo}
                  onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 pb-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

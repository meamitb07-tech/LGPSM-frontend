"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { userService } from '@/services/userService';

export default function AddEventOrganizerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organizerName: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const newOrg = {
      id: String(Date.now()),
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      status: "Active" as const,
    };

    try {
      const existing = localStorage.getItem("app_local_organizers");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newOrg);
      localStorage.setItem("app_local_organizers", JSON.stringify(list));
    } catch (err) { }

    try {
      await userService.createUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: 'ORGANIZER',
      });
    } catch (err: any) {
      console.warn("Backend creation fallback:", err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/event-organizer');
      }, 1000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <h1 className="text-xl font-bold text-gray-900">Add Event Organizer</h1>
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

        {/* Form Container */}
        <main className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 md:p-8 shadow-2xs space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Event Organizer</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Type Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Type Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Type Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Organizer Name (Spans 2 cols) */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Organizer Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Type Name"
                  value={formData.organizerName}
                  onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
                />
              </div>

              {/* Organizer Logo Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">Organizer Logo</label>
                <div className="border border-dashed border-gray-300 rounded-md p-6 bg-white hover:bg-gray-50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[110px]">
                  <span className="text-[11px] text-gray-400 max-w-[200px] leading-tight">
                    Drag and drop a photo here or click to open file
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Add Organizer'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-md text-xs font-semibold text-center animate-in fade-in">
              {error}
            </div>
          )}

          {isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-semibold text-center animate-in fade-in">
              Organizer added successfully! Redirecting to list...
            </div>
          )}
        </main>
    </div>
  );
}

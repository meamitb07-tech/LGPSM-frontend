"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeItem?: "dashboard" | "add-event" | "configurations" | "user-management" | "billing" | "reports" | "settings";
}

export default function Sidebar({ activeItem = "dashboard" }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  return (
    <aside className="w-64 bg-[#14161A] text-gray-300 flex flex-col justify-between shrink-0 hidden md:flex h-screen sticky top-0 overflow-y-auto p-4 font-sans select-none z-30">
      <div className="space-y-5">
        {/* Brand Logo Header */}
        <div className="px-2 pt-2 pb-2">
          <Link href="/" className="inline-block">
            <Image
              src="/Nav_logo.png"
              alt="LGPSM Logo"
              width={180}
              height={66}
              priority
              className="h-17 w-auto object-contain brightness-110"
            />
          </Link>
        </div>

        {/* + Add Event Button */}
        <Link
          href="/events/add"
          className={`w-full py-2.5 px-4 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
            activeItem === "add-event"
              ? "bg-[#FF5B22] hover:bg-[#E04B16]"
              : "bg-[#282B33] hover:bg-[#323640]"
          }`}
        >
          <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Event</span>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1 text-xs font-medium pt-1">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "dashboard"
                ? "bg-[#282B33] text-white font-semibold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashbaord</span>
            </div>
          </Link>

          {/* Configurations */}
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "configurations"
                ? "bg-[#282B33] text-white font-semibold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Configurations</span>
            </div>
            <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* User Management */}
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "user-management"
                ? "bg-[#282B33] text-white font-semibold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>User Management</span>
            </div>
          </div>

          {/* Billing (Credit Card Icon) */}
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "billing"
                ? "bg-[#282B33] text-white font-semibold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Billing</span>
            </div>
          </div>

          {/* Reports */}
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "reports"
                ? "bg-[#282B33] text-white font-semibold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Reports</span>
            </div>
            <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Settings */}
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "settings"
                ? "bg-[#282B33] text-white font-semibold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              <span>Settings</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom Sidebar Options */}
      <div className="pt-4 border-t border-gray-800/80 space-y-1 text-xs text-gray-400 font-medium">
        <div className="flex items-center gap-3 px-3 py-2 hover:text-white cursor-pointer transition-colors">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span>Notification</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 hover:text-red-400 cursor-pointer transition-colors text-left"
        >
          <svg className="w-4 h-4 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

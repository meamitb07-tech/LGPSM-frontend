"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeItem?:
    | "dashboard"
    | "add-event"
    | "event"
    | "add-new-event"
    | "events-list"
    | "add-invitees"
    | "assign-system-users"
    | "add-user"
    | "all-users"
    | "templates"
    | "event-organizer"
    | "add-organizer"
    | "all-organizers"
    | "earnings"
    | "reports"
    | "settings"
    | "configurations"
    | "event-management"
    | "invitees-management"
    | "user-management"
    | "billing";
}

export default function Sidebar({ activeItem = "dashboard" }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const isEventGroupActive =
    activeItem === "event" ||
    activeItem === "add-new-event" ||
    activeItem === "events-list" ||
    activeItem === "add-invitees" ||
    activeItem === "assign-system-users" ||
    activeItem === "add-user" ||
    activeItem === "all-users" ||
    activeItem === "event-management" ||
    activeItem === "invitees-management";

  const isOrganizerGroupActive =
    activeItem === "event-organizer" ||
    activeItem === "add-organizer" ||
    activeItem === "all-organizers";

  const isSettingsGroupActive = activeItem === "settings";

  const [isEventOpen, setIsEventOpen] = useState(isEventGroupActive || true);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(isOrganizerGroupActive);
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsGroupActive);

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
              src="/images/navbar/Nav_logo.png"
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
            activeItem === "add-event" || activeItem === "add-new-event"
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
          {/* 1. Dashboard */}
          <Link
            href="/dashboard"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "dashboard"
                ? "bg-[#282B33] font-semibold text-[#FF5B22]"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-4 h-4 ${activeItem === "dashboard" ? "text-[#FF5B22]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </div>
          </Link>

          {/* 2. Event Group (Collapsible) */}
          <div className="space-y-1">
            <button
              onClick={() => setIsEventOpen(!isEventOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer text-left ${
                isEventGroupActive
                  ? "bg-[#282B33] font-semibold text-[#FF5B22]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4 ${isEventGroupActive ? "text-[#FF5B22]" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Event</span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-gray-500 shrink-0 transform transition-transform duration-200 ${
                  isEventOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Event Sub-items */}
            {isEventOpen && (
              <div className="pl-6 space-y-1 pt-1">
                <Link
                  href="/events/add"
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors relative ${
                    activeItem === "add-new-event"
                      ? "text-[#FF5B22] font-semibold bg-gray-800/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/20"
                  }`}
                >
                  {activeItem === "add-new-event" && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FF5B22] rounded-r" />
                  )}
                  <span>Add New Event</span>
                </Link>

                <Link
                  href="/events"
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors relative ${
                    activeItem === "events-list" || activeItem === "event-management"
                      ? "text-[#FF5B22] font-semibold bg-gray-800/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/20"
                  }`}
                >
                  {(activeItem === "events-list" || activeItem === "event-management") && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FF5B22] rounded-r" />
                  )}
                  <span>Events</span>
                </Link>

                <Link
                  href="/events/1/invitees"
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors relative ${
                    activeItem === "add-invitees" || activeItem === "invitees-management"
                      ? "text-[#FF5B22] font-semibold bg-gray-800/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/20"
                  }`}
                >
                  {(activeItem === "add-invitees" || activeItem === "invitees-management") && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FF5B22] rounded-r" />
                  )}
                  <span>Add Invitees</span>
                </Link>

                <Link
                  href="/events/1/assign-users"
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors relative ${
                    activeItem === "assign-system-users"
                      ? "text-[#FF5B22] font-semibold bg-gray-800/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/20"
                  }`}
                >
                  {activeItem === "assign-system-users" && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FF5B22] rounded-r" />
                  )}
                  <span>Assign System Users</span>
                </Link>

                <Link
                  href="/user-management"
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors relative ${
                    activeItem === "add-user"
                      ? "text-[#FF5B22] font-semibold bg-gray-800/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/20"
                  }`}
                >
                  {activeItem === "add-user" && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FF5B22] rounded-r" />
                  )}
                  <span>Add User</span>
                </Link>

                <Link
                  href="/user-management"
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors relative ${
                    activeItem === "all-users" || activeItem === "user-management"
                      ? "text-[#FF5B22] font-semibold bg-gray-800/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/20"
                  }`}
                >
                  {(activeItem === "all-users" || activeItem === "user-management") && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FF5B22] rounded-r" />
                  )}
                  <span>All Users</span>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Templates */}
          <Link
            href="/events/add"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "templates"
                ? "bg-[#282B33] font-semibold text-[#FF5B22]"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-4 h-4 ${activeItem === "templates" ? "text-[#FF5B22]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <span>Templates</span>
            </div>
          </Link>

          {/* 4. Event Organizer (Collapsible) */}
          <div className="space-y-1">
            <button
              onClick={() => setIsOrganizerOpen(!isOrganizerOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer text-left ${
                isOrganizerGroupActive
                  ? "bg-[#282B33] font-semibold text-[#FF5B22]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4 ${isOrganizerGroupActive ? "text-[#FF5B22]" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Event Organizer</span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-gray-500 shrink-0 transform transition-transform duration-200 ${
                  isOrganizerOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Organizer Sub-items */}
            {isOrganizerOpen && (
              <div className="pl-6 space-y-1 pt-1">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors relative ${
                    activeItem === "add-organizer"
                      ? "text-[#FF5B22] font-semibold bg-gray-800/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/20"
                  }`}
                >
                  {activeItem === "add-organizer" && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FF5B22] rounded-r" />
                  )}
                  <span>Add New Organizer</span>
                </Link>

                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors relative ${
                    activeItem === "all-organizers"
                      ? "text-[#FF5B22] font-semibold bg-gray-800/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/20"
                  }`}
                >
                  {activeItem === "all-organizers" && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FF5B22] rounded-r" />
                  )}
                  <span>All Organizers</span>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Earnings */}
          <Link
            href="/dashboard"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "earnings" || activeItem === "billing"
                ? "bg-[#282B33] font-semibold text-[#FF5B22]"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-4 h-4 ${activeItem === "earnings" || activeItem === "billing" ? "text-[#FF5B22]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Earnings</span>
            </div>
          </Link>

          {/* 6. Reports */}
          <Link
            href="/dashboard"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
              activeItem === "reports"
                ? "bg-[#282B33] font-semibold text-[#FF5B22]"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-4 h-4 ${activeItem === "reports" ? "text-[#FF5B22]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Reports</span>
            </div>
          </Link>

          {/* 7. Settings (Collapsible) */}
          <div className="space-y-1">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer text-left ${
                isSettingsGroupActive
                  ? "bg-[#282B33] font-semibold text-[#FF5B22]"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-4 h-4 ${isSettingsGroupActive ? "text-[#FF5B22]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                <span>Settings</span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-gray-500 shrink-0 transform transition-transform duration-200 ${
                  isSettingsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Area: Notification & Logout */}
      <div className="pt-4 border-t border-gray-800 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-md cursor-pointer transition-colors">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span>Notification</span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-md cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

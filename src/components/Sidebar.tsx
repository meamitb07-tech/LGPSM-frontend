"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarEventGroup from "./sidebar/SidebarEventGroup";
import SidebarOrganizerGroup from "./sidebar/SidebarOrganizerGroup";
import SidebarSettingsGroup from "./sidebar/SidebarSettingsGroup";
import SidebarFooter from "./sidebar/SidebarFooter";
import { getActiveItemFromPathname } from "./sidebar/sidebarUtils";

export interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem: propActiveItem }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const activeItem = propActiveItem || getActiveItemFromPathname(pathname);

  const isEventGroupActive = [
    "event",
    "add-new-event",
    "events-list",
    "add-invitees",
    "assign-system-users",
    "add-user",
    "all-users",
    "event-management",
    "invitees-management",
  ].includes(activeItem);

  const isOrganizerGroupActive = [
    "event-organizer",
    "add-organizer",
    "all-organizers",
  ].includes(activeItem);

  const isSettingsGroupActive = [
    "settings",
    "template-settings",
    "event-settings",
    "price-rate-settings",
    "notification-settings",
    "notifications-settings",
    "account-settings",
  ].includes(activeItem);

  const renderNavItems = () => (
    <nav className="space-y-1 text-xs font-medium pt-1">
      {/* 1. Dashboard */}
      <Link
        href="/dashboard"
        onClick={() => setIsMobileOpen(false)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
          activeItem === "dashboard"
            ? "bg-[#282B33] font-semibold text-[#FF5B22]"
            : "text-gray-400 hover:text-white hover:bg-gray-800/40"
        }`}
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-4 h-4 ${activeItem === "dashboard" ? "text-[#FF5B22]" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Dashboard</span>
        </div>
      </Link>

      {/* 2. Event Group */}
      <SidebarEventGroup activeItem={activeItem} isGroupActive={isEventGroupActive} />

      {/* 3. Templates */}
      <Link
        href="/templates"
        onClick={() => setIsMobileOpen(false)}
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

      {/* 4. Event Organizer */}
      <SidebarOrganizerGroup activeItem={activeItem} isGroupActive={isOrganizerGroupActive} />

      {/* 5. Earnings */}
      <Link
        href="/earnings"
        onClick={() => setIsMobileOpen(false)}
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
        href="/reports"
        onClick={() => setIsMobileOpen(false)}
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

      {/* 7. Settings Group */}
      <SidebarSettingsGroup activeItem={activeItem} isGroupActive={isSettingsGroupActive} />
    </nav>
  );

  return (
    <>
      {/* Mobile Top Header Bar (< md) */}
      <div className="flex md:hidden items-center justify-between bg-[#14161A] px-4 py-3 border-b border-gray-800 sticky top-0 z-30 shrink-0 w-full">
        <SidebarLogo />
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-gray-400 hover:text-white rounded-md cursor-pointer transition-colors focus:outline-none"
          title="Open Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Slide-Over Drawer (< md) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-64 max-w-[80vw] bg-[#14161A] text-gray-300 h-full p-4 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto overscroll-contain animate-in slide-in-from-left duration-250">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <SidebarLogo />
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 text-gray-400 hover:text-white rounded-md cursor-pointer"
                  title="Close Menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Add Event Button */}
              <Link
                href="/events/add"
                onClick={() => setIsMobileOpen(false)}
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

              {renderNavItems()}
            </div>

            <SidebarFooter activeItem={activeItem} />
          </div>
        </div>
      )}

      {/* Desktop Permanent Sticky Sidebar (>= md) */}
      <aside className="w-64 bg-[#14161A] text-gray-300 flex-col justify-between shrink-0 hidden md:flex h-screen sticky top-0 overflow-y-auto overscroll-contain no-scrollbar p-4 font-sans select-none z-30">
        <div className="space-y-3">
          <SidebarLogo />

          {/* Add Event Button */}
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

          {renderNavItems()}
        </div>

        <SidebarFooter activeItem={activeItem} />
      </aside>
    </>
  );
}

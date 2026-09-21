"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SidebarEventGroupProps {
  activeItem?: string;
  isGroupActive: boolean;
}

export default function SidebarEventGroup({
  activeItem,
  isGroupActive,
}: SidebarEventGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  const navLinks = [
    { label: "Events", href: "/events", activeKeys: ["events-list", "event-management"] },
    { label: "Add Invitees", href: "/events/1/invitees", activeKeys: ["add-invitees", "invitees-management"] },
    { label: "Assign System Users", href: "/user-management/assign", activeKeys: ["assign-system-users"] },
    { label: "Add User", href: "/user-management/add", activeKeys: ["add-user"] },
    { label: "All Users", href: "/user-management", activeKeys: ["all-users", "user-management"] },
  ];

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer text-left ${
          isGroupActive
            ? "bg-[#282B33] font-semibold text-[#FF5B22]"
            : "text-gray-400 hover:text-white hover:bg-gray-800/40"
        }`}
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-4 h-4 ${isGroupActive ? "text-[#FF5B22]" : "text-gray-400"}`}
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
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="pl-6 space-y-1 pt-1">
          {navLinks.map((item) => {
            const isActive = activeItem && item.activeKeys.includes(activeItem);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors relative ${
                  isActive
                    ? "text-[#FF5B22] font-semibold bg-gray-800/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/20"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FF5B22] rounded-r" />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

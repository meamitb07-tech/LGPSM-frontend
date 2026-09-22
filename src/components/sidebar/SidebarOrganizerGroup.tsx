"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface SidebarOrganizerGroupProps {
  activeItem?: string;
  isGroupActive: boolean;
}

export default function SidebarOrganizerGroup({
  activeItem,
  isGroupActive,
}: SidebarOrganizerGroupProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(isGroupActive);

  // Administrative module: Only visible to ADMIN
  if (user?.role !== "ADMIN") return null;

  const navLinks = [
    { label: "Add New Organizer", href: "/event-organizer/add", activeKey: "add-organizer" },
    { label: "All Organizers", href: "/event-organizer", activeKeys: ["all-organizers", "event-organizer"] },
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Event Organizer</span>
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
            const isActive =
              activeItem === item.activeKey ||
              (item.activeKeys && item.activeKeys.includes(activeItem || ""));
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

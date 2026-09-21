"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SidebarSettingsGroupProps {
  activeItem?: string;
  isGroupActive: boolean;
}

export default function SidebarSettingsGroup({
  activeItem,
  isGroupActive,
}: SidebarSettingsGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  const subItems = [
    {
      label: "Template Settings",
      href: "/settings/template",
      activeKeys: ["template-settings", "settings"],
    },
    {
      label: "Event Settings",
      href: "/settings/event",
      activeKeys: ["event-settings"],
    },
    {
      label: "Price Rate Settings",
      href: "/settings/price-rate",
      activeKeys: ["price-rate-settings"],
    },
    {
      label: "Notification Settings",
      href: "/settings/notification",
      activeKeys: ["notification-settings", "notifications-settings"],
    },
    {
      label: "Account Settings",
      href: "/settings/account",
      activeKeys: ["account-settings"],
    },
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
          {/* Crisp Classic Settings Gear / Cogwheel Icon */}
          <svg
            className={`w-4 h-4 ${isGroupActive ? "text-[#FF5B22]" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Settings</span>
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
          {subItems.map((item) => {
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

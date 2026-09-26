"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { notificationService, onNotificationsChanged } from "@/services/notificationService";

interface SidebarFooterProps {
  activeItem?: string;
}

export default function SidebarFooter({ activeItem }: SidebarFooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Unread count comes from the backend (meta.unreadCount); refreshed on navigation and whenever notifications change
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const refresh = () => {
      notificationService.getUserNotifications(true, 1, 1).then((res) => {
        if (cancelled) return;
        const count = res.meta?.unreadCount;
        setUnreadCount(res.success && typeof count === "number" ? count : 0);
      });
    };
    refresh();
    const unsubscribe = onNotificationsChanged(refresh);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [isAuthenticated, pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  const isNotificationActive =
    activeItem === "notification" || activeItem === "notifications";

  return (
    <div className="pt-4 border-t border-gray-800 space-y-1">
      <Link
        href="/notification"
        className={`flex items-center gap-3 px-3 py-2.5 text-xs rounded-md cursor-pointer transition-colors ${
          isNotificationActive
            ? "bg-[#282B33] font-semibold text-[#FF5B22]"
            : "text-gray-400 hover:text-white hover:bg-gray-800/40"
        }`}
      >
        <svg
          className={`w-4 h-4 shrink-0 ${
            isNotificationActive ? "text-[#FF5B22]" : "text-gray-400"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span>Notification</span>
        {unreadCount > 0 && (
          <span
            className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF5B22] text-white text-[10px] font-bold flex items-center justify-center"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-md cursor-pointer transition-colors"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Log out</span>
      </button>
    </div>
  );
}

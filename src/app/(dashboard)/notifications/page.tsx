"use client";

import React, { useState } from "react";
import NotificationCard from "@/components/notifications/NotificationCard";
import { initialNotifications } from "@/data/notificationsData";
import { NotificationItem } from "@/types/notifications";
import { useAuth } from "@/context/AuthContext";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications] = useState<NotificationItem[]>(initialNotifications);

  return (
    <div className="w-full min-h-full bg-white">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <h1 className="text-base font-bold text-gray-800">Notification</h1>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700">{user?.fullName || user?.email || "Account Name"}</span>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-7xl w-full mx-auto space-y-4 pb-24">
        {notifications.map((item) => (
          <NotificationCard key={item.id} notification={item} />
        ))}
      </div>
    </div>
  );
}

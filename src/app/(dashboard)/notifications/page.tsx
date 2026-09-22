"use client";

import React, { useState } from "react";
import NotificationCard from "@/components/notifications/NotificationCard";
import { initialNotifications } from "@/data/notificationsData";
import { NotificationItem } from "@/types/notifications";
import { useAuth } from "@/context/AuthContext";
import UserNavDropdown from "@/components/common/UserNavDropdown";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications] = useState<NotificationItem[]>(initialNotifications);

  return (
    <div className="w-full min-h-full bg-white">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <h1 className="text-base font-bold text-gray-800">Notification</h1>
        <UserNavDropdown />
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

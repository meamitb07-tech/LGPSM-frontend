"use client";

import React from "react";
import { NotificationItem } from "@/types/notifications";

interface NotificationCardProps {
  notification: NotificationItem;
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  return (
    <div className="bg-white rounded-md border border-gray-200/80 p-6 shadow-xs hover:border-gray-300 transition-colors space-y-3">
      <h3 className="text-sm font-bold text-gray-800">{notification.title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">
        {notification.description}
      </p>
      <div className="text-[11px] font-medium text-gray-400 pt-1">
        {notification.date} <span className="mx-1">|</span> {notification.time}
      </div>
    </div>
  );
}

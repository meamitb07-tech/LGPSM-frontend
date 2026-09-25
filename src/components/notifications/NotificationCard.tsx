"use client";

import React from "react";

export interface NotificationCardData {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  timeAgo?: string;
  unread?: boolean;
}

interface NotificationCardProps {
  notification: NotificationCardData;
  onClear?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}

export default function NotificationCard({
  notification,
  onClear,
  onMarkRead,
}: NotificationCardProps) {
  const isRsvp = notification.type.toLowerCase().includes("rsvp") || notification.title.toLowerCase().includes("rsvp");
  const isSystem = notification.type.toLowerCase().includes("system") || notification.type.toLowerCase().includes("notice");

  return (
    <div
      className={`relative bg-white rounded-lg border transition-all duration-200 p-5 shadow-xs hover:shadow-md flex items-start justify-between gap-4 ${
        notification.unread ? "border-[#FF5B22]/30 bg-orange-50/20" : "border-gray-200/80"
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Category Icon */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
            isRsvp
              ? "bg-emerald-50 text-emerald-600"
              : isSystem
              ? "bg-blue-50 text-blue-600"
              : "bg-orange-50 text-[#FF5B22]"
          }`}
        >
          {isRsvp ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : isSystem ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          )}
        </div>

        {/* Content Body */}
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-gray-900 truncate">{notification.title}</h3>
            {notification.unread && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5B22] text-white">
                New
              </span>
            )}
            <span className="text-[11px] font-medium text-gray-400 ml-auto">
              {notification.timestamp}
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed font-medium break-words">
            {notification.message || "No detailed message provided for this notification alert."}
          </p>
        </div>
      </div>

      {/* Action Buttons: Clear & Mark Read */}
      <div className="flex items-center gap-2 shrink-0">
        {notification.unread && onMarkRead && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer"
            title="Mark as read"
          >
            Read
          </button>
        )}
        {onClear && (
          <button
            type="button"
            onClick={() => onClear(notification.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title="Clear Notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

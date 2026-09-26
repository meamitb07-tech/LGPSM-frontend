"use client";

import React from "react";

export interface NotificationCardData {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  timeAgo?: string;
  // Mirrors the backend `isRead` flag (unread === !isRead)
  unread?: boolean;
}

interface NotificationCardProps {
  notification: NotificationCardData;
  onClear?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}

export default function NotificationCard({ notification, onClear, onMarkRead }: NotificationCardProps) {
  const isRsvp = notification.type.toLowerCase().includes("rsvp") || notification.title.toLowerCase().includes("rsvp");
  const isSystem = notification.type.toLowerCase().includes("system") || notification.type.toLowerCase().includes("notice");
  const unread = !!notification.unread;

  // Opening an unread notification marks it as read (like most notification centres)
  const handleOpen = () => {
    if (unread && onMarkRead) onMarkRead(notification.id);
  };

  return (
    <div
      role={unread && onMarkRead ? "button" : undefined}
      tabIndex={unread && onMarkRead ? 0 : undefined}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && unread) {
          e.preventDefault();
          handleOpen();
        }
      }}
      aria-label={unread ? `Unread: ${notification.title}` : undefined}
      className={`relative overflow-hidden rounded-lg border transition-colors duration-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B22]/40 ${
        unread
          ? "bg-orange-50/70 border-orange-200 hover:bg-orange-50 shadow-xs cursor-pointer"
          : "bg-white border-gray-200/80 hover:bg-gray-50/70"
      }`}
    >
      {/* Unread accent bar */}
      {unread && <span aria-hidden className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF5B22]" />}

      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Category Icon (muted once read) */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-opacity ${
            isRsvp ? "bg-emerald-50 text-emerald-600" : isSystem ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-[#FF5B22]"
          } ${unread ? "" : "opacity-60 grayscale"}`}
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
          <div className="flex items-start gap-2 flex-wrap">
            {unread && <span aria-hidden className="mt-1.5 w-2 h-2 rounded-full bg-[#FF5B22] shrink-0" />}
            <h3
              className={`text-sm min-w-0 break-words flex-1 ${unread ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}
            >
              {notification.title}
            </h3>
            <span
              className={`text-[11px] font-medium shrink-0 ${unread ? "text-[#E04B16]" : "text-gray-400"}`}
              title={notification.timestamp}
            >
              {notification.timeAgo || notification.timestamp}
            </span>
          </div>

          <p className={`text-xs leading-relaxed break-words ${unread ? "text-gray-700 font-medium" : "text-gray-500"}`}>
            {notification.message}
          </p>
        </div>
      </div>

      {/* Action Buttons: Mark Read & Clear */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 self-end sm:self-auto">
        {unread && onMarkRead && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(notification.id);
            }}
            className="text-[11px] font-semibold text-[#E04B16] hover:bg-orange-100 px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap"
            title="Mark as read"
          >
            Mark read
          </button>
        )}
        {onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear(notification.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title="Clear notification"
            aria-label="Clear notification"
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

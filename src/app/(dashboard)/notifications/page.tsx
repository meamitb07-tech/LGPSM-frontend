"use client";

import React, { useState, useEffect } from "react";
import NotificationCard, { NotificationCardData } from "@/components/notifications/NotificationCard";
import { useAuth } from "@/context/AuthContext";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import { notificationService, NotificationItem as RealNotification } from "@/services/notificationService";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setErrorFeedback(null);
      const res = await notificationService.getUserNotifications(false, 1, 100);

      if (res.success && Array.isArray(res.data)) {
        const mapped: NotificationCardData[] = res.data.map((n: RealNotification) => {
          let dateStr = "Just now";
          if (n.createdAt) {
            const d = new Date(n.createdAt);
            if (!isNaN(d.getTime())) {
              dateStr = `${d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })} | ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;
            }
          }

          // Format title & message text if generic or missing
          let title = n.title || "System Notification";
          let message = n.message;

          if (!message || message.trim() === "" || message.trim() === "|") {
            if (title.toLowerCase().includes("rsvp")) {
              title = "New RSVP Response";
              message = "An invitee submitted a new RSVP response for your event.";
            } else if (title.toLowerCase().includes("event")) {
              message = "An update occurred regarding your managed event.";
            } else {
              message = "You have a new system alert update.";
            }
          }

          return {
            id: n._id,
            type: n.type || "System Notice",
            title,
            message,
            timestamp: dateStr,
            unread: !n.isRead,
          };
        });

        setNotifications(mapped);
      } else {
        setNotifications([]);
        setErrorFeedback(res.message || "Failed to load notifications.");
      }
    } catch (err: any) {
      console.error("Failed to fetch notifications:", err);
      setErrorFeedback("Failed to load notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (!res.success) {
        setErrorFeedback(res.message || "Failed to mark notifications as read.");
        return;
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (!res.success) {
        setErrorFeedback(res.message || "Failed to mark notification as read.");
        return;
      }
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Real-time clearing single notification endpoint call
  const handleClearSingleNotification = async (id: string) => {
    try {
      // Optimistic update for instant real-time feedback
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      const res = await notificationService.deleteNotification(id);
      if (!res.success) {
        setErrorFeedback(res.message || "Failed to clear notification.");
        fetchNotifications();
      }
    } catch (err: any) {
      console.error("Failed to clear notification:", err);
      setErrorFeedback("Failed to clear notification.");
      fetchNotifications();
    }
  };

  // Real-time clearing all notifications endpoint call
  const handleClearAllNotifications = async () => {
    if (notifications.length === 0) return;
    if (!confirm("Are you sure you want to clear all notifications?")) return;

    try {
      // Optimistic update for instant real-time feedback
      setNotifications([]);
      const res = await notificationService.clearAllNotifications();
      if (!res.success) {
        setErrorFeedback(res.message || "Failed to clear all notifications.");
        fetchNotifications();
      }
    } catch (err: any) {
      console.error("Failed to clear all notifications:", err);
      setErrorFeedback("Failed to clear all notifications.");
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-900 select-none">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF5B22] text-white font-semibold">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-500">System Activity Alerts & Updates</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {notifications.length > 0 && (
            <>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Mark All Read
                </button>
              )}
              <button
                type="button"
                onClick={handleClearAllNotifications}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear All Notifications</span>
              </button>
            </>
          )}
          <UserNavDropdown />
        </div>
      </header>

      {/* Content */}
      <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-4 pb-24">
        {errorFeedback && (
          <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <span>{errorFeedback}</span>
            <button onClick={() => setErrorFeedback(null)} className="font-bold cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-6 h-6 border-2 border-[#FF5B22] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                notification={item}
                onClear={handleClearSingleNotification}
                onMarkRead={handleMarkSingleRead}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 text-xs border border-gray-200 rounded-lg bg-gray-50/50 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="font-medium text-gray-600">No notifications available.</p>
            <p className="text-[11px] text-gray-400">All caught up! You have cleared all your alerts.</p>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventService";
import { assignmentService, AssignmentData } from "@/services/assignmentService";
import { getDynamicEventStatus } from "@/utils/eventUtils";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import CheckInModal from "@/components/common/CheckInModal";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Organizer / Admin metric states
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [activeEvents, setActiveEvents] = useState<number>(0);

  // System User personalized assignments state
  const [myAssignments, setMyAssignments] = useState<AssignmentData[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState<boolean>(true);

  // CheckIn Modal state
  const [checkInModalEvent, setCheckInModalEvent] = useState<{ id: string; title: string } | null>(null);

  const isSystemUser = user?.role === "SYSTEM_USER";

  useEffect(() => {
    if (isSystemUser) {
      // Fetch personal assignments from GET /api/v1/users/me/assignments
      async function fetchMyAssignments() {
        try {
          setLoadingAssignments(true);
          const res = await assignmentService.getMyAssignments();
          if (res?.success && Array.isArray(res.data)) {
            setMyAssignments(res.data);
          } else {
            setMyAssignments([]);
          }
        } catch (err) {
          console.error("Failed to fetch my assignments:", err);
          setMyAssignments([]);
        } finally {
          setLoadingAssignments(false);
        }
      }
      fetchMyAssignments();
    } else {
      // Fetch Organizer / Admin events
      async function fetchDashboardMetrics() {
        try {
          let apiList: any[] = [];
          try {
            const res = await eventService.getEvents();
            if (res?.success && res?.data) {
              apiList = Array.isArray(res.data) ? res.data : (res.data as any).events || [];
            }
          } catch (e) { }

          setTotalEvents(apiList.length);

          const activeCount = apiList.filter((e: any) => {
            const start = e.startDate || e.schedule?.start;
            const end = e.endDate || e.schedule?.end;
            const st = getDynamicEventStatus(start, end, e.status);
            return st === "Upcoming" || st === "Ongoing";
          }).length;

          setActiveEvents(activeCount);
        } catch (e) {
          console.error("Dashboard metric fetch error:", e);
        }
      }
      fetchDashboardMetrics();
    }
  }, [isSystemUser]);

  // If System User, render personalized assignments dashboard
  if (isSystemUser) {
    const totalAssignedSessions = myAssignments.reduce(
      (sum, item) => sum + (item.sessionIds?.length || 0),
      0
    );

    return (
      <div className="w-full min-h-full bg-white text-gray-900 font-sans select-none">
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Assignments</h1>
            <p className="text-xs text-gray-500">System User Operations Portal</p>
          </div>
          <UserNavDropdown />
        </header>

        {/* System User Main Content */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#FF5B22] to-[#ff7b4d] text-white p-6 rounded-xl shadow-md flex items-center justify-between">
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider mb-1">
                System User Portal
              </span>
              <h2 className="text-xl font-bold">Welcome back, {user?.fullName || "Staff Member"}!</h2>
              <p className="text-xs text-white/90 mt-1">
                Here are the event sessions assigned to you for check-in management and operational support.
              </p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF5B22] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{myAssignments.length}</h3>
                <p className="text-xs font-semibold text-gray-500">Assigned Events</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{totalAssignedSessions}</h3>
                <p className="text-xs font-semibold text-gray-500">Assigned Sessions</p>
              </div>
            </div>
          </div>

          {/* Assignments Table Container */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Assigned Event Sessions</h3>

            {loadingAssignments ? (
              <div className="py-12 flex justify-center items-center">
                <div className="w-6 h-6 border-2 border-[#FF5B22] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : myAssignments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold text-[11px]">
                      <th className="py-3 px-4">Event</th>
                      <th className="py-3 px-4">Assigned Sessions</th>
                      <th className="py-3 px-4">Location / Format</th>
                      <th className="py-3 px-4">Assigned By</th>
                      <th className="py-3 px-4">Assignment Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-800">
                    {myAssignments.map((item) => {
                      const eventObj = typeof item.eventId === "object" ? item.eventId : null;
                      const realEvtId = eventObj?._id || (typeof item.eventId === "string" ? item.eventId : "");
                      const eventTitle = eventObj?.title || "Event";
                      const eventLocation = eventObj?.location || eventObj?.format || "Physical";

                      const assignedByObj = typeof item.assignedBy === "object" ? item.assignedBy : null;
                      const assignedByName = assignedByObj?.fullName || assignedByObj?.email || "Organizer";

                      return (
                        <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-4 font-bold text-gray-900">
                            {eventTitle}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1.5 max-w-md">
                              {(item.sessionIds || []).map((s: any, idx: number) => {
                                const sessName = typeof s === "object" ? s.name : `Session ${idx + 1}`;
                                return (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-1 bg-[#FF5B22] text-white text-[10px] font-bold rounded-md uppercase tracking-tight"
                                  >
                                    • {sessName}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600 font-medium">
                            {eventLocation}
                          </td>
                          <td className="py-4 px-4 text-gray-700 font-medium">
                            {assignedByName}
                          </td>
                          <td className="py-4 px-4 text-gray-500 text-[11px]">
                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
                          </td>
                          <td className="py-4 px-4 text-right">
                            {realEvtId && (
                              <button
                                type="button"
                                onClick={() => setCheckInModalEvent({ id: realEvtId, title: eventTitle })}
                                className="px-3 py-1.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
                              >
                                Scan / Check In
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 text-xs">
                No active assignments found for your account. You will be notified when an organizer assigns event sessions to you.
              </div>
            )}
          </div>
        </div>

        {/* Check-In Modal for System Users */}
        {checkInModalEvent && (
          <CheckInModal
            isOpen={!!checkInModalEvent}
            onClose={() => setCheckInModalEvent(null)}
            eventId={checkInModalEvent.id}
            eventName={checkInModalEvent.title}
          />
        )}
      </div>
    );
  }

  // Standard Admin / Organizer Dashboard
  return (
    <div className="w-full min-h-full bg-white text-gray-900 font-sans">
      {/* Top Header Bar */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <UserNavDropdown />
      </header>

      {/* Dashboard Main Content */}
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24">
        {/* Top Section: Single Stats Card Container with dividers (Left) + Revenue Overview Chart (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Metrics Single Card Container with Dividers */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-md divide-y divide-gray-200 shadow-2xs flex flex-col justify-between">
            {/* Row 1: Total Revenue */}
            <div className="p-5 flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-orange-100/70 text-[#FF5B22] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">$0</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Total Revenue</p>
              </div>
            </div>

            {/* Row 2: Total Events */}
            <div className="p-5 flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{totalEvents.toLocaleString()}</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Total Events</p>
              </div>
            </div>

            {/* Row 3: Active Events */}
            <div className="p-5 flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{activeEvents.toLocaleString()}</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Active Events</p>
              </div>
            </div>

            {/* Row 4: Total Organizers */}
            <div className="p-5 flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">0</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Total Organizers</p>
              </div>
            </div>
          </div>

          {/* Right Revenue Overview Chart Card Container */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-md p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Revenue Overview</h3>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-700 font-medium">
                <span>1/1/2026</span>
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400 font-normal mx-1">To</span>
                <span>30/4/2026</span>
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="relative h-64 w-full flex items-center justify-center border-l border-b border-gray-200 pl-8 pb-4 pt-4">
              <p className="text-gray-400 font-medium text-sm">Revenue data coming soon</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Top Organizers Table Card Container */}
        {user?.role === "ADMIN" && (
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Top Organizers</h3>
              <Link
                href="/event-organizer/add"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Organizer</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px]">
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Email</th>
                    <th className="py-3 px-4 font-medium">Phone Number</th>
                    <th className="py-3 px-4 font-medium">Total Events</th>
                    <th className="py-3 px-4 font-medium">Revenue</th>
                    <th className="py-3 px-4 font-medium">Ongoing Events</th>
                    <th className="py-3 px-4 font-medium">Past Events</th>
                    <th className="py-3 px-2 text-right font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500 font-medium">
                      No organizer data available yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

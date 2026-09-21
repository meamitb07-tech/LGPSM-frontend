"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventService";
import { getDynamicEventStatus } from "@/utils/eventUtils";

import UserNavDropdown from "@/components/common/UserNavDropdown";

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [activeEvents, setActiveEvents] = useState<number>(0);

  useEffect(() => {
    async function fetchDashboardMetrics() {
      try {
        let apiList: any[] = [];
        try {
          const res = await eventService.getEvents();
          if (res?.success && res?.data) {
            apiList = Array.isArray(res.data) ? res.data : (res.data as any).events || [];
          }
        } catch (e) { }

        let localEvents: any[] = [];
        try {
          const saved = localStorage.getItem("app_local_events");
          if (saved) localEvents = JSON.parse(saved);
        } catch (e) { }

        const combinedMap = new Map();
        localEvents.forEach((e) => combinedMap.set(e.id, e));
        apiList.forEach((e) => combinedMap.set(e._id || e.id, e));

        const allEvts = Array.from(combinedMap.values());
        setTotalEvents(allEvts.length);

        const activeCount = allEvts.filter((e: any) => {
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
  }, []);

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
            {/* Header with Date Filter */}
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

            {/* Bar Chart Visualization */}
            <div className="relative h-64 w-full flex items-center justify-center border-l border-b border-gray-200 pl-8 pb-4 pt-4">
              <p className="text-gray-400 font-medium text-sm">Revenue data coming soon</p>
            </div>
          </div>

        </div>

        {/* Bottom Section: Top Organizers Table Card Container */}
        <div className="bg-white border border-gray-200 rounded-md p-6 shadow-2xs space-y-4">
          {/* Header */}
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

          {/* Table */}
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
      </div>
    </div>
  );
}

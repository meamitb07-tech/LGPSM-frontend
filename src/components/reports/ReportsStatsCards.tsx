"use client";

import React from "react";

interface ReportsStatsCardsProps {
  totalInvitees?: number;
  totalAttendees?: number;
  totalSessions?: number;
  systemUsers?: number;
}

export default function ReportsStatsCards({
  totalInvitees = 0,
  totalAttendees = 0,
  totalSessions = 0,
  systemUsers = 0,
}: ReportsStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Total Invitees */}
      <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-orange-100/70 text-[#FF5B22] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{totalInvitees}</h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Total Invitees</p>
        </div>
      </div>

      {/* Card 2: Total Attendees */}
      <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{totalAttendees}</h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Total Attendees</p>
        </div>
      </div>

      {/* Card 3: Total Sessions */}
      <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{String(totalSessions).padStart(2, "0")}</h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">Total Sessions</p>
        </div>
      </div>

      {/* Card 4: System Users */}
      <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{systemUsers}</h3>
          <p className="text-xs font-medium text-gray-500 mt-0.5">System Users</p>
        </div>
      </div>
    </div>
  );
}

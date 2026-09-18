"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function EventDetailsDashboardPage() {
  const params = useParams();
  const eventId = (params?.id as string) || "1";
  const { user } = useAuth();

  const [eventStatus, setEventStatus] = useState<"Invitation not send" | "Upcoming" | "Ongoing">("Ongoing");
  const [selectedSessionFilter, setSelectedSessionFilter] = useState("Entry Session");

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeItem="events-list" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold text-gray-900">Event</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-800">Super Admin</span>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Bar: Title, Category Pill, Status Badge & Edit Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-900">Event Name Goes Here</h2>
                <span className="px-2.5 py-0.5 border border-[#FF5B22] text-[#FF5B22] text-[11px] font-medium rounded-md bg-[#FF5B22]/5">
                  Personal Event
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 font-normal flex-wrap">
                {eventStatus === "Invitation not send" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-700">
                    Invitation not send
                  </span>
                )}
                {eventStatus === "Upcoming" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                    Upcoming
                  </span>
                )}
                {eventStatus === "Ongoing" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                    Ongoing
                  </span>
                )}
                <span className="text-gray-600 font-medium">Organized by: <span className="font-semibold text-gray-800">Jonh H. Wilford</span></span>
                <span className="text-gray-300">|</span>
                <span><span className="font-semibold text-gray-700">Start:</span> 5/1/2026. 10.00 am</span>
                <span className="text-gray-300">|</span>
                <span><span className="font-semibold text-gray-700">End:</span> 5/1/2026. 4.30 pm</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Demo Status Switcher */}
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value as any)}
                className="px-2 py-1.5 border border-gray-200 rounded-md text-xs text-gray-700 bg-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="Ongoing">Status: Ongoing</option>
                <option value="Upcoming">Status: Upcoming</option>
                <option value="Invitation not send">Status: Invitation not send</option>
              </select>

              {/* Edit Button matching Images 2, 3, 4 */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Left Metric & Log Section (8 cols), Right Poster Card (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns */}
            <div className="lg:col-span-8 space-y-6">
              {/* 3 Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Total Invitees */}
                <Link
                  href={`/events/${eventId}/invitees`}
                  className="bg-white border border-gray-200 rounded-md p-5 relative shadow-2xs hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF5B22]/10 text-[#FF5B22] flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    {/* North-East Arrow ↗ */}
                    <svg className="w-4 h-4 text-gray-800 group-hover:text-[#FF5B22] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">275</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Total Invitees</p>
                </Link>

                {/* 2. Total System Users */}
                <Link
                  href={`/events/${eventId}/assign-users`}
                  className="bg-white border border-gray-200 rounded-md p-5 relative shadow-2xs hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    {/* North-East Arrow ↗ */}
                    <svg className="w-4 h-4 text-gray-800 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {eventStatus === "Invitation not send" ? "0" : "05"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Assigned System Users</p>
                </Link>

                {/* 3. Total Sessions */}
                <Link
                  href={`/events/${eventId}/sessions`}
                  className="bg-white border border-gray-200 rounded-md p-5 relative shadow-2xs hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {/* North-East Arrow ↗ */}
                    <svg className="w-4 h-4 text-gray-800 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">03</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Total Sessions</p>
                </Link>
              </div>

              {/* Middle Section: Guest Logs & Sessions Table */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                {/* Guest Logs Donut Chart (5 cols) */}
                <div className="sm:col-span-5 bg-white border border-gray-200 rounded-md p-5 shadow-2xs flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-gray-900">Guest Logs</h3>
                    <svg className="w-4 h-4 text-gray-800 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                    </svg>
                  </div>

                  {/* Donut graphic & Legend */}
                  <div className="flex items-center justify-between gap-2 py-3 px-2">
                    {/* SVG Donut Chart Container */}
                    <div className="relative w-36 h-36 shrink-0 flex items-center justify-center p-3">
                      <svg viewBox="0 0 44 44" className="w-28 h-28 transform -rotate-90 overflow-visible">
                        <path
                          className="text-gray-100"
                          strokeWidth="5"
                          stroke="currentColor"
                          fill="none"
                          d="M22 6.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#FF5B22]"
                          strokeWidth="5.5"
                          strokeDasharray="65, 100"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M22 6.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-gray-800"
                          strokeWidth="5.5"
                          strokeDasharray="20, 100"
                          strokeDashoffset="-65"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M22 6.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-gray-300"
                          strokeWidth="5.5"
                          strokeDasharray="15, 100"
                          strokeDashoffset="-85"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M22 6.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>

                      {/* Floating Percentage Badges */}
                      <span className="absolute top-1 left-2 bg-white border border-gray-200 text-[9px] font-bold text-gray-700 px-1.5 py-0.5 rounded-full shadow-2xs z-10">
                        15%
                      </span>
                      <span className="absolute top-6 right-0 bg-white border border-gray-200 text-[9px] font-bold text-gray-800 px-1.5 py-0.5 rounded-full shadow-2xs z-10">
                        20%
                      </span>
                      <span className="absolute bottom-2 left-2 bg-white border border-gray-200 text-[9px] font-bold text-[#FF5B22] px-1.5 py-0.5 rounded-full shadow-2xs z-10">
                        65%
                      </span>
                    </div>

                    {/* Legend */}
                    <div className="space-y-3 text-xs shrink-0 pl-1">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B22] shrink-0" />
                        <span className="text-gray-700 font-medium">Sent</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-900 shrink-0" />
                        <span className="text-gray-700 font-medium">Received</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" />
                        <span className="text-gray-700 font-medium">Failed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sessions Table Card (7 cols) */}
                <div className="sm:col-span-7 bg-white border border-gray-200 rounded-md p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-900">Sessions</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 font-medium text-[11px]">
                          <th className="py-2 pr-4 font-medium">#</th>
                          <th className="py-2 pr-6 font-medium">Session Name</th>
                          <th className="py-2 pr-6 font-medium">Date & Time</th>
                          <th className="py-2 text-right font-medium pr-6">No. of Guests</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-800">
                        <tr>
                          <td className="py-3 pr-4 font-bold text-gray-900">1</td>
                          <td className="py-3 pr-6 font-semibold text-gray-900">Entry Session</td>
                          <td className="py-3 pr-6 text-gray-600">5/1/2026 10:00 AM</td>
                          <td className="py-3 text-right text-gray-900 font-semibold pr-6">510</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-bold text-gray-900">2</td>
                          <td className="py-3 pr-6 font-semibold text-gray-900">Lunch Session</td>
                          <td className="py-3 pr-6 text-gray-600">5/1/2026 10:00 AM to 03:00 PM</td>
                          <td className="py-3 text-right text-gray-900 font-semibold pr-6">400</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns - Card Preview */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-md p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-900">Card Preview</h3>
                  <svg className="w-4 h-4 text-gray-800 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>

                {/* Card Poster Container */}
                <div className="bg-[#FFF5F2] border border-orange-100 rounded-md p-3 flex flex-col items-center justify-center text-center">
                  <div className="w-full h-80 rounded-md overflow-hidden relative shadow-xs bg-amber-900/10 flex items-center justify-center">
                    {/* Placeholder Wedding Invitation Poster matching design */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B1E24] to-[#5C1116] p-4 text-amber-200 flex flex-col justify-between items-center text-center">
                      <div className="text-xl tracking-widest text-amber-300 mt-2">卐</div>
                      <div>
                        <p className="text-[10px] tracking-widest text-amber-200 uppercase">Family Name</p>
                        <h4 className="font-serif text-lg text-amber-300 mt-1">Groom & Bride</h4>
                        <p className="text-[9px] text-amber-200/80 mt-1">WEDDING</p>
                        <p className="text-[8px] text-amber-200/60">Wednesday, 11th May 2026 | 9:00 am onwards</p>
                      </div>
                      <div className="text-[8px] text-amber-200/70 border-t border-amber-300/30 pt-2 w-full">
                        Hotel Name, Address Here
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Send Invitation Button */}
              <button
                type="button"
                className="w-full mt-4 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-semibold text-xs rounded-md transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send Invitation</span>
              </button>
            </div>
          </div>

          {/* Analysis Section Card */}
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Analysis</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Session:</span>
                <select
                  value={selectedSessionFilter}
                  onChange={(e) => setSelectedSessionFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-700 bg-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="Entry Session">Entry Session</option>
                  <option value="Lunch Session">Lunch Session</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Session Health Overview Panel (5 cols) */}
              <div className="lg:col-span-5 border border-gray-100 rounded-md p-5 bg-white space-y-4">
                <h4 className="text-xs font-semibold text-gray-800">Session Health Overview Panel</h4>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  {/* Gauge 1 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="24" stroke="#F3F4F6" strokeWidth="5" fill="none" />
                        <circle
                          cx="32"
                          cy="32"
                          r="24"
                          stroke="#FF5B22"
                          strokeWidth="5.5"
                          fill="none"
                          strokeDasharray="150"
                          strokeDashoffset={eventStatus === "Ongoing" ? "75" : "150"}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-gray-800">
                        {eventStatus === "Ongoing" ? "275/510" : "0/275"}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 mt-2">Current Logged</span>
                  </div>

                  {/* Gauge 2 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="24" stroke="#F3F4F6" strokeWidth="5" fill="none" />
                        <circle
                          cx="32"
                          cy="32"
                          r="24"
                          stroke="#F59E0B"
                          strokeWidth="5.5"
                          fill="none"
                          strokeDasharray="150"
                          strokeDashoffset={eventStatus === "Ongoing" ? "60" : "150"}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-bold text-gray-800">
                        {eventStatus === "Ongoing" ? "320" : "0"}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 mt-2">Check-ins Today</span>
                  </div>

                  {/* Gauge 3 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="24" stroke="#F3F4F6" strokeWidth="5" fill="none" />
                        <circle
                          cx="32"
                          cy="32"
                          r="24"
                          stroke="#10B981"
                          strokeWidth="5.5"
                          fill="none"
                          strokeDasharray="150"
                          strokeDashoffset={eventStatus === "Ongoing" ? "48" : "150"}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-bold text-gray-800">
                        {eventStatus === "Ongoing" ? "68%" : "0%"}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 mt-2">Occupancy</span>
                  </div>
                </div>
              </div>

              {/* Access Logs (7 cols) */}
              <div className="lg:col-span-7 border border-gray-100 rounded-md p-5 bg-white space-y-4">
                <h4 className="text-xs font-semibold text-gray-800">Access Logs</h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 font-medium text-[11px]">
                        <th className="py-2 px-3 font-medium">User Type</th>
                        <th className="py-2 px-3 font-medium">Date & Time</th>
                        <th className="py-2 px-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                      {eventStatus === "Ongoing" ? (
                        <>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-gray-900">Admin</td>
                            <td className="py-3 px-3 text-gray-600">5/1/2026 10:03 AM</td>
                            <td className="py-3 px-3 text-gray-800 font-medium">Invitation Send</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-semibold text-gray-900">Super Admin</td>
                            <td className="py-3 px-3 text-gray-600">2/1/2026 10:12 AM</td>
                            <td className="py-3 px-3 text-gray-800 font-medium">Access control update for session</td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-gray-400 text-xs">
                            No access logs available for this session yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPopup, setShowPopup] = useState(false);

  // Automatically trigger the popup modal after 2 seconds of dashboard load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F4F5F8] font-sans text-gray-800">
      
      {/* ── Left Sidebar (Dark Slate / Black Theme matching design) ── */}
      <aside className="w-64 bg-[#14161A] text-gray-300 flex flex-col justify-between shrink-0 hidden md:flex min-h-screen p-4">
        <div className="space-y-5">
          {/* Logo Header - Larger size matching design */}
          <div className="px-2 pt-2 pb-2">
            <Link href="/" className="inline-block">
              <Image
                src="/Nav_logo.png"
                alt="LGPSM Logo"
                width={180}
                height={66}
                className="h-17 w-auto object-contain brightness-110"
              />
            </Link>
          </div>

          {/* + Add Event Button */}
            <button
              onClick={() => setShowPopup(true)}
              className="w-full py-2.5 px-4 bg-[#282B33] hover:bg-[#323640] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Event</span>
            </button>
          

          {/* Main Navigation Menu */}
          <nav className="space-y-1 text-xs font-medium pt-1">
            {/* Dashboard (Active State - matching spelling "Dashbaord") */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#282B33] text-white font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Dashbaord</span>
              </div>
            </button>

            {/* Configurations */}
            <div className="flex items-center justify-between px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-md transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Configurations</span>
              </div>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* User Management */}
            <div className="flex items-center justify-between px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-md transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>User Management</span>
              </div>
            </div>

            {/* Billing */}
            <div className="flex items-center justify-between px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-md transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Billing</span>
              </div>
            </div>

            {/* Reports */}
            <div className="flex items-center justify-between px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-md transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Reports</span>
              </div>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Settings */}
            <div className="flex items-center justify-between px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-md transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                <span>Settings</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Sidebar Options */}
        <div className="pt-4 border-t border-gray-800/80 space-y-1 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-3 px-3 py-2 hover:text-white cursor-pointer transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Notification</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 hover:text-white cursor-pointer transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help</span>
          </div>
        </div>
      </aside>

      {/* ── Main Dashboard Body ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Dashboard</h1>
          
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#4A4E57] flex items-center justify-center text-white text-xs shadow-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-900">Jane Doe</span>
            <svg className="w-3.5 h-3.5 text-gray-500 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </header>

        {/* Grid Content Container matching 4-column exact layout */}
        <main className="p-5 sm:p-6 lg:p-8 flex-1 w-full max-w-[1500px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* ── CARD 1: Total Events ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs flex flex-col justify-between relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#FF5B22] shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-xs font-bold text-[#FF5B22] underline underline-offset-2 hover:opacity-80 cursor-pointer"
                  >
                    Create Events
                  </button>
                </div>
                {/* Long diagonal SVG top-right arrow matching design */}
                <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                </svg>
              </div>

              <div className="mt-5">
                <div className="text-[11px] text-gray-500 font-medium">
                  Last Event Created: <span className="text-[#FF5B22] font-bold">12 Mar 2026</span>
                </div>
                <div className="text-3xl sm:text-4xl font-medium text-gray-900 mt-2 tracking-tight">510</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Total Events</div>
              </div>
            </div>

            {/* ── CARD 2: Total Invitations Send ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs flex flex-col justify-between relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6F9F3] flex items-center justify-center text-emerald-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-xs font-bold text-emerald-500 underline underline-offset-2 hover:opacity-80 cursor-pointer"
                  >
                    Add Invitees
                  </button>
                </div>
                {/* Long diagonal SVG top-right arrow matching design */}
                <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                </svg>
              </div>

              <div className="mt-5">
                <div className="text-[11px] text-gray-500 font-medium">
                  Accepted: <span className="text-emerald-500 font-bold">215</span> | Pending: <span className="text-[#FF5B22] font-bold">30</span>
                </div>
                <div className="text-3xl sm:text-4xl font-medium text-gray-900 mt-2 tracking-tight">2045</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Total Invitations Send</div>
              </div>
            </div>

            {/* ── CARD 3: Total Payments ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs flex flex-col justify-between relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EBF3FF] flex items-center justify-center text-blue-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-xs font-bold text-blue-500 underline underline-offset-2 hover:opacity-80 cursor-pointer"
                    >
                    Payments
                  </button>
                </div>
                {/* Long diagonal SVG top-right arrow matching design */}
                <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                </svg>
              </div>

              <div className="mt-5">
                <div className="text-[11px] text-gray-500 font-medium">
                  Last Payment: <span className="text-blue-600 font-bold">₹10,000</span> | Status: <span className="text-emerald-500 font-bold">Successful</span>
                </div>
                <div className="text-3xl sm:text-4xl font-medium text-gray-900 mt-2 tracking-tight">470</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Total Payments</div>
              </div>
            </div>

            {/* ── CARD 4: Upcoming Events (04) - Spans col 4 across both rows ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs lg:row-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900">Upcoming Events (04)</h3>
                  {/* Long diagonal SVG top-right arrow matching design */}
                  <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </div>

                <div className="space-y-3.5">
                  {/* Event 1 */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-11 h-11 rounded-md bg-[#FFEBE8] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <Image
                        src="/Auth.png"
                        alt="Event Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 line-clamp-1">Annual Business Meetup</div>
                      <div className="text-[11px] text-gray-400 mt-0.5"><span className="font-semibold">Start:</span> 18 Mar 2026</div>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-11 h-11 rounded-md bg-[#FFEBE8] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <Image
                        src="/Auth.png"
                        alt="Event Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 line-clamp-1">Product Launch Event 2026</div>
                      <div className="text-[11px] text-gray-400 mt-0.5"><span className="font-semibold">Start:</span> 22 Mar 2026</div>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-11 h-11 rounded-md bg-[#FFEBE8] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <Image
                        src="/Auth.png"
                        alt="Event Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 line-clamp-1">Team Networking Event</div>
                      <div className="text-[11px] text-gray-400 mt-0.5"><span className="font-semibold">Start:</span> 30 Mar 2026</div>
                    </div>
                  </div>

                  {/* Event 4 */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-md bg-[#FFEBE8] flex items-center justify-center shrink-0 overflow-hidden relative">
                      <Image
                        src="/Auth.png"
                        alt="Event Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 line-clamp-1">Team Networking Event</div>
                      <div className="text-[11px] text-gray-400 mt-0.5"><span className="font-semibold">Start:</span> 30 Mar 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ROW 2: Invitees vs Attendees (Spans cols 1 & 2) ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-3">
                  Invitees vs Attendees (Latest 5)
                </h3>

                {/* Real working horizontal scrollbar container */}
                <div className="overflow-x-auto custom-scrollbar pb-2 relative">
                  <table className="w-full text-left border-collapse min-w-[560px]">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] text-gray-400 font-medium">
                        <th className="py-2 px-2 font-normal w-12">#</th>
                        <th className="py-2 px-2 font-normal min-w-[140px]">Event</th>
                        <th className="py-2 px-2 font-normal min-w-[240px]">Date & Time</th>
                        <th className="py-2 px-2 text-right font-normal min-w-[100px]">No. of Guests</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-gray-800 font-medium divide-y divide-gray-50">
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">1</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Business Meetup</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/1/2026 10:00 AM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">510</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">2</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Product Launch</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/1/2026 10:00 AM to 03:00 PM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">400</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">3</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Annual General Meeting</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/2/2026 11:30 AM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">350</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">4</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Executive Workshop</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/3/2026 02:00 PM to 05:00 PM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">280</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-gray-400 font-normal">5</td>
                        <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">Tech Summit 2026</td>
                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">5/5/2026 09:00 AM to 06:00 PM</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 whitespace-nowrap">620</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── ROW 2: Notifications (Spans col 3) ── */}
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-xs flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900">Notifications</h3>
                  {/* Long diagonal SVG top-right arrow matching design */}
                  <svg className="w-4 h-4 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </div>

                {/* Real working vertical scrollbar container filling full card height */}
                <div className="space-y-3.5 pr-2 max-h-[240px] overflow-y-auto custom-scrollbar">
                  <div className="border-b border-gray-100 pb-3">
                    <div className="text-xs font-medium text-gray-900">QR codes generated successfully</div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do...
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      Mar 04, 2026 | 19:45
                    </div>
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <div className="text-xs font-medium text-gray-900">Payment Success</div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      Mar 04, 2026 | 18:30
                    </div>
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <div className="text-xs font-medium text-gray-900">New Invitee Accepted</div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      John Doe accepted your invitation to Business Meetup.
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      Mar 04, 2026 | 16:15
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-900">Event Published</div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      Product Launch Event 2026 has been published.
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      Mar 03, 2026 | 11:20
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* ── CREATE AN EVENT POPUP MODAL (Exact design with orange vector outline icons) ── */}
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Left Content Side */}
            <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-8">
                Create an event
              </h2>

              <ul className="space-y-5 text-xs sm:text-sm font-semibold text-gray-800">
                {/* 1. Create an event */}
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Create an event</span>
                </li>

                {/* 2. Add invitees to your events */}
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Add invitees to your events</span>
                </li>

                {/* 3. Make payment for your invitees */}
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Make payment for your invitees</span>
                </li>

                {/* 4. Select invitation QR Card design */}
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Select invitation QR Card design</span>
                </li>

                {/* 5. Send QR Invitations */}
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Send QR Invitations</span>
                </li>

                {/* 6. View Reports */}
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View Reports</span>
                </li>
              </ul>
            </div>

            {/* Right Image Side with Close X Button */}
            <div className="w-full md:w-1/2 relative min-h-[320px] md:min-h-[420px] bg-gray-900">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 z-20 text-white/90 hover:text-white transition-all cursor-pointer p-1"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <Image
                src="/Dashboard_Popup.png"
                alt="Scanning QR code popup"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

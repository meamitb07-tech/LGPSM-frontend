"use client";

import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F5F8] text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeItem="dashboard" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F4F5F8]">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-800">Super Admin</span>
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Section: Metrics (Left 4-cards grid) + Revenue Overview Chart (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Metrics Column (4 stacked cards) */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              
              {/* Card 1: Total Revenue */}
              <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100/70 text-[#FF5B22] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">$4,285,900</h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Total Revenue</p>
                </div>
              </div>

              {/* Card 2: Total Events */}
              <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">5,510</h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Total Events</p>
                </div>
              </div>

              {/* Card 3: Active Events */}
              <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">842</h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Active Events</p>
                </div>
              </div>

              {/* Card 4: Total Organizers */}
              <div className="bg-white border border-gray-200 rounded-md p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">1,240</h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Total Organizers</p>
                </div>
              </div>

            </div>

            {/* Right Revenue Overview Chart Card */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-md p-6 shadow-2xs flex flex-col justify-between">
              {/* Header with Date Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Revenue Overview</h3>
                <div className="flex items-center gap-2 bg-[#F8F9FA] border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-700 font-medium">
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
              <div className="relative h-64 w-full flex items-end justify-around border-l border-b border-gray-200 pl-8 pb-4 pt-4">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[10px] font-semibold text-gray-400">
                  <span>10000000</span>
                  <span>1000000</span>
                  <span>100000</span>
                  <span>10000</span>
                  <span>1000</span>
                  <span>100</span>
                </div>

                {/* Bars */}
                <div className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-12 bg-[#FF5B22] rounded-t-xs h-[85%] transition-all group-hover:brightness-110" />
                  <span className="text-[10px] font-bold text-gray-700">JAN 2026</span>
                </div>

                <div className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-12 bg-[#FF5B22] rounded-t-xs h-[40%] transition-all group-hover:brightness-110" />
                  <span className="text-[10px] font-bold text-gray-700">FEB 2026</span>
                </div>

                <div className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-12 bg-[#FF5B22] rounded-t-xs h-[65%] transition-all group-hover:brightness-110" />
                  <span className="text-[10px] font-bold text-gray-700">MAR 2026</span>
                </div>

                <div className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-12 bg-[#FF5B22]/20 rounded-t-xs h-[10%] transition-all" />
                  <span className="text-[10px] font-bold text-gray-700">APR 2026</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Top Organizers Table Card */}
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-2xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Top Organizers</h3>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Organizer</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-medium text-[11px]">
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
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">JK Event Organiz..</td>
                    <td className="py-4 px-4 text-gray-600">tanya.hill@example.com</td>
                    <td className="py-4 px-4 text-gray-600">9674259986</td>
                    <td className="py-4 px-4 font-medium text-gray-900">32</td>
                    <td className="py-4 px-4 font-bold text-gray-900">$1,450</td>
                    <td className="py-4 px-4 text-gray-600">02</td>
                    <td className="py-4 px-4 text-gray-600">30</td>
                    <td className="py-4 px-2 text-right">
                      <svg className="w-4 h-4 text-[#FF5B22] inline-block cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                      </svg>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">Anjali Groups & S..</td>
                    <td className="py-4 px-4 text-gray-600">willie.jennings@example.com</td>
                    <td className="py-4 px-4 text-gray-600">(671) 555-0110</td>
                    <td className="py-4 px-4 font-medium text-gray-900">100</td>
                    <td className="py-4 px-4 font-bold text-gray-900">$3,7638</td>
                    <td className="py-4 px-4 text-gray-600">12</td>
                    <td className="py-4 px-4 text-gray-600">88</td>
                    <td className="py-4 px-2 text-right">
                      <svg className="w-4 h-4 text-[#FF5B22] inline-block cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                      </svg>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">Navkrit Brand Sol..</td>
                    <td className="py-4 px-4 text-gray-600">bill.sanders@example.com</td>
                    <td className="py-4 px-4 text-gray-600">(316) 555-0116</td>
                    <td className="py-4 px-4 font-medium text-gray-900">2</td>
                    <td className="py-4 px-4 font-bold text-gray-900">$1,455</td>
                    <td className="py-4 px-4 text-gray-600">2</td>
                    <td className="py-4 px-4 text-gray-600">0</td>
                    <td className="py-4 px-2 text-right">
                      <svg className="w-4 h-4 text-[#FF5B22] inline-block cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                      </svg>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">Iconic Event Plan..</td>
                    <td className="py-4 px-4 text-gray-600">tim.jennings@example.com</td>
                    <td className="py-4 px-4 text-gray-600">(219) 555-0114</td>
                    <td className="py-4 px-4 font-medium text-gray-900">5</td>
                    <td className="py-4 px-4 font-bold text-gray-900">$2,681</td>
                    <td className="py-4 px-4 text-gray-600">0</td>
                    <td className="py-4 px-4 text-gray-600">5</td>
                    <td className="py-4 px-2 text-right">
                      <svg className="w-4 h-4 text-[#FF5B22] inline-block cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H9M17 7V15" />
                      </svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

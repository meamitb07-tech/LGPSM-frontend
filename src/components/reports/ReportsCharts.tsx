"use client";

import React from "react";

export default function ReportsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Donut Chart Card: Guest Logs */}
      <div className="lg:col-span-4 bg-white border border-gray-200/80 rounded-md p-6 shadow-xs relative space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Guest Logs</h3>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B22] inline-block" />
            <span>Sent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D3139] inline-block" />
            <span>Received</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
            <span>Failed</span>
          </div>
        </div>

        {/* Perfect Seamless SVG Donut Chart */}
        <div className="relative w-52 h-52 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
            {/* Sent Arc: 65% (Orange/Red) */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="none"
              stroke="#FF5B22"
              strokeWidth="5"
              strokeDasharray="65 35"
              strokeDashoffset="0"
            />
            {/* Received Arc: 20% (Dark Gray) */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="none"
              stroke="#2D3139"
              strokeWidth="5"
              strokeDasharray="20 80"
              strokeDashoffset="-65"
            />
            {/* Failed Arc: 15% (Light Gray) */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="5"
              strokeDasharray="15 85"
              strokeDashoffset="-85"
            />
          </svg>

          {/* Percentage Labels */}
          <span className="absolute top-10 left-5 bg-white border border-gray-100 shadow-xs px-2 py-0.5 rounded text-[11px] font-bold text-gray-800">
            15%
          </span>
          <span className="absolute top-12 right-4 bg-white border border-gray-100 shadow-xs px-2 py-0.5 rounded text-[11px] font-bold text-gray-800">
            20%
          </span>
          <span className="absolute bottom-10 left-10 bg-white border border-gray-100 shadow-xs px-2 py-0.5 rounded text-[11px] font-bold text-gray-800">
            65%
          </span>
        </div>
      </div>

      {/* Right Bar Chart Card: Invited vs. Attendees */}
      <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-md p-6 shadow-xs relative space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Invited vs. Attendees</h3>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center gap-4 text-[11px] font-medium text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B22] inline-block" />
            <span>Invitees</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2D3139] inline-block" />
            <span>Attendees</span>
          </div>
        </div>

        {/* Grouped Bar Chart */}
        <div className="relative h-64 w-full pt-4 pb-2 border-l border-b border-gray-200 pl-8 flex items-end justify-around">
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 font-medium">
            <span>550</span>
            <span>450</span>
            <span>350</span>
            <span>250</span>
            <span>150</span>
            <span>0</span>
          </div>

          <span className="absolute -left-7 top-1/2 -rotate-90 -translate-y-1/2 text-[10px] font-semibold text-gray-500 tracking-tight">
            Head Count
          </span>

          <div className="absolute inset-x-0 top-4 bottom-6 flex flex-col justify-between pointer-events-none -z-0">
            <div className="border-b border-gray-100 w-full" />
            <div className="border-b border-gray-100 w-full" />
            <div className="border-b border-gray-100 w-full" />
            <div className="border-b border-gray-100 w-full" />
            <div className="border-b border-gray-100 w-full" />
          </div>

          <div className="flex flex-col items-center gap-2 z-10">
            <div className="flex items-end gap-1.5 h-48">
              <div className="w-8 bg-[#FF5B22] rounded-t-xs h-[88%]" title="Invitees: 510" />
              <div className="w-8 bg-[#2D3139] rounded-t-xs h-[78%]" title="Attendees: 436" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Session 1</span>
          </div>

          <div className="flex flex-col items-center gap-2 z-10 border-l border-gray-200 pl-8">
            <div className="flex items-end gap-1.5 h-48">
              <div className="w-8 bg-[#FF5B22] rounded-t-xs h-[88%]" title="Invitees: 510" />
              <div className="w-8 bg-[#2D3139] rounded-t-xs h-[78%]" title="Attendees: 436" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Session 2</span>
          </div>

          <div className="flex flex-col items-center gap-2 z-10 border-l border-gray-200 pl-8">
            <div className="flex items-end gap-1.5 h-48">
              <div className="w-8 bg-[#FF5B22] rounded-t-xs h-[60%]" title="Invitees: 350" />
              <div className="w-8 bg-[#2D3139] rounded-t-xs h-[52%]" title="Attendees: 310" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Session 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

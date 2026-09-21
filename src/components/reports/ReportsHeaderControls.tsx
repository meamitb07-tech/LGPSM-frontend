"use client";

import React from "react";
import CustomDropdown from "@/components/common/CustomDropdown";

interface ReportsHeaderControlsProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedOrganizer: string;
  setSelectedOrganizer: (val: string) => void;
  selectedEvent: string;
  setSelectedEvent: (val: string) => void;
  onDownloadReport: () => void;
  organizerOptions?: { value: string; label: string }[];
  eventOptions?: { value: string; label: string }[];
}

export default function ReportsHeaderControls({
  searchQuery,
  setSearchQuery,
  selectedOrganizer,
  setSelectedOrganizer,
  selectedEvent,
  setSelectedEvent,
  onDownloadReport,
  organizerOptions = [
    { value: "", label: "All Organizers" },
  ],
  eventOptions = [
    { value: "", label: "Select Event" },
  ],
}: ReportsHeaderControlsProps) {

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4 flex-1">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200/90 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] transition-colors"
          />
        </div>

        {/* Organizer Dropdown */}
        <div className="min-w-[200px]">
          <CustomDropdown
            value={selectedOrganizer}
            onChange={setSelectedOrganizer}
            options={organizerOptions}
            placeholder="Organizer name here"
          />
        </div>

        {/* Event Dropdown */}
        <div className="min-w-[220px]">
          <CustomDropdown
            value={selectedEvent}
            onChange={setSelectedEvent}
            options={eventOptions}
            placeholder="Select event"
          />
        </div>
      </div>

      {/* Download Report Button */}
      <button
        type="button"
        onClick={onDownloadReport}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF5B22] hover:text-[#E04B16] cursor-pointer shrink-0"
      >
        <svg className="w-4 h-4 text-[#FF5B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Download Report</span>
      </button>
    </div>
  );
}

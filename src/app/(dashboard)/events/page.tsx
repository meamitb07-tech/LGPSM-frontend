"use client";

import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

interface EventRow {
  id: string;
  eventId: string;
  eventName: string;
  organizer: string;
  createdOn: string;
  category: string;
  startDate: string;
  endDate: string;
  status: "Upcoming" | "Completed" | "Ongoing" | "Invitation Sent";
}

const SAMPLE_EVENTS: EventRow[] = [
  { id: "1", eventId: "#1751", eventName: "Product Launch 2026", organizer: "Moloy Roy", createdOn: "25/12/25 11:00 AM", category: "Corporate", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Upcoming" },
  { id: "2", eventId: "#1851", eventName: "Moloy's Birthday Event", organizer: "Wade Warren", createdOn: "22/11/25 10:00 AM", category: "Personal", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Completed" },
  { id: "3", eventId: "#1951", eventName: "Souvik & Titli Wedding Party", organizer: "Guy Hawkins", createdOn: "25/12/25 11:00 PM", category: "Personal", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Upcoming" },
  { id: "4", eventId: "#1651", eventName: "Grand Anniversary", organizer: "Super Admin", createdOn: "28/11/25 10:00 AM", category: "Corporate", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Ongoing" },
  { id: "5", eventId: "#1451", eventName: "TCL Corporate AGM Event", organizer: "Albert Flores", createdOn: "28/11/25 10:00 AM", category: "Corporate", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Upcoming" },
  { id: "6", eventId: "#1351", eventName: "iPhone 17 Launch 2026", organizer: "Eleanor Pena", createdOn: "25/12/25 11:00 PM", category: "Corporate", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Upcoming" },
  { id: "7", eventId: "#1151", eventName: "Chanchal Birthday Party", organizer: "Edgar Elan pou", createdOn: "28/11/25 10:00 PM", category: "Personal", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Invitation Sent" },
  { id: "8", eventId: "#1051", eventName: "Castrol Carnival Event, 26", organizer: "Alexander Dumans", createdOn: "28/11/25 10:00 AM", category: "Corporate", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Completed" },
  { id: "9", eventId: "#1885", eventName: "Eid Mubarak 2026", organizer: "Arthur Conan Douel", createdOn: "28/11/25 10:00 PM", category: "Social", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Completed" },
  { id: "10", eventId: "#3551", eventName: "Adu's Rice Ceremony", organizer: "Eleanor Pena", createdOn: "25/12/25 11:00 PM", category: "Personal", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Ongoing" },
  { id: "11", eventId: "#5751", eventName: "Business Summit 2026", organizer: "Super Admin", createdOn: "28/11/25 10:00 AM", category: "Corporate", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Ongoing" },
  { id: "12", eventId: "#6751", eventName: "ABP Mega Mancha", organizer: "Eleanor Pena", createdOn: "28/11/25 05:00 PM", category: "Corporate", startDate: "05/01/26 10:00 AM", endDate: "05/01/26 04:30 PM", status: "Ongoing" },
];

export default function EventListingPage() {
  const { user } = useAuth();
  const [events] = useState<EventRow[]>(SAMPLE_EVENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter Form State
  const [filterEventName, setFilterEventName] = useState("");
  const [filterOrganizer, setFilterOrganizer] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSessions, setFilterSessions] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.eventId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesName = filterEventName
      ? ev.eventName.toLowerCase().includes(filterEventName.toLowerCase())
      : true;
    const matchesOrg = filterOrganizer
      ? ev.organizer.toLowerCase().includes(filterOrganizer.toLowerCase())
      : true;
    const matchesCat = filterCategory ? ev.category === filterCategory : true;
    const matchesStatus = filterStatus ? ev.status === filterStatus : true;

    return matchesSearch && matchesName && matchesOrg && matchesCat && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeItem="events-list" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header Bar */}
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
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white">
          {/* Controls Bar: Search label + Search Input + Grey Funnel Filter + Add Event Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Input inline */}
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <span className="text-xs font-semibold text-gray-700 shrink-0">Search</span>

              <div className="relative flex-1">
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
                  placeholder="Search event.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
                />
              </div>

              {/* Grey Funnel Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="p-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 text-gray-500 cursor-pointer shrink-0 transition-colors"
                title="Filter Events"
              >
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                </svg>
              </button>
            </div>

            {/* + Add Event Button on Right */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/events/add"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Event</span>
              </Link>
            </div>
          </div>

          {/* Events Table Container */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-medium text-[11px]">
                  <th className="py-3 px-4 font-medium">Event ID</th>
                  <th className="py-3 px-4 font-medium">Event Name</th>
                  <th className="py-3 px-4 font-medium">Organizer</th>
                  <th className="py-3 px-4 font-medium">Created on</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Event Start Date</th>
                  <th className="py-3 px-4 font-medium">Event End Date</th>
                  <th className="py-3 px-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      <Link href={`/events/${ev.id}`} className="hover:text-[#FF5B22] transition-colors">
                        {ev.eventId}
                      </Link>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      <Link href={`/events/${ev.id}`} className="hover:text-[#FF5B22] transition-colors">
                        {ev.eventName}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{ev.organizer}</td>
                    <td className="py-4 px-4 text-gray-600">{ev.createdOn}</td>
                    <td className="py-4 px-4 text-gray-600">{ev.category}</td>
                    <td className="py-4 px-4 text-gray-600">{ev.startDate}</td>
                    <td className="py-4 px-4 text-gray-600">{ev.endDate}</td>

                    {/* Status Column */}
                    <td className="py-4 px-4 text-right">
                      {ev.status === "Upcoming" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                          Upcoming
                        </span>
                      )}
                      {ev.status === "Completed" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
                          Completed
                        </span>
                      )}
                      {ev.status === "Ongoing" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                          Ongoing
                        </span>
                      )}
                      {ev.status === "Invitation Sent" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                          Invitation Sent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Filter Slide-over Drawer (Matching Image 1) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                  </svg>
                  <span>Filter</span>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 pt-6 text-xs">
                {/* Event Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Event Name"
                    value={filterEventName}
                    onChange={(e) => setFilterEventName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
                  />
                </div>

                {/* Event Organizer */}
                <div>
                  <input
                    type="text"
                    placeholder="Event Organizer"
                    value={filterOrganizer}
                    onChange={(e) => setFilterOrganizer(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
                  />
                </div>

                {/* Event Category */}
                <div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md text-gray-700 bg-white focus:outline-none focus:border-[#FF5B22] cursor-pointer"
                  >
                    <option value="">Event Category</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Personal">Personal</option>
                    <option value="Social">Social</option>
                  </select>
                </div>

                {/* No. of Sessions */}
                <div>
                  <select
                    value={filterSessions}
                    onChange={(e) => setFilterSessions(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md text-gray-700 bg-white focus:outline-none focus:border-[#FF5B22] cursor-pointer"
                  >
                    <option value="">No. of Sessions</option>
                    <option value="1">1 Session</option>
                    <option value="2">2 Sessions</option>
                    <option value="3">3 Sessions</option>
                  </select>
                </div>

                {/* Event Status */}
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-md text-gray-700 bg-white focus:outline-none focus:border-[#FF5B22] cursor-pointer"
                  >
                    <option value="">Event Status</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Invitation Sent">Invitation Sent</option>
                  </select>
                </div>

                {/* Date range */}
                <div className="pt-2 space-y-2">
                  <label className="block font-semibold text-gray-900 text-xs">Date range</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-[#FF5B22]"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-[#FF5B22]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setFilterEventName("");
                  setFilterOrganizer("");
                  setFilterCategory("");
                  setFilterSessions("");
                  setFilterStatus("");
                  setDateFrom("");
                  setDateTo("");
                  setIsFilterOpen(false);
                }}
                className="flex-1 py-2.5 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] rounded-md text-xs font-semibold text-white transition-colors cursor-pointer text-center shadow-2xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

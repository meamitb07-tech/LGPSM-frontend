"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { eventService, EventData } from "@/services/eventService";

import { getDynamicEventStatus } from "@/utils/eventUtils";

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

export default function EventListingPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
    } catch (e) {
      console.warn("Backend delete warning:", e);
    }

    // Update local state and local storage
    const updatedEvents = events.filter((ev) => ev.id !== id);
    setEvents(updatedEvents);
    try {
      localStorage.setItem("app_local_events", JSON.stringify(updatedEvents));
    } catch (e) { }

    setDeletingEventId(null);
    setActiveActionId(null);
  };

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      let apiMapped: EventRow[] = [];
      try {
        const res = await eventService.getEvents();
        const rawList = Array.isArray(res?.data)
          ? res.data
          : ((res?.data as any)?.events || []);

        if (res && res.success && Array.isArray(rawList)) {
          apiMapped = rawList.map((item: any, index: number) => {
            const id = item._id || item.id || String(index + 1);
            const eventId = `#${String(id).slice(-4).toUpperCase()}`;

            const rawStatus = (item.status || "Upcoming").toString().toUpperCase();
            let mappedStatus: "Upcoming" | "Completed" | "Ongoing" | "Invitation Sent" = "Upcoming";
            if (rawStatus === "PUBLISHED" || rawStatus === "ACTIVE" || rawStatus === "UPCOMING") {
              mappedStatus = "Upcoming";
            } else if (rawStatus === "COMPLETED") {
              mappedStatus = "Completed";
            } else if (rawStatus === "DRAFT" || rawStatus === "ONGOING") {
              mappedStatus = "Ongoing";
            }

            const startVal = item.schedule?.start || item.startDate;
            const endVal = item.schedule?.end || item.endDate;

            return {
              id,
              eventId,
              eventName: item.title || "Untitled Event",
              organizer: item.organizerId?.fullName || user?.fullName || "Organizer",
              createdOn: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently",
              category: item.category || item.categoryId?.name || "Corporate",
              startDate: startVal ? new Date(startVal).toLocaleString() : "TBD",
              endDate: endVal ? new Date(endVal).toLocaleString() : "TBD",
              status: mappedStatus,
            };
          });
        }
      } catch (e) {
        console.error("Failed to fetch events from API:", e);
      }

      // Read local cache from localStorage
      let localEvents: EventRow[] = [];
      try {
        const saved = localStorage.getItem("app_local_events");
        if (saved) {
          localEvents = JSON.parse(saved);
        }
      } catch (err) {
        console.error("Failed to read app_local_events from localStorage:", err);
      }

      // Merge local and API events, giving local events priority and deduplicating by id
      const combinedMap = new Map<string, EventRow>();
      localEvents.forEach((ev) => combinedMap.set(ev.id, ev));
      apiMapped.forEach((ev) => combinedMap.set(ev.id, ev));

      const combinedWithDynamicStatus = Array.from(combinedMap.values()).map((ev) => {
        const dynamicStatus = getDynamicEventStatus(ev.startDate, ev.endDate, ev.status);
        return {
          ...ev,
          status: dynamicStatus as EventRow["status"],
        };
      });

      setEvents(combinedWithDynamicStatus);
      setLoading(false);
    }
    loadEvents();
  }, [user]);

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
    <div className="w-full min-h-full bg-white text-gray-900 font-sans">
      {/* Top Header Bar */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Event</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-800">{user?.fullName || user?.email || "Super Admin"}</span>
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white pb-24">
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
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
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

          {/* Events Table Container with padding bottom for dropdown overflow */}
          <div className="overflow-x-auto pt-2 pb-24">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px]">
                  <th className="py-3 px-4 font-medium">Event ID</th>
                  <th className="py-3 px-4 font-medium">Event Name</th>
                  <th className="py-3 px-4 font-medium">Organizer</th>
                  <th className="py-3 px-4 font-medium">Created on</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Event Start Date</th>
                  <th className="py-3 px-4 font-medium">Event End Date</th>
                  <th className="py-3 px-4 font-medium text-center">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500 font-medium">
                      Loading events...
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500 font-medium">
                      No events found
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev, idx) => {
                    const isActionOpen = activeActionId === ev.id;
                    const shouldOpenUpwards = idx > 2 && idx >= filteredEvents.length - 2;

                    return (
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
                        <td className="py-4 px-4 text-center">
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
                          {ev.status !== "Upcoming" && ev.status !== "Completed" && ev.status !== "Ongoing" && ev.status !== "Invitation Sent" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                              {ev.status}
                            </span>
                          )}
                        </td>

                        {/* Action Column with Three Dots */}
                        <td className="py-4 px-4 text-right">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => setActiveActionId(isActionOpen ? null : ev.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                              title="Actions"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
                              </svg>
                            </button>

                            {isActionOpen && (
                              <div className={`absolute right-0 ${shouldOpenUpwards ? "bottom-full mb-1" : "top-full mt-1"} z-50 bg-[#1E232A] text-white text-xs font-medium py-2 px-3 rounded-md border border-gray-700 animate-in fade-in duration-150 flex flex-col gap-2 min-w-[130px] text-left`}>
                                <Link
                                  href={`/events/${ev.id}/edit`}
                                  className="py-1 hover:text-[#FF5B22] transition-colors flex items-center gap-2"
                                >
                                  <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span>Edit Event</span>
                                </Link>
                                <button
                                  onClick={() => setDeletingEventId(ev.id)}
                                  className="py-1 text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-2 text-left cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span>Delete Event</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Delete Event Confirmation Modal */}
      {deletingEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Event</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingEventId(null)}
                className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(deletingEventId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
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
            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
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

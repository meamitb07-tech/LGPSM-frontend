"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AddInviteesModal from "@/components/add-event/modals/AddInviteesModal";
import InviteesPreviewModal from "@/components/add-event/modals/InviteesPreviewModal";
import { eventService } from "@/services/eventService";
import { sessionService } from "@/services/sessionService";
import { inviteeService } from "@/services/inviteeService";
import EventSubNav from "@/components/EventSubNav";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import CustomDropdown from "@/components/common/CustomDropdown";

export default function InviteesManagementPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = (params?.id as string) || "1";
  const { user } = useAuth();

  const [invitees, setInvitees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState(eventId);
  const [selectedSessionFilter, setSelectedSessionFilter] = useState("All Sessions");

  const [eventsOptions, setEventsOptions] = useState<{ id: string; title: string }[]>([]);
  const [sessionsOptions, setSessionsOptions] = useState<{ id: string; name: string }[]>([]);

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Load events list for filter dropdown
  useEffect(() => {
    async function loadEvents() {
      let combined: { id: string; title: string }[] = [];
      try {
        const res = await eventService.getEvents();
        const rawList = Array.isArray(res?.data) ? res.data : ((res?.data as any)?.events || []);
        if (res?.success && Array.isArray(rawList)) {
          rawList.forEach((ev: any) => {
            const id = ev._id || ev.id;
            if (id) combined.push({ id, title: ev.title || ev.eventName || "Untitled Event" });
          });
        }
      } catch (err) { }

      try {
        const saved = localStorage.getItem("app_local_events");
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.forEach((ev: any) => {
            if (ev.id && !combined.some((item) => item.id === ev.id)) {
              combined.push({ id: ev.id, title: ev.eventName || ev.title || "Untitled Event" });
            }
          });
        }
      } catch (e) { }

      if (combined.length === 0) {
        combined.push({ id: eventId, title: "Test Event" });
      }
      setEventsOptions(combined);

      const matched = combined.find((e) => e.id === eventId);
      if (matched) {
        setSelectedEventFilter(matched.id);
      } else if (combined.length > 0) {
        setSelectedEventFilter(combined[0].id);
      }
    }
    loadEvents();
  }, [eventId]);

  // Load sessions list for filter dropdown
  useEffect(() => {
    async function loadSessions() {
      let mapped: { id: string; name: string }[] = [];
      try {
        const res = await sessionService.getSessions(eventId);
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          mapped = res.data.map((s: any, idx: number) => ({
            id: s._id || s.id || `sess_${idx}`,
            name: s.name || s.title || `Session ${idx + 1}`,
          }));
        }
      } catch {}

      try {
        const cached = localStorage.getItem(`app_local_sessions_${eventId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            parsed.forEach((s: any, idx: number) => {
              const name = s.name || s.title || `Session ${idx + 1}`;
              const id = s._id || s.id || `sess_${idx}`;
              if (!mapped.some((m) => m.id === id || m.name === name)) {
                mapped.push({ id, name });
              }
            });
          }
        }
      } catch (e) {}

      setSessionsOptions(mapped);
    }
    loadSessions();
  }, [eventId]);

  const fetchInvitees = async () => {
    try {
      setLoading(true);
      const res = await inviteeService.getInvitees(eventId);
      let list: any[] = [];
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        list = res.data;
      } else {
        const keysToTry = [
          `app_local_invitees_${eventId}`,
          `app_local_invitees_${selectedEventFilter}`,
          "app_local_invitees_1",
          "app_local_invitees_draft",
          "app_local_invitees"
        ];
        for (const k of keysToTry) {
          if (!k) continue;
          const cached = localStorage.getItem(k);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                list = parsed;
                break;
              }
            } catch (e) { }
          }
        }
      }
      setInvitees(list);
    } catch (error) {
      console.error("Error fetching invitees:", error);
      const cached = localStorage.getItem(`app_local_invitees_${eventId}`);
      if (cached) {
        try {
          setInvitees(JSON.parse(cached));
        } catch (e) {
          setInvitees([]);
        }
      } else {
        setInvitees([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchInvitees();
    }
  }, [eventId, selectedEventFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(invitees.map((item) => item._id || item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const previewInviteesList = useMemo(() => {
    if (invitees.length === 0) return undefined;
    return invitees.map((inv, idx) => ({
      id: String(idx + 1).padStart(2, "0"),
      name: inv.name || "Invitee",
      email: inv.email || "invitee@example.com",
      phone: inv.mobile || inv.phone || "+919000000000",
    }));
  }, [invitees]);

  const isAllSelected = selectedIds.length === invitees.length && invitees.length > 0;

  const filteredInvitees = invitees.filter(
    (item) =>
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.mobile || "").includes(searchQuery)
  );

  return (
    <div className="w-full min-h-full bg-white text-gray-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Add Invitees</h1>
        <UserNavDropdown />
      </header>

      {/* Page Content - Directly on pure white page background */}
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white pb-24">
          {/* Sub-Navigation Tabs Bar */}
          <EventSubNav
            eventId={eventId}
            activeTab="invitees"
            inviteesCount={invitees.length}
          />

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Title & Search Bar */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <h2 className="text-sm font-bold text-gray-900 shrink-0">Invitees</h2>

              {/* Search Bar */}
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
                  placeholder="Search invitees"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22]"
                />
              </div>
            </div>

            {/* Filter Dropdowns & Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="w-48">
                <CustomDropdown
                  value={selectedEventFilter}
                  onChange={(val) => {
                    setSelectedEventFilter(val);
                    if (val && val !== "All Events" && val !== eventId) {
                      router.push(`/events/${val}/invitees`);
                    }
                  }}
                  options={eventsOptions.map((ev) => ({ value: ev.id, label: ev.title }))}
                  placeholder="Select Event"
                />
              </div>

              <div className="w-48">
                <CustomDropdown
                  value={selectedSessionFilter}
                  onChange={(val) => setSelectedSessionFilter(val)}
                  options={[
                    { value: "All Sessions", label: "Select Session" },
                    ...sessionsOptions.map((sess) => ({ value: sess.id, label: sess.name })),
                  ]}
                  placeholder="Select Session"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Invitees</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                <span>Send Invitation</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5B22]"></div>
            </div>
          ) : invitees.length > 0 ? (
            <>
              {/* Sub-controls Bar */}
              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600 select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer"
                  />
                  <span>Select All</span>
                </label>

                <button
                  type="button"
                  className="px-4 py-1.5 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Resend Invitation
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-medium text-[11px]">
                      <th className="py-3 px-3 w-10"></th>
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Email</th>
                      <th className="py-3 px-4 font-medium">Mobile No.</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">RSVP Status</th>
                      <th className="py-3 px-4 font-medium">Dietary Preference</th>
                      <th className="py-3 px-4 font-medium text-center">Entry</th>
                      <th className="py-3 px-4 font-medium text-center">Lunch</th>
                      <th className="py-3 px-2 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-800">
                    {filteredInvitees.map((item) => {
                      const id = item._id || item.id;
                      const isChecked = selectedIds.includes(id);
                      return (
                        <tr key={id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleSelectOne(id)}
                              className="rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer"
                            />
                          </td>

                          <td className="py-4 px-4 font-medium text-gray-900">{item.name || "--"}</td>
                          <td className="py-4 px-4 text-gray-600">{item.email || "--"}</td>
                          <td className="py-4 px-4 text-gray-600">{item.mobile || "--"}</td>

                          <td className="py-4 px-4">
                            {item.status !== "Sending Failed" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                                Successfully Send
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-600">
                                Sending Failed
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            {(!item.rsvpStatus || item.rsvpStatus === "Pending") && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                                Pending
                              </span>
                            )}
                            {item.rsvpStatus === "Accepted" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700">
                                Accepted
                              </span>
                            )}
                            {item.rsvpStatus === "Declined" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-700">
                                Declined
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            {item.dietaryPreference && item.dietaryPreference !== "--" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-gray-200 text-gray-700 bg-white shadow-2xs">
                                {item.dietaryPreference}
                              </span>
                            ) : (
                              <span className="text-gray-400 font-medium">--</span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            {item.entry !== false ? (
                              <svg className="w-4 h-4 text-emerald-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-rose-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            {item.lunch !== false ? (
                              <svg className="w-4 h-4 text-emerald-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-rose-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </td>

                          <td className="py-4 px-2 text-right">
                            <button
                              onClick={() => setIsPreviewModalOpen(true)}
                              className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4 text-center">
              <div className="w-20 h-20 text-gray-300 flex items-center justify-center">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  <path d="M18 11c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.25 0-.49.04-.71.11.45.82.71 1.76.71 2.76 0 1.01-.26 1.95-.71 2.78.22.07.46.1.71.1zm.9 3.01C20.2 14.86 21 16.02 21 17v2h3v-2c0-1.8-3.03-2.79-5.1-2.99z" />
                </svg>
              </div>

              <p className="text-sm font-semibold text-gray-500 max-w-sm">
                No invitees found. Add invitees to get started.
              </p>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#FF5B22] font-semibold text-xs rounded-md transition-colors cursor-pointer"
              >
                Add Invitees
              </button>
            </div>
          )}
        </div>

      {/* ── Modals ── */}
      <AddInviteesModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        eventId={eventId}
        onUploadSuccess={(parsedList, uploadEventId) => {
          const targetEvt = uploadEventId || eventId;
          if (parsedList && parsedList.length > 0) {
            setInvitees(parsedList);
          } else {
            fetchInvitees();
          }
          if (targetEvt && targetEvt !== eventId) {
            router.push(`/events/${targetEvt}/invitees`);
          }
          setIsPreviewModalOpen(true);
        }}
      />

      <InviteesPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        inviteesList={previewInviteesList}
        sessionName="Session 1 - Entry Session"
        onSave={(updatedList) => {
          const formatted = updatedList.map((u) => ({
            id: u.id,
            _id: u.id,
            eventId: selectedEventFilter || eventId,
            name: u.name,
            email: u.email,
            mobile: u.phone,
            phone: u.phone,
            registrationStatus: "confirmed",
            rsvpStatus: "accepted",
            dietaryPreference: "Veg",
            entry: true,
            lunch: true,
          }));
          setInvitees(formatted);
          try {
            localStorage.setItem(`app_local_invitees_${selectedEventFilter || eventId}`, JSON.stringify(formatted));
            localStorage.setItem(`app_local_invitees_${eventId}`, JSON.stringify(formatted));
            localStorage.setItem(`app_local_invitees_1`, JSON.stringify(formatted));
          } catch (e) { }
        }}
      />
    </div>
  );
}


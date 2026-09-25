"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AddInviteesModal from "@/components/add-event/modals/AddInviteesModal";
import InviteesPreviewModal from "@/components/add-event/modals/InviteesPreviewModal";
import EditInviteeModal from "@/components/add-event/modals/EditInviteeModal";
import DeleteInviteeModal from "@/components/add-event/modals/DeleteInviteeModal";
import { eventService } from "@/services/eventService";
import { sessionService } from "@/services/sessionService";
import { inviteeService } from "@/services/inviteeService";
import { invitationService, InvitationData } from "@/services/invitationService";
import EventSubNav, { notifyDbUpdate } from "@/components/EventSubNav";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import CustomDropdown from "@/components/common/CustomDropdown";
import InvitationPreviewModal from "@/components/invitation/InvitationPreviewModal";
import { InvitationCardData } from "@/components/invitation/InvitationCard";
import { useAlert } from "@/context/AlertContext";
import { formatPhoneNumber } from "@/utils/eventUtils";

export default function InviteesManagementPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = (params?.id as string) || "1";

  const fromSidebar = searchParams?.get("from") === "sidebar" || eventId === "1" || eventId === "select";

  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [invitees, setInvitees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>(fromSidebar ? "" : eventId);
  const [selectedSessionFilter, setSelectedSessionFilter] = useState("All Sessions");

  const [eventsOptions, setEventsOptions] = useState<{ id: string; title: string }[]>([]);
  const [sessionsOptions, setSessionsOptions] = useState<{ id: string; name: string }[]>([]);

  // Invitation delivery state
  const [selectedChannel, setSelectedChannel] = useState<"EMAIL" | "SMS" | "WHATSAPP">("WHATSAPP");
  const [sending, setSending] = useState(false);
  const [resending, setResending] = useState(false);
  const [invitationHistory, setInvitationHistory] = useState<InvitationData[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: "success" | "error";
    message: string;
    details?: any[];
  } | null>(null);

  // Modal Control & Action States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCardPreviewOpen, setIsCardPreviewOpen] = useState(false);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [editingInvitee, setEditingInvitee] = useState<any | null>(null);
  const [deletingInviteeId, setDeletingInviteeId] = useState<string | null>(null);

  // Per-invitee card preview state
  const [previewingInvitee, setPreviewingInvitee] = useState<any | null>(null);
  const [eventDetails, setEventDetails] = useState<any | null>(null);
  const [sessionsDetails, setSessionsDetails] = useState<any[]>([]);

  // Fetch event details from DB for card rendering
  useEffect(() => {
    async function loadEventDetails() {
      const activeEvtId = selectedEventFilter || (!fromSidebar ? eventId : "");
      if (!activeEvtId || activeEvtId === "1" || activeEvtId === "select") {
        setEventDetails(null);
        setSessionsDetails([]);
        return;
      }
      try {
        const [evtRes, sessRes] = await Promise.all([
          eventService.getEvent(activeEvtId),
          sessionService.getSessions(activeEvtId),
        ]);
        if (evtRes?.success && evtRes.data) {
          setEventDetails(evtRes.data);
        }
        if (sessRes?.success && Array.isArray(sessRes.data)) {
          setSessionsDetails(sessRes.data);
        } else {
          setSessionsDetails([]);
        }
      } catch (err) {
        console.error("Error loading event details for card preview:", err);
      }
    }
    loadEventDetails();
  }, [eventId, selectedEventFilter, fromSidebar]);

  // Build dynamic InvitationCardData for a specific invitee from DB data
  const buildCardDataForInvitee = useCallback((invitee: any): InvitationCardData => {
    const activeEvtId = selectedEventFilter || eventId;
    const matchedEventObj = eventsOptions.find((e) => e.id === activeEvtId);

    // Derive event date/time from DB event details
    let eventDate = "15 OCT 2026";
    let dayOfWeek = "THURSDAY";
    let startTime = "09:00 AM";
    let venue = "RCCIIT AUDITORIUM";
    let locationSub = "KOLKATA, WB";
    let eventTitle = matchedEventObj?.title || "TECH SUMMIT 2026";

    if (eventDetails) {
      eventTitle = eventDetails.title || eventTitle;
      const startStr = eventDetails.schedule?.start || eventDetails.startDate;
      if (startStr) {
        const d = new Date(startStr);
        if (!isNaN(d.getTime())) {
          eventDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }).toUpperCase();
          dayOfWeek = d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
          startTime = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        }
      }
      const loc = eventDetails.location;
      if (loc) {
        if (typeof loc === "string") {
          venue = loc;
        } else if (loc.address) {
          venue = loc.address;
          locationSub = loc.city || loc.state || locationSub;
        }
      }
      if (eventDetails.venueDetails) {
        venue = eventDetails.venueDetails;
      }
    }

    // Build sessions from DB session data, filtering by invitee's session access
    const inviteeSessionAccess = invitee.sessionAccess || [];
    let cardSessions = sessionsDetails
      .filter((s: any) => {
        if (inviteeSessionAccess.length === 0) return true;
        const access = inviteeSessionAccess.find(
          (sa: any) => String(sa.sessionId?._id || sa.sessionId) === String(s._id || s.id)
        );
        return access ? access.allowed !== false : true;
      })
      .map((s: any) => {
        const sessStart = s.schedule?.start || s.startTime;
        const sessEnd = s.schedule?.end || s.endTime;
        let st = "10:00 AM";
        let et: string | undefined;
        if (sessStart) {
          const d = new Date(sessStart);
          if (!isNaN(d.getTime())) st = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        }
        if (sessEnd) {
          const d = new Date(sessEnd);
          if (!isNaN(d.getTime())) et = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        }
        return {
          id: s._id || s.id,
          name: s.name || s.title || "Session",
          startTime: st,
          endTime: et,
        };
      });

    if (cardSessions.length === 0) {
      cardSessions = sessionsOptions.map((s) => ({ id: s.id, name: s.name, startTime: "10:00 AM", endTime: undefined as string | undefined }));
    }

    // Build a unique invitation URL for this invitee for QR generation
    const invitationUrl = `${window.location.origin}/invitation/${invitee._id || invitee.id || "preview"}`;

    return {
      invitee: {
        id: invitee._id || invitee.id,
        name: invitee.name || "Guest",
        companyName: invitee.companyName || invitee.company || "LGPSM",
      },
      event: {
        id: activeEvtId,
        title: eventTitle,
        subtitle: "INNOVATE | COLLABORATE | LEAD",
        date: eventDate,
        dayOfWeek,
        startTime,
        timeSub: "ONWARDS",
        venue,
        locationSub,
      },
      sessions: cardSessions,
      invitationUrl,
    };
  }, [eventsOptions, selectedEventFilter, eventId, eventDetails, sessionsDetails, sessionsOptions]);

  // The active card data for the preview modal (built from the previewing invitee)
  const previewCardData: InvitationCardData = useMemo(() => {
    if (previewingInvitee) {
      return buildCardDataForInvitee(previewingInvitee);
    }
    // Fallback if no invitee selected
    return {
      invitee: { id: "preview", name: "Select an Invitee", companyName: "LGPSM" },
      event: { id: eventId, title: "TECH SUMMIT 2026" },
      sessions: [],
    };
  }, [previewingInvitee, buildCardDataForInvitee, eventId]);

  const handleConfirmPermanentDelete = async (targetId: string) => {
    try {
      const realItem = invitees.find(
        (inv, idx) => inv._id === targetId || inv.id === targetId || String(idx + 1).padStart(2, "0") === targetId
      );
      const realId = realItem?._id || realItem?.id || targetId;

      if (realId && !realId.startsWith("inv_")) {
        await inviteeService.deleteInvitee(realId);
      }
      showAlert("Invitee permanently deleted.", "success");
      await fetchInvitees();
    } catch (err: any) {
      console.error("Error deleting invitee:", err);
      showAlert(err.message || "Failed to delete invitee.", "error");
    }
  };

  const handleConfirmPermanentEdit = async (updatedRow: any) => {
    try {
      const targetId = updatedRow.id;
      const realItem = invitees.find(
        (inv, idx) => inv._id === targetId || inv.id === targetId || String(idx + 1).padStart(2, "0") === targetId
      );
      const realId = realItem?._id || realItem?.id || targetId;

      if (realId && !realId.startsWith("inv_")) {
        await inviteeService.updateInvitee(realId, {
          name: updatedRow.name,
          email: updatedRow.email,
          mobile: updatedRow.phone || updatedRow.mobile,
        });
      }
      showAlert("Invitee updated successfully.", "success");
      await fetchInvitees();
    } catch (err: any) {
      console.error("Error updating invitee:", err);
      showAlert(err.message || "Failed to update invitee.", "error");
    }
  };

  const handleRsvpStatusChange = async (targetId: string, newStatus: "PENDING" | "ACCEPTED" | "DECLINED") => {
    try {
      const realItem = invitees.find(
        (inv, idx) => inv._id === targetId || inv.id === targetId || String(idx + 1).padStart(2, "0") === targetId
      );
      const realId = realItem?._id || realItem?.id || targetId;

      if (realId && !realId.startsWith("inv_")) {
        await inviteeService.updateInvitee(realId, { rsvpStatus: newStatus });
      }
      showAlert(`RSVP status updated to ${newStatus}.`, "success");
      await fetchInvitees();
    } catch (err: any) {
      console.error("Error updating RSVP status:", err);
      showAlert(err.message || "Failed to update RSVP status.", "error");
    }
  };

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
      } catch (err) {}

      setEventsOptions(combined);

      if (!fromSidebar) {
        const matched = combined.find((e) => e.id === eventId);
        if (matched) {
          setSelectedEventFilter(matched.id);
        } else if (combined.length > 0) {
          setSelectedEventFilter(combined[0].id);
        }
      } else {
        setSelectedEventFilter("");
      }
    }
    loadEvents();
  }, [eventId, fromSidebar]);

  // Load sessions list for filter dropdown
  useEffect(() => {
    async function loadSessions() {
      const activeEvtId = selectedEventFilter || (!fromSidebar ? eventId : "");
      if (!activeEvtId || activeEvtId === "1") {
        setSessionsOptions([]);
        return;
      }

      let mapped: { id: string; name: string }[] = [];
      try {
        const res = await sessionService.getSessions(activeEvtId);
        if (res?.success && Array.isArray(res.data)) {
          mapped = res.data.map((s: any, idx: number) => ({
            id: s._id || s.id,
            name: s.name || s.title || `Session ${idx + 1}`,
          }));
        }
      } catch {}

      setSessionsOptions(mapped);
    }
    loadSessions();
  }, [eventId, selectedEventFilter, fromSidebar]);

  const fetchInvitees = async () => {
    const activeEvtId = selectedEventFilter || (!fromSidebar ? eventId : "");
    if (!activeEvtId || activeEvtId === "1") {
      setInvitees([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await inviteeService.getInvitees(activeEvtId);
      if (res.success && Array.isArray(res.data)) {
        setInvitees(res.data);
        notifyDbUpdate();
      } else {
        setInvitees([]);
      }
    } catch (error) {
      console.error("Error fetching invitees:", error);
      setInvitees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitationHistory = async () => {
    const activeEvtId = selectedEventFilter || (!fromSidebar ? eventId : "");
    if (!activeEvtId || activeEvtId === "1") {
      setInvitationHistory([]);
      return;
    }

    try {
      setLoadingHistory(true);
      const res = await invitationService.getInvitations(activeEvtId);
      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.invitations || []);
        setInvitationHistory(list);
      } else {
        setInvitationHistory([]);
      }
    } catch (err) {
      console.error("Error fetching invitation history:", err);
      setInvitationHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchInvitees();
    fetchInvitationHistory();
  }, [eventId, selectedEventFilter, fromSidebar]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredInvitees.map((item) => item._id || item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // WhatsApp Direct Web Link Handler
  const handleSendWhatsAppDirect = (inviteeItem: any) => {
    const cardData = buildCardDataForInvitee(inviteeItem);
    const rawMobile = inviteeItem.mobile || inviteeItem.phone || "+91 99031 07102";
    let cleaned = rawMobile.replace(/\D/g, "").replace(/^0+/, "");
    if (cleaned.length === 10) cleaned = `91${cleaned}`;

    const passUrl = cardData.invitationUrl || `${window.location.origin}/events/${eventId}/invitees`;
    const text = `Dear ${inviteeItem.name},\n\nYou are cordially invited to ${cardData.event.title}!\n\n📅 Date: ${cardData.event.date || "TBA"}\n⏰ Time: ${cardData.event.startTime || "TBA"}\n📍 Venue: ${cardData.event.venue || "TBA"}\n\nView your official Invitation Pass & QR Code here:\n${passUrl}\n\nWe look forward to hosting you!`;

    const waUrl = `https://api.whatsapp.com/send?phone=${cleaned}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");

    setStatusFeedback({
      type: "success",
      message: `Opened WhatsApp Web to send invitation card to ${inviteeItem.name} (${rawMobile}).`,
    });
  };

  // Send Invitations Handler
  const handleSendInvitations = async () => {
    if (selectedIds.length === 0) {
      showAlert("Please select at least one invitee to send invitations.", "warning");
      return;
    }

    try {
      setSending(true);
      setStatusFeedback(null);

      const res = await invitationService.sendInvitations(eventId, {
        inviteeIds: selectedIds,
        channel: selectedChannel,
      });

      const results = (res as any).results || res.data?.results || [];

      if (res.success || results.length > 0 || (res as any).message?.includes("processed")) {
        const failed = results.filter((r: any) => r.status === "FAILED");
        const sent = results.filter((r: any) => r.status === "SENT");

        if (failed.length > 0 && sent.length === 0) {
          const firstReason = failed[0]?.failureReason || "Failed to send invitation";
          setStatusFeedback({
            type: "error",
            message: `Failed to send invitations: ${firstReason}`,
            details: failed,
          });
        } else if (failed.length > 0 && sent.length > 0) {
          setStatusFeedback({
            type: "error",
            message: `Sent ${sent.length} invitation(s), but ${failed.length} failed. Reason: ${failed[0]?.failureReason || 'Unknown error'}`,
            details: results,
          });
          setSelectedIds([]);
        } else {
          const chLabel = selectedChannel === "WHATSAPP" ? "WhatsApp" : selectedChannel === "EMAIL" ? "Email" : "selected channel";
          setStatusFeedback({
            type: "success",
            message: `Successfully sent invitation via ${chLabel} to ${sent.length || results.length} selected invitee(s).`,
            details: results,
          });
          setSelectedIds([]);
        }

        await fetchInvitees();
        await fetchInvitationHistory();
      } else {
        setStatusFeedback({
          type: "error",
          message: res.message || "Failed to send invitations.",
        });
      }
    } catch (err: any) {
      setStatusFeedback({
        type: "error",
        message: err.message || "Error sending invitations.",
      });
    } finally {
      setSending(false);
    }
  };

  // Resend Invitations Handler
  const handleResendInvitations = async () => {
    if (selectedIds.length === 0) {
      showAlert("Please select at least one invitee to resend invitations.", "warning");
      return;
    }

    // Match invitation history records for selected invitees
    const targetInvitationIds: string[] = [];
    selectedIds.forEach((invId) => {
      const matched = invitationHistory.find((h) => {
        const hInvId = typeof h.inviteeId === "object" ? h.inviteeId?._id : h.inviteeId;
        return String(hInvId) === String(invId);
      });
      if (matched && matched._id) {
        targetInvitationIds.push(matched._id);
      }
    });

    if (targetInvitationIds.length === 0) {
      return handleSendInvitations();
    }

    try {
      setResending(true);
      setStatusFeedback(null);

      const res = await invitationService.resendInvitations(eventId, {
        invitationIds: targetInvitationIds,
        channel: selectedChannel,
      });

      const results = (res as any).results || res.data?.results || [];

      if (res.success || results.length > 0 || (res as any).message?.includes("processed")) {
        const failed = results.filter((r: any) => r.status === "FAILED");
        const resent = results.filter((r: any) => r.status === "SENT");

        if (failed.length > 0 && resent.length === 0) {
          const firstReason = failed[0]?.failureReason || "Resend failed";
          setStatusFeedback({
            type: "error",
            message: `Failed to resend invitations: ${firstReason}`,
            details: failed,
          });
        } else if (failed.length > 0 && resent.length > 0) {
          setStatusFeedback({
            type: "error",
            message: `Resent ${resent.length} invitation(s), but ${failed.length} failed. Reason: ${failed[0]?.failureReason || 'Unknown error'}`,
            details: results,
          });
          setSelectedIds([]);
        } else {
          const chLabel = selectedChannel === "WHATSAPP" ? "WhatsApp" : selectedChannel === "EMAIL" ? "Email" : "selected channel";
          setStatusFeedback({
            type: "success",
            message: `Successfully resent invitation via ${chLabel} to ${resent.length || results.length} selected invitee(s).`,
            details: results,
          });
          setSelectedIds([]);
        }

        await fetchInvitees();
        await fetchInvitationHistory();
      } else {
        setStatusFeedback({
          type: "error",
          message: res.message || "Failed to resend invitations.",
        });
      }
    } catch (err: any) {
      setStatusFeedback({
        type: "error",
        message: err.message || "Error resending invitations.",
      });
    } finally {
      setResending(false);
    }
  };

  const handleBulkGrantAccess = async () => {
    if (selectedIds.length === 0 || !selectedSessionFilter || selectedSessionFilter === "All Sessions") {
      showAlert("Please select invitees and choose a specific session from the session filter dropdown.", "warning");
      return;
    }

    try {
      const res = await inviteeService.bulkUpdateSessionAccess(eventId, {
        inviteeIds: selectedIds,
        sessionAccess: [{ sessionId: selectedSessionFilter, allowed: true }],
      });
      if (res.success) {
        await fetchInvitees();
        setSelectedIds([]);
      } else {
        showAlert(res.message || "Failed to grant bulk session access.", "error");
      }
    } catch (e: any) {
      showAlert(e.message || "Failed to update session access.", "error");
    }
  };

  const hasAccessToSession = (item: any, sessionIndex: number, nameMatch?: string) => {
    // 1. If item has explicit sessionAccess array populated
    if (item.sessionAccess && Array.isArray(item.sessionAccess) && item.sessionAccess.length > 0) {
      let targetSessId = "";
      if (nameMatch) {
        const foundSess = sessionsOptions.find((s) => s.name.toLowerCase().includes(nameMatch.toLowerCase()));
        if (foundSess) targetSessId = foundSess.id;
      }
      if (!targetSessId && sessionsOptions.length > sessionIndex) {
        targetSessId = sessionsOptions[sessionIndex].id;
      }

      if (targetSessId) {
        const accessRecord = item.sessionAccess.find(
          (sa: any) => String(sa.sessionId?._id || sa.sessionId) === String(targetSessId)
        );
        return accessRecord ? !!accessRecord.allowed : false;
      }
    }

    // 2. Legacy property checks
    if (nameMatch === "entry" && item.entry !== undefined) return !!item.entry;
    if (nameMatch === "lunch" && item.lunch !== undefined) return !!item.lunch;

    return true;
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

  const filteredInvitees = invitees.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.mobile || "").includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedSessionFilter && selectedSessionFilter !== "All Sessions") {
      if (item.sessionAccess && Array.isArray(item.sessionAccess) && item.sessionAccess.length > 0) {
        const accessRecord = item.sessionAccess.find(
          (sa: any) => String(sa.sessionId?._id || sa.sessionId) === String(selectedSessionFilter)
        );
        return accessRecord ? accessRecord.allowed !== false : false;
      }
    }

    return true;
  });

  const isAllSelected = selectedIds.length === filteredInvitees.length && filteredInvitees.length > 0;

  // Find latest failure reason for an invitee from history if present
  const getFailureReason = (inviteeId: string) => {
    const matched = invitationHistory.find((h) => {
      const id = typeof h.inviteeId === "object" ? h.inviteeId?._id : h.inviteeId;
      return String(id) === String(inviteeId) && h.status === "FAILED";
    });
    return matched?.failureReason;
  };

  return (
    <div className="w-full min-h-full bg-white text-gray-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-900">Add Invitees</h1>
        </div>
        <UserNavDropdown />
      </header>

      {/* Page Content */}
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-white pb-24">
        {/* Sub-Navigation Tabs Bar */}
        <EventSubNav
          eventId={eventId}
          activeTab="invitees"
          inviteesCount={invitees.length}
        />

        {/* Status Feedback Notification Banner */}
        {statusFeedback && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-start justify-between ${
              statusFeedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="space-y-1">
              <p className="font-semibold">{statusFeedback.message}</p>
              {statusFeedback.details && statusFeedback.details.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] opacity-90">
                  {statusFeedback.details.map((d: any, idx: number) => (
                    <li key={idx}>
                      <span className="font-semibold">{d.email || d.name || `Invitee ${idx + 1}`}</span> — Status: <span className="font-semibold">{d.status}</span>
                      {d.failureReason ? ` (${d.failureReason})` : ""}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = invitees.find((i: any) => selectedIds.includes(i._id || i.id)) || invitees[0];
                    if (target) handleSendWhatsAppDirect(target);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Open via WhatsApp Web Direct</span>
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStatusFeedback(null)}
              className="text-gray-400 hover:text-gray-600 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Controls Bar */}
        <div className="bg-gray-50/80 p-4 rounded-md border border-gray-200 space-y-3.5">
          {/* Row 1: Search & Filter Dropdowns */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <h2 className="text-sm font-bold text-gray-900 shrink-0">Invitees</h2>
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
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] shadow-2xs"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-36 sm:w-44">
                <CustomDropdown
                  value={selectedEventFilter}
                  onChange={(val) => {
                    setSelectedEventFilter(val);
                    if (val) {
                      router.push(`/events/${val}/invitees`);
                    } else {
                      router.push(`/events/1/invitees?from=sidebar`);
                    }
                  }}
                  options={[
                    { value: "", label: "Select Event" },
                    ...eventsOptions.map((ev) => ({ value: ev.id, label: ev.title })),
                  ]}
                  placeholder="Select Event"
                />
              </div>

              <div className="w-36 sm:w-44">
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

              <div className="w-32 sm:w-40">
                <CustomDropdown
                  value={selectedChannel}
                  onChange={(val) => setSelectedChannel(val as any)}
                  options={[
                    {
                      value: "WHATSAPP",
                      label: "WhatsApp",
                      icon: (
                        <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                      ),
                    },
                    {
                      value: "EMAIL",
                      label: "Email",
                      icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M20 18h-2V9.25L12 13.5 6 9.25V18H4V6h1.75L12 10.5 18.25 6H20v12z" />
                          <path fill="#4285F4" d="M4 6v12H2V6c0-1.1.9-2 2-2h2v2H4z" />
                          <path fill="#34A853" d="M20 6v12h2V6c0-1.1-.9-2-2-2h-2v2h2z" />
                          <path fill="#FBBC04" d="M4 6h16V4H4c-1.1 0-2 .9-2 2v.5h2V6z" />
                        </svg>
                      ),
                    },
                  ]}
                  placeholder="Channel"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-gray-200/60">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Invitees</span>
            </button>

            <button
              type="button"
              onClick={handleSendInvitations}
              disabled={sending}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 text-xs font-bold rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              {sending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#FF5B22] border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  <span>Send Invitation</span>
                </>
              )}
            </button>



            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>History</span>
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
                <span>Select All ({selectedIds.length} selected)</span>
              </label>

              <div className="flex items-center gap-3">
                {selectedIds.length > 0 && selectedSessionFilter !== "All Sessions" && (
                  <button
                    type="button"
                    onClick={handleBulkGrantAccess}
                    className="px-4 py-1.5 bg-[#FF5B22] text-white hover:bg-[#E04B16] text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs"
                  >
                    Assign Access ({selectedIds.length})
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResendInvitations}
                  disabled={resending}
                  className="px-4 py-1.5 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 text-xs font-semibold rounded-md transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {resending ? (
                    <>
                      <div className="w-3 h-3 border-2 border-[#FF5B22] border-t-transparent rounded-full animate-spin"></div>
                      <span>Resending...</span>
                    </>
                  ) : (
                    <span>Resend Invitation</span>
                  )}
                </button>
              </div>
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
                    <th className="py-3 px-4 font-medium">Company Name</th>
                    <th className="py-3 px-4 font-medium">Delivery Status</th>
                    <th className="py-3 px-4 font-medium">RSVP Status</th>
                    <th className="py-3 px-4 font-medium">Dietary Preference</th>
                    <th className="py-3 px-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  {filteredInvitees.map((item) => {
                    const id = item._id || item.id;
                    const isChecked = selectedIds.includes(id);
                    const failReason = getFailureReason(id);

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
                        <td className="py-4 px-4 text-gray-600">{formatPhoneNumber(item.mobile || item.phone) || "--"}</td>
                        <td className="py-4 px-4 text-gray-600 font-medium">{item.companyName || item.company || "--"}</td>

                        {/* Delivery Status Column */}
                        <td className="py-4 px-4">
                          {item.invitationStatus === "FAILED" ? (
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-700">
                                FAILED
                              </span>
                              {failReason && (
                                <span className="text-[10px] text-rose-600 font-medium">
                                  {failReason}
                                </span>
                              )}
                            </div>
                          ) : item.invitationStatus === "SENT" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                              SENT
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                              {item.invitationStatus || "PENDING"}
                            </span>
                          )}
                        </td>

                        {/* RSVP Status Column */}
                        <td className="py-4 px-4">
                          {item.rsvpStatus === "ACCEPTED" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                              ACCEPTED
                            </span>
                          ) : item.rsvpStatus === "DECLINED" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                              DECLINED
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                              PENDING
                            </span>
                          )}
                        </td>

                        {/* Dietary Preference Column */}
                        <td className="py-4 px-4">
                          {item.dietaryPreference || item.dietary || item.diet || item.preference || item.dietary_preference ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-gray-200 text-gray-700 bg-white shadow-2xs">
                              {item.dietaryPreference || item.dietary || item.diet || item.preference || item.dietary_preference}
                            </span>
                          ) : (
                            <span className="text-gray-400 font-medium">--</span>
                          )}
                        </td>

                        <td className="py-4 px-2 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            {/* Preview Card Icon */}
                            <button
                              type="button"
                              title={`Preview invitation card for ${item.name}`}
                              onClick={() => {
                                setPreviewingInvitee(item);
                                setIsCardPreviewOpen(true);
                                setActiveMenuRowId(null);
                              }}
                              className="text-[#CF5317] hover:text-[#FF5B22] transition-colors p-1.5 rounded-md hover:bg-orange-50 cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Direct WhatsApp Action Button */}
                            <button
                              type="button"
                              title={`Send invitation to ${item.name} via WhatsApp Web`}
                              onClick={() => handleSendWhatsAppDirect(item)}
                              className="text-emerald-600 hover:text-emerald-700 transition-colors p-1.5 rounded-md hover:bg-emerald-50 cursor-pointer"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                              </svg>
                            </button>

                            {/* Actions Menu */}
                            <button
                              type="button"
                              onClick={() => setActiveMenuRowId(activeMenuRowId === id ? null : id)}
                              className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 10a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
                              </svg>
                            </button>
                          </div>

                          {activeMenuRowId === id && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-30 py-1 text-left animate-in fade-in zoom-in-95 duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuRowId(null);
                                  setEditingInvitee({
                                    id,
                                    name: item.name || "",
                                    email: item.email || "",
                                    phone: item.mobile || item.phone || "",
                                  });
                                }}
                                className="w-full px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF5B22] flex items-center gap-2 cursor-pointer"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuRowId(null);
                                  setDeletingInviteeId(id);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Remove</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : !selectedEventFilter ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4 text-center">
            <div className="w-16 h-16 bg-orange-50 text-[#FF5B22] rounded-full flex items-center justify-center shadow-xs">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900">Select Event</p>
              <p className="text-xs text-gray-500 max-w-sm">
                Please select an event from the dropdown above to view its invitees and manage invitations.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4 text-center">
            <div className="w-20 h-20 text-gray-300 flex items-center justify-center">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                <path d="M18 11c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.25 0-.49.04-.71.11.45.82.71 1.76.71 2.76 0 1.01-.26 1.95-.71 2.78.22.07.46.1.71.1zm.9 3.01C20.2 14.86 21 16.02 21 17v2h3v-2c0-1.8-3.03-2.79-5.1-2.99z" />
              </svg>
            </div>

            <p className="text-sm font-semibold text-gray-500 max-w-sm">
              No invitees found for this event. Add invitees to get started.
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
        onUploadSuccess={async (parsedList, uploadEventId) => {
          const targetEvt = uploadEventId || eventId;
          await fetchInvitees();
          if (targetEvt && targetEvt !== eventId) {
            router.push(`/events/${targetEvt}/invitees`);
          }
        }}
      />

      <InviteesPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={async () => {
          setIsPreviewModalOpen(false);
          await fetchInvitees();
        }}
        inviteesList={previewInviteesList}
        sessionsOptions={sessionsOptions}
        onDelete={handleConfirmPermanentDelete}
        onEdit={handleConfirmPermanentEdit}
        onSave={async () => {
          setIsPreviewModalOpen(false);
          await fetchInvitees();
        }}
      />

      <EditInviteeModal
        isOpen={Boolean(editingInvitee)}
        onClose={() => setEditingInvitee(null)}
        invitee={editingInvitee}
        onSave={handleConfirmPermanentEdit}
      />

      <DeleteInviteeModal
        isOpen={Boolean(deletingInviteeId)}
        onClose={() => setDeletingInviteeId(null)}
        onConfirm={() => {
          if (deletingInviteeId) {
            handleConfirmPermanentDelete(deletingInviteeId);
          }
        }}
      />

      {/* Invitation Delivery History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-gray-900">Invitation Delivery History</h3>
                <p className="text-xs text-gray-500">View sent invitations and delivery status history for this event.</p>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-[#FF5B22] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : invitationHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                        <th className="py-2.5 px-3">Invitee Name</th>
                        <th className="py-2.5 px-3">Channel</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Failure Reason</th>
                        <th className="py-2.5 px-3">Date / Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {invitationHistory.map((record) => {
                        const inviteeName =
                          typeof record.inviteeId === "object" && record.inviteeId !== null
                            ? record.inviteeId.name
                            : typeof record.inviteeId === "string"
                            ? record.inviteeId
                            : "Unknown";

                        return (
                          <tr key={record._id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-medium text-gray-900">{inviteeName}</td>
                            <td className="py-3 px-3 font-mono text-[11px]">{record.channel}</td>
                            <td className="py-3 px-3">
                              {record.status === "SENT" ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                                  SENT
                                </span>
                              ) : record.status === "FAILED" ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                                  FAILED
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                                  {record.status}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-rose-600 font-medium text-[11px]">
                              {record.failureReason || "—"}
                            </td>
                            <td className="py-3 px-3 text-gray-500 text-[11px]">
                              {record.sentAt
                                ? new Date(record.sentAt).toLocaleString()
                                : record.createdAt
                                ? new Date(record.createdAt).toLocaleString()
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No invitation history records found for this event.
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Invitation Card Live Preview Modal (Per-Invitee) */}
      <InvitationPreviewModal
        isOpen={isCardPreviewOpen}
        onClose={() => {
          setIsCardPreviewOpen(false);
          setPreviewingInvitee(null);
        }}
        cardData={previewCardData}
      />
    </div>
  );
}

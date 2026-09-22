"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { inviteeService } from "@/services/inviteeService";
import { eventService } from "@/services/eventService";
import { sessionService } from "@/services/sessionService";
import CustomDropdown from "@/components/common/CustomDropdown";
import { useAlert } from "@/context/AlertContext";
import * as XLSX from "xlsx";

interface AddInviteesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (parsedList?: any[], eventId?: string, sessionId?: string) => void;
  eventId?: string;
}

const ExcelLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#107C41" />
    <path
      d="M7.2 6.6L10.8 12L7.2 17.4H9.4L11.8 13.6L14.2 17.4H16.4L12.8 12L16.4 6.6H14.2L11.8 10.4L9.4 6.6H7.2Z"
      fill="white"
    />
  </svg>
);

export default function AddInviteesModal({
  isOpen,
  onClose,
  onUploadSuccess,
  eventId: initialEventId,
}: AddInviteesModalProps) {
  const { showAlert } = useAlert();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [eventsList, setEventsList] = useState<{ id: string; title: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId || "");
  const [sessionsList, setSessionsList] = useState<{ id: string; name: string }[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load dynamic events list
  useEffect(() => {
    async function loadEvents() {
      let combined: { id: string; title: string }[] = [];
      try {
        const res = await eventService.getEvents();
        const rawList = Array.isArray(res?.data) ? res.data : ((res?.data as any)?.events || []);
        if (res?.success && Array.isArray(rawList)) {
          rawList.forEach((ev: any) => {
            const id = ev._id || ev.id;
            if (id) combined.push({ id, title: ev.title || "Untitled Event" });
          });
        }
      } catch (err) {
        console.error("Failed to load events in modal:", err);
      }

      // Add local cached events
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
      } catch { }

      if (combined.length === 0 && initialEventId) {
        combined.push({ id: initialEventId, title: "Current Event" });
      }

      setEventsList(combined);

      if (initialEventId) {
        setSelectedEventId(initialEventId);
      } else if (!selectedEventId && combined.length > 0) {
        setSelectedEventId(combined[0].id);
      }
    }

    if (isOpen) {
      loadEvents();
    }
  }, [isOpen, initialEventId]);

  // Load dynamic sessions whenever selectedEventId changes
  useEffect(() => {
    async function loadSessions() {
      if (!selectedEventId) {
        setSessionsList([]);
        setSelectedSessionId("");
        return;
      }

      try {
        const res = await sessionService.getSessions(selectedEventId);
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((s: any, idx: number) => ({
            id: s._id || s.id,
            name: s.name || `Session ${idx + 1}`,
          }));
          setSessionsList(mapped);
          setSelectedSessionId(mapped[0].id);
        } else {
          setSessionsList([]);
          setSelectedSessionId("");
        }
      } catch {
        setSessionsList([]);
        setSelectedSessionId("");
      }
    }

    if (isOpen) {
      loadSessions();
    }
  }, [isOpen, selectedEventId]);

  useEffect(() => {
    if (isOpen) {
      if (overlayRef.current) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      }
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" }
        );
      }
      setUploadedFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      showAlert("Please select an Excel or CSV file to upload.", "warning");
      return;
    }

    const targetEventId = selectedEventId || initialEventId || "1";

    setIsUploading(true);

    let parsedInvitees: any[] = [];
    let inviteeCount = 0;

    try {
      const data = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

      const nonBlankRows = rawRows.filter(
        (r) => r && Array.isArray(r) && r.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== "")
      );

      if (nonBlankRows.length > 0) {
        let nameIdx = 0;
        let emailIdx = 1;
        let mobileIdx = 2;
        let dietaryIdx = 3;

        const firstRowHeader = nonBlankRows[0].map((c) => String(c).toLowerCase().trim());
        const hasHeader = firstRowHeader.some(
          (h) => h.includes("name") || h.includes("email") || h.includes("mobile") || h.includes("phone")
        );

        if (hasHeader) {
          firstRowHeader.forEach((h, idx) => {
            if (h.includes("name")) nameIdx = idx;
            else if (h.includes("email")) emailIdx = idx;
            else if (h.includes("mobile") || h.includes("phone") || h.includes("contact")) mobileIdx = idx;
            else if (h.includes("diet")) dietaryIdx = idx;
          });
        }

        const dataRows = hasHeader ? nonBlankRows.slice(1) : nonBlankRows;
        inviteeCount = dataRows.length;

        parsedInvitees = dataRows.map((row, idx) => {
          const nameVal = row[nameIdx] !== undefined ? String(row[nameIdx]).trim() : (row[0] ? String(row[0]).trim() : `Invitee ${idx + 1}`);
          const emailVal = row[emailIdx] !== undefined ? String(row[emailIdx]).trim() : (row[1] ? String(row[1]).trim() : `invitee${idx + 1}@example.com`);
          const mobileVal = row[mobileIdx] !== undefined ? String(row[mobileIdx]).trim() : (row[2] ? String(row[2]).trim() : `+9190000000${idx}`);
          const dietVal = row[dietaryIdx] !== undefined ? String(row[dietaryIdx]).trim() : "Veg";

          return {
            id: `inv_${Date.now()}_${idx}`,
            name: nameVal || `Invitee ${idx + 1}`,
            email: emailVal || `invitee${idx + 1}@example.com`,
            mobile: mobileVal || `+9190000000${idx}`,
            registrationStatus: "confirmed",
            rsvpStatus: "accepted",
            dietaryPreference: dietVal,
            entry: true,
            lunch: true,
          };
        });
      }
    } catch (err) {
      console.warn("Excel parse fallback:", err);
    }

    if (parsedInvitees.length === 0) {
      inviteeCount = 0;
    }

    try {
      localStorage.setItem(`app_local_invitees_${targetEventId}`, JSON.stringify(parsedInvitees));
    } catch (e) { }

    // Update Session(s) invitee count in localStorage so session tables & badges reflect analyzed count!
    try {
      const sessKeys = [`app_local_sessions_${targetEventId}`, "app_local_sessions_1", "app_local_sessions"];
      let existingSessions: any[] = [];
      sessKeys.forEach((key) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              existingSessions = parsed;
            }
          } catch (e) { }
        }
      });

      if (existingSessions.length === 0) {
        existingSessions = [
          { id: "morning", _id: "morning", name: "Morning", title: "Morning" },
          { id: "entry", _id: "entry", name: "Session 1 - Entry Session", title: "Session 1 - Entry Session" },
          { id: "lunch", _id: "lunch", name: "Session 2 - Lunch Session", title: "Session 2 - Lunch Session" },
        ];
      }

      const updatedSessions = existingSessions.map((sess) => {
        const sessId = sess._id || sess.id;
        if (!selectedSessionId || selectedSessionId === sessId || selectedSessionId === "default" || selectedSessionId === "entry") {
          return {
            ...sess,
            invitesCount: inviteeCount,
            totalInvitees: inviteeCount,
            maxAttendees: inviteeCount,
          };
        }
        return {
          ...sess,
          invitesCount: sess.invitesCount || inviteeCount,
          totalInvitees: sess.totalInvitees || inviteeCount,
          maxAttendees: sess.maxAttendees || inviteeCount,
        };
      });

      localStorage.setItem(`app_local_sessions_${targetEventId}`, JSON.stringify(updatedSessions));
      localStorage.setItem(`app_local_sessions_1`, JSON.stringify(updatedSessions));
    } catch (e) { }

    try {
      await inviteeService.importExcel(targetEventId, uploadedFile);
    } catch (error) {
      console.warn("Import endpoint fallback warning:", error);
    } finally {
      setIsUploading(false);
      onClose();
      onUploadSuccess(parsedInvitees, targetEventId, selectedSessionId);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">Add Invitees</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
          {/* Select Event */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-800">
              Select event<span className="text-[#FF5B22] ml-0.5">*</span>
            </label>
            <CustomDropdown
              value={selectedEventId}
              onChange={(val) => setSelectedEventId(val)}
              options={eventsList.map((ev) => ({ value: ev.id, label: ev.title }))}
              placeholder="Select event"
            />
          </div>

          {/* Select Session */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-800">
              Select session<span className="text-[#FF5B22] ml-0.5">*</span>
            </label>
            <CustomDropdown
              value={selectedSessionId}
              onChange={(val) => setSelectedSessionId(val)}
              options={sessionsList.map((sess) => ({ value: sess.id, label: sess.name }))}
              placeholder="Select session"
            />
          </div>

          {/* Add Invitees List File Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-800">Add Invitees List</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xls,.xlsx,.csv"
              className="hidden"
              name="file"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-gray-200 rounded-md p-1 bg-white flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <button
                type="button"
                className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded cursor-pointer"
              >
                Choose File
              </button>
              <span className="text-xs text-gray-400 font-normal">
                {uploadedFile ? uploadedFile.name : "No file selected"}
              </span>
            </div>

            {/* Download Excel Sample */}
            <div className="flex justify-end items-center gap-1.5 pt-1 text-xs">
              <ExcelLogo className="w-4 h-4 shrink-0" />
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="font-bold text-gray-900 underline hover:text-[#FF5B22] transition-colors text-xs"
              >
                Download Excel Sample
              </a>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed pt-1">
            <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              i
            </span>
            <div className="space-y-3">
              <p>
                1. Download the sample template from the link above and enter your invitees in the same format. There are three main columns - Name, Email and Mobile. Name and Mobile are mandatory fields. All emails (if provided) must be a valid one or else the system will reject the same. All numbers must be with country code, for e.g. +91xxxxxxxxxx, without any space in between. The cell format needs to be set to Text before filling up the Mobile numbers.
              </p>
              <p>
                2. There may be additional columns if you have Sub Events added for the event. Place &apos;Y&apos; for allow and &apos;N&apos; for restricted access to the particular sub event/session for the invitee.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !uploadedFile}
              className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

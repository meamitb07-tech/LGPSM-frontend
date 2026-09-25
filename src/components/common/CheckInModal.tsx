"use client";

import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import { sessionService } from "@/services/sessionService";
import { eventService } from "@/services/eventService";
import { checkInService, CheckInResponseData } from "@/services/checkInService";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventName?: string;
  onCheckInSuccess?: (data: CheckInResponseData) => void;
}

export default function CheckInModal({
  isOpen,
  onClose,
  eventId: propEventId,
  eventName: propEventName,
  onCheckInSuccess,
}: CheckInModalProps) {
  const [activeMode, setActiveMode] = useState<"QR" | "MANUAL">("QR");

  // Event selection fallback
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(propEventId || "");
  const [selectedEventName, setSelectedEventName] = useState<string>(propEventName || "");
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);

  // Session selection
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState<boolean>(false);

  // QR mode state
  const [qrInput, setQrInput] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual mode states
  const [manualType, setManualType] = useState<"email" | "mobile">("email");
  const [manualValue, setManualValue] = useState<string>("");

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<CheckInResponseData | null>(null);

  useEffect(() => {
    if (propEventId) {
      setSelectedEventId(propEventId);
      if (propEventName) setSelectedEventName(propEventName);
    }
  }, [propEventId, propEventName]);

  // Load events list if no eventId is provided
  useEffect(() => {
    if (!isOpen) return;

    async function loadEventsList() {
      if (propEventId) return;
      setLoadingEvents(true);
      try {
        const res = await eventService.getEvents();
        if (res?.success && Array.isArray(res.data)) {
          setEvents(res.data);
          if (res.data.length > 0 && !selectedEventId) {
            const firstEv = res.data[0];
            setSelectedEventId(firstEv._id || firstEv.id);
            setSelectedEventName(firstEv.title || firstEv.name || "Selected Event");
          }
        }
      } catch (err) {
        console.error("Failed to load events for checkin modal:", err);
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEventsList();
  }, [isOpen, propEventId]);

  // Fetch real sessions when selectedEventId changes
  useEffect(() => {
    if (!isOpen || !selectedEventId) return;

    async function loadSessions() {
      setLoadingSessions(true);
      setErrorMessage(null);
      try {
        const res = await sessionService.getSessions(selectedEventId);
        if (res?.success && Array.isArray(res.data)) {
          setSessions(res.data);
          if (res.data.length > 0) {
            setSelectedSessionId(res.data[0]._id || res.data[0].id || "");
          } else {
            setSelectedSessionId("");
          }
        } else {
          setSessions([]);
          setSelectedSessionId("");
        }
      } catch (err) {
        console.error("Failed to load sessions for check-in:", err);
        setSessions([]);
      } finally {
        setLoadingSessions(false);
      }
    }

    loadSessions();
  }, [isOpen, selectedEventId]);

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQrInput("");
      setManualValue("");
      setErrorMessage(null);
      setSuccessData(null);
    }
  }, [isOpen]);

  // Image QR parser handler (e.g. uploaded invitation-qr.png)
  const handleQRFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessData(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setQrInput(code.data);
          // Auto trigger scan validation
          executeScanCheckIn(code.data);
        } else {
          setErrorMessage("Could not decode a valid QR pattern from this image file. Please upload a clear QR pass image or paste the invitation link.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const executeScanCheckIn = async (qrTokenStr: string) => {
    if (!qrTokenStr.trim()) {
      setErrorMessage("Please upload a QR pass image or paste the invitation link.");
      return;
    }

    setErrorMessage(null);
    setSuccessData(null);
    setSubmitting(true);

    try {
      const res = await checkInService.scanCheckIn({
        qrCode: qrTokenStr.trim(),
        eventId: selectedEventId || undefined,
        sessionId: selectedSessionId || undefined,
      });

      if (res.success && res.data) {
        setSuccessData(res.data);
        setQrInput("");
        if (onCheckInSuccess) onCheckInSuccess(res.data);
      } else {
        setErrorMessage(res.message || res.error || "Check-in failed: Invitee not found or unauthorized.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during check-in scan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessData(null);
    setSubmitting(true);

    try {
      if (activeMode === "QR") {
        if (!qrInput.trim()) {
          setErrorMessage("Please upload a QR pass image or paste the invitation link.");
          setSubmitting(false);
          return;
        }

        const res = await checkInService.scanCheckIn({
          qrCode: qrInput.trim(),
          eventId: selectedEventId,
          sessionId: selectedSessionId || undefined,
        });

        if (res.success && res.data) {
          setSuccessData(res.data);
          setQrInput("");
          if (onCheckInSuccess) onCheckInSuccess(res.data);
        } else {
          setErrorMessage(res.message || res.error || "Check-in failed.");
        }
      } else {
        if (!manualValue.trim()) {
          setErrorMessage(`Please enter a valid ${manualType === "email" ? "Email address" : "Mobile number"}.`);
          setSubmitting(false);
          return;
        }

        const payload: any = {
          eventId: selectedEventId,
          sessionId: selectedSessionId || undefined,
        };

        if (manualType === "email") payload.email = manualValue.trim();
        if (manualType === "mobile") payload.mobile = manualValue.trim();

        const res = await checkInService.manualCheckIn(payload);

        if (res.success && res.data) {
          setSuccessData(res.data);
          setManualValue("");
          if (onCheckInSuccess) onCheckInSuccess(res.data);
        } else {
          setErrorMessage(res.message || res.error || "Manual check-in failed.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during check-in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FF5B22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Attendee Check-In
            </h3>
            {selectedEventName && <p className="text-xs text-gray-300 mt-0.5">{selectedEventName}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer hover:bg-gray-400/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Mode Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveMode("QR");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === "QR"
                  ? "bg-white text-[#FF5B22] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>QR Code Scan</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode("MANUAL");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === "MANUAL"
                  ? "bg-white text-[#FF5B22] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Manual Entry</span>
            </button>
          </div>

          {/* Session Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
              <span>Target Session</span>
              <span className="text-[10px] text-gray-400 font-normal">Optional / Session Specific</span>
            </label>
            {loadingSessions ? (
              <div className="h-9 w-full bg-gray-100 rounded-md animate-pulse" />
            ) : (
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs text-gray-800 focus:outline-none focus:border-[#FF5B22] transition-colors"
              >
                <option value="">-- Event-Wide Check-In (No Specific Session) --</option>
                {sessions.map((s) => (
                  <option key={s._id || s.id} value={s._id || s.id}>
                    {s.name || s.title} {s.accessControl ? `(${s.accessControl})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Business Error Display */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="font-bold">Check-In Denied:</span> {errorMessage}
              </div>
            </div>
          )}

          {/* Success Result Card */}
          {successData && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2 text-xs text-emerald-900 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Check-In Verified & Saved!
                </span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  {successData.checkInMethod}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-gray-500 block">Invitee:</span>
                  <span className="font-bold text-gray-900">{successData.invitee?.name || "Attendee"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">RSVP Status:</span>
                  <span className="font-semibold text-gray-800">{successData.invitee?.rsvpStatus || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Session:</span>
                  <span className="font-semibold text-gray-800">{successData.session?.name || "Event entry"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Check-In Time:</span>
                  <span className="font-semibold text-gray-800">
                    {successData.checkInAt ? new Date(successData.checkInAt).toLocaleTimeString() : "Just now"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeMode === "QR" ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">
                  QR Code / Invitation Pass
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    placeholder="Scan QR code or paste invitation link..."
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-gray-300 rounded-md text-xs text-gray-900 focus:outline-none focus:border-[#FF5B22] transition-colors"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                {/* Upload QR Image File Option */}
                <div className="pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQRFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 bg-orange-50 hover:bg-orange-100 text-[#FF5B22] border border-orange-200 border-dashed rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Upload QR Pass Image</span>
                  </button>
                </div>

                <p className="text-[11px] text-gray-500">
                  Upload the QR pass image attached to the invitation email or paste the invitation link.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-6 items-center text-xs text-gray-700">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="manualType"
                      checked={manualType === "email"}
                      onChange={() => setManualType("email")}
                      className="text-[#FF5B22] focus:ring-[#FF5B22]"
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="manualType"
                      checked={manualType === "mobile"}
                      onChange={() => setManualType("mobile")}
                      className="text-[#FF5B22] focus:ring-[#FF5B22]"
                    />
                    <span>Mobile</span>
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    placeholder={
                      manualType === "email"
                        ? "Enter invitee email address..."
                        : "Enter invitee mobile number..."
                    }
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-xs text-gray-900 focus:outline-none focus:border-[#FF5B22] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-bold rounded-md transition-colors shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {submitting && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>Verify & Check In</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

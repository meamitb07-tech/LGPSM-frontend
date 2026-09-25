"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { inviteeService } from "@/services/inviteeService";
import { eventService } from "@/services/eventService";
import { sessionService } from "@/services/sessionService";
import CustomDropdown from "@/components/common/CustomDropdown";
import { useAlert } from "@/context/AlertContext";
import { formatPhoneNumber, isValidEmail, isValidMobile } from "@/utils/eventUtils";
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

  const [activeTab, setActiveTab] = useState<"excel" | "manual">("excel");

  const [eventsList, setEventsList] = useState<{ id: string; title: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId || "");
  const [sessionsList, setSessionsList] = useState<{ id: string; name: string }[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manual Form state (exact placeholders as table display)
  const [manualForm, setManualForm] = useState({
    name: "",
    email: "",
    mobile: "",
    companyName: "",
    dietaryPreference: "Veg",
  });

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
            if (id) combined.push({ id, title: ev.title || ev.eventName || "Untitled Event" });
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
      } catch {}

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
            name: s.name || s.title || `Session ${idx + 1}`,
          }));
          setSessionsList(mapped);
          setSelectedSessionId(mapped[0].id);
          setSelectedSessionIds(mapped.map((s: any) => s.id));
        } else {
          setSessionsList([]);
          setSelectedSessionId("");
          setSelectedSessionIds([]);
        }
      } catch {
        setSessionsList([]);
        setSelectedSessionId("");
        setSelectedSessionIds([]);
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
      setManualForm({
        name: "",
        email: "",
        mobile: "",
        companyName: "",
        dietaryPreference: "Veg",
      });
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDownloadSample = () => {
    try {
      const sampleData = [
        { Name: "Subrata Saha", Email: "subrata@example.com", Mobile: "+919876543210", "Company Name": "LGPSM Corp", "Dietary Preference": "Veg" },
        { Name: "Anita Roy", Email: "anita@example.com", Mobile: "+919876543211", "Company Name": "Tech Solutions", "Dietary Preference": "Non-Veg" },
      ];
      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Invitees");
      XLSX.writeFile(workbook, "LGPSM_Invitee_Sample_Template.xlsx");
    } catch (err) {
      console.error("Error generating sample excel:", err);
      showAlert("Could not download sample template.", "error");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      showAlert("Please select an Excel or CSV file to upload.", "warning");
      return;
    }

    const targetEventId = selectedEventId || initialEventId || "1";
    setIsSubmitting(true);

    try {
      const res = await inviteeService.importExcel(targetEventId, uploadedFile);
      if (res.success && res.data) {
        const { totalRows, imported, updated = 0, rejected, errors = [] } = res.data;
        let summaryMsg = `Processed ${totalRows} row(s): ${imported} imported`;
        if (updated > 0) summaryMsg += `, ${updated} updated`;
        if (rejected > 0) summaryMsg += `, ${rejected} rejected`;

        if (rejected > 0 && errors.length > 0) {
          const firstErrList = errors.slice(0, 3).map((err) => `Row ${err.row}: ${err.error}`).join(" | ");
          showAlert(`${summaryMsg}. Skipped rows: ${firstErrList}`, "warning");
        } else {
          showAlert(`${summaryMsg}. All rows processed successfully!`, "success");
        }

        onClose();
        onUploadSuccess(undefined, targetEventId, selectedSessionId);
      } else {
        showAlert(res.message || "Failed to process Excel import.", "error");
      }
    } catch (error: any) {
      console.error("Import endpoint error:", error);
      showAlert(error.message || "Failed to upload and validate Excel file.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = manualForm.name.trim();
    const trimmedEmail = manualForm.email.trim();
    const trimmedMobile = manualForm.mobile.trim();

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      showAlert("Invitee full name is required (2 to 100 characters).", "warning");
      return;
    }

    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      showAlert("Please enter a valid email address (e.g. user@example.com).", "warning");
      return;
    }

    if (trimmedMobile && !isValidMobile(trimmedMobile)) {
      showAlert("Please enter a valid mobile number (7 to 15 digits).", "warning");
      return;
    }

    if (!trimmedEmail && !trimmedMobile) {
      showAlert("At least one valid contact method (Email or Mobile) is required.", "warning");
      return;
    }

    const targetEventId = selectedEventId || initialEventId || "1";
    setIsSubmitting(true);

    const compName = manualForm.companyName.trim();
    const formattedMobile = trimmedMobile ? formatPhoneNumber(trimmedMobile) : "";
    const sessionAccessPayload = selectedSessionIds.map((sId) => ({ sessionId: sId, allowed: true }));

    try {
      const res = await inviteeService.createInvitee(targetEventId, {
        name: trimmedName,
        email: trimmedEmail,
        mobile: formattedMobile,
        company: compName,
        companyName: compName,
        dietaryPreference: manualForm.dietaryPreference.trim(),
        sessionAccess: sessionAccessPayload,
      });

      if (res.success) {
        showAlert(`Invitee '${trimmedName}' added successfully!`, "success");
        setManualForm({ name: "", email: "", mobile: "", companyName: "", dietaryPreference: "Veg" });
        onClose();
        onUploadSuccess(undefined, targetEventId, selectedSessionId);
      } else {
        showAlert(res.message || "Failed to create invitee.", "error");
      }
    } catch (err: any) {
      showAlert(err.message || "Failed to add invitee. Please check fields.", "error");
    } finally {
      setIsSubmitting(false);
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
        className="bg-white rounded-lg border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col my-auto"
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

        {/* Tab Switcher Bar */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 px-6 pt-3 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("excel")}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "excel"
                ? "border-[#FF5B22] text-[#FF5B22]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ExcelLogo className="w-4 h-4 shrink-0" />
            <span>Upload Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "manual"
                ? "border-[#FF5B22] text-[#FF5B22]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Add Invitee Manually</span>
          </button>
        </div>

        {/* EXCEL UPLOAD FORM */}
        {activeTab === "excel" && (
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
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="font-bold text-gray-900 underline hover:text-[#FF5B22] transition-colors text-xs cursor-pointer"
                >
                  Download Excel Sample
                </button>
              </div>
            </div>

            {/* Instructions Box */}
            <div className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed pt-1 bg-gray-50/80 p-3 rounded-md border border-gray-100">
              <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                i
              </span>
              <div className="space-y-2">
                <p>
                  1. Download the sample template from the link above and enter your invitees in the same format. Columns include: Name, Email, Mobile, Company Name, Dietary Preference.
                </p>
                <p>
                  2. All mobile numbers must include country code (e.g. +91xxxxxxxxxx). Format cells as text.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !uploadedFile}
                className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        )}

        {/* MANUAL ENTRY FORM */}
        {activeTab === "manual" && (
          <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
            {/* Grid for Event & Session */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Select Event<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <CustomDropdown
                  value={selectedEventId}
                  onChange={(val) => setSelectedEventId(val)}
                  options={eventsList.map((ev) => ({ value: ev.id, label: ev.title }))}
                  placeholder="Select event"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-800">
                    Assign Sessions<span className="text-[#FF5B22] ml-0.5">*</span>
                  </label>
                  {sessionsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedSessionIds.length === sessionsList.length) {
                          setSelectedSessionIds([]);
                        } else {
                          setSelectedSessionIds(sessionsList.map((s) => s.id));
                        }
                      }}
                      className="text-[11px] font-semibold text-[#FF5B22] hover:underline cursor-pointer"
                    >
                      {selectedSessionIds.length === sessionsList.length ? "Deselect All" : "Select All Sessions"}
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 rounded-md p-2.5 bg-gray-50/50 space-y-2 max-h-36 overflow-y-auto">
                  {sessionsList.length > 0 ? (
                    sessionsList.map((sess) => {
                      const isChecked = selectedSessionIds.includes(sess.id);
                      return (
                        <label
                          key={sess.id}
                          className="flex items-center gap-2.5 text-xs text-gray-800 font-medium cursor-pointer hover:text-gray-900 select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedSessionIds((prev) =>
                                prev.includes(sess.id) ? prev.filter((id) => id !== sess.id) : [...prev, sess.id]
                              );
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#FF5B22] focus:ring-[#FF5B22] cursor-pointer"
                          />
                          <span>{sess.name}</span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic">No sessions found for this event</p>
                  )}
                </div>
              </div>
            </div>

            {/* Invitee Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-800">
                Full Name<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                value={manualForm.name}
                onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                placeholder="e.g. Subrata Saha"
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] focus:ring-1 focus:ring-[#FF5B22]"
              />
            </div>

            {/* Email Address & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">Email Address</label>
                <input
                  type="email"
                  value={manualForm.email}
                  onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                  placeholder="e.g. invitee@company.com"
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] focus:ring-1 focus:ring-[#FF5B22]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">
                  Mobile Number<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={manualForm.mobile}
                  onChange={(e) => setManualForm({ ...manualForm, mobile: e.target.value })}
                  placeholder="e.g. +919876543210"
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] focus:ring-1 focus:ring-[#FF5B22]"
                />
              </div>
            </div>

            {/* Company Name & Dietary Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">Company Name</label>
                <input
                  type="text"
                  value={manualForm.companyName}
                  onChange={(e) => setManualForm({ ...manualForm, companyName: e.target.value })}
                  placeholder="e.g. LGPSM Global"
                  className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5B22] focus:ring-1 focus:ring-[#FF5B22]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-800">Dietary Preference</label>
                <CustomDropdown
                  value={manualForm.dietaryPreference}
                  onChange={(val) => setManualForm({ ...manualForm, dietaryPreference: val })}
                  options={[
                    { value: "Veg", label: "Vegetarian (Veg)" },
                    { value: "Non-Veg", label: "Non-Vegetarian (Non-Veg)" },
                    { value: "Jain", label: "Jain" },
                    { value: "Vegan", label: "Vegan" },
                    { value: "No Restrictions", label: "No Restrictions" },
                  ]}
                  placeholder="Select preference"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Invitee"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

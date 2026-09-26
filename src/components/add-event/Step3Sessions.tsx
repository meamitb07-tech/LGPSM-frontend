"use client";

import React from "react";
import CustomDropdown from "@/components/common/CustomDropdown";
import * as XLSX from "xlsx";
import { AccessControl, DraftErrors, DraftSession, createSessionDraft } from "./eventDraft";
import { formatDateTime } from "@/utils/dateTime";
import { downloadInviteeTemplate } from "@/utils/inviteeTemplate";

// Invitee sheets are kept in memory only (they contain guest contact details and a File object)
export interface InviteeRow {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface SessionInviteeFile {
  file: File;
  name: string;
  inviteesList: InviteeRow[];
  // True once rows were edited in the preview; edited rows are submitted individually
  edited?: boolean;
}

interface Step3SessionsProps {
  sessions: DraftSession[];
  onSessionsChange: (sessions: DraftSession[]) => void;
  sessionFiles: Record<string, SessionInviteeFile | undefined>;
  onSessionFileChange: (sessionKey: string, file: SessionInviteeFile | null) => void;
  skipInvitees: boolean;
  onSkipInviteesChange: (value: boolean) => void;
  eventStart: string;
  eventEnd: string;
  errors: DraftErrors;
  onOpenSessionPicker: (sessionKey: string, field: "start" | "end") => void;
  onOpenInviteesPreview: (sessionName: string, inviteesList?: InviteeRow[]) => void;
  onFinish: () => void;
  onBack: () => void;
  submitting?: boolean;
  submitLabel?: string;
}

const ACCESS_OPTIONS: { value: AccessControl; label: string }[] = [
  { value: "NO_RESTRICTION", label: "No Restrictions" },
  { value: "ONLY_ONCE", label: "Only Once" },
];

/* Exact Microsoft Excel Logo component matching images #4 & #5 */
function ExcelLogo({ className = "w-4 h-4 shrink-0" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 3H27C28.1046 3 29 3.89543 29 5V27C29 28.1046 28.1046 29 27 29H18V3Z"
        fill="#107C41"
      />
      <path d="M18 9.5H27M18 14.5H27M18 19.5H27M18 24.5H27" stroke="#339966" strokeWidth="1" />
      <path d="M22.5 3V29" stroke="#339966" strokeWidth="1" />
      <path
        d="M5 5C5 3.89543 5.89543 3 7 3H18V29H7C5.89543 29 5 28.1046 5 27V5Z"
        fill="#1F7244"
      />
      <path
        d="M9.5 10.5L12.3 16L9.5 21.5H11.8L13.4 18.2L15 21.5H17.3L14.5 16L17.3 10.5H15L13.4 13.8L11.8 10.5H9.5Z"
        fill="white"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

// Controlled step: sessions live in the wizard draft owned by the page
export default function Step3Sessions({
  sessions,
  onSessionsChange,
  sessionFiles,
  onSessionFileChange,
  skipInvitees,
  onSkipInviteesChange,
  eventStart,
  eventEnd,
  errors,
  onOpenSessionPicker,
  onOpenInviteesPreview,
  onFinish,
  onBack,
  submitting = false,
  submitLabel = "Save",
}: Step3SessionsProps) {
  const updateSession = (key: string, patch: Partial<DraftSession>) => {
    onSessionsChange(sessions.map((s) => (s.key === key ? { ...s, ...patch } : s)));
  };

  const handleAddSession = () => {
    onSessionsChange([...sessions, createSessionDraft(`Session ${sessions.length + 1}`, eventStart, eventEnd)]);
  };

  // Only sessions that do not exist on the server yet can be removed here
  const handleRemoveSession = (key: string) => {
    onSessionsChange(sessions.filter((s) => s.key !== key));
    onSessionFileChange(key, null);
  };

  const handleFileUpload = async (session: DraftSession, file: File) => {
    let inviteesList: SessionInviteeFile["inviteesList"] = [];
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });

      let rows = rawRows.filter(
        (r) => r && Array.isArray(r) && r.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== "")
      );

      if (rows.length > 0) {
        const firstRowStr = rows[0].map((c) => String(c).toLowerCase()).join(" ");
        if (firstRowStr.includes("name") || firstRowStr.includes("email") || firstRowStr.includes("mobile") || firstRowStr.includes("phone")) {
          rows = rows.slice(1);
        }
      }

      // Preview only what the file contains; the backend import validates each row
      inviteesList = rows.map((row, idx) => ({
        id: String(idx + 1).padStart(2, "0"),
        name: row[0] ? String(row[0]).trim() : "",
        email: row[1] ? String(row[1]).trim() : "",
        phone: row[2] ? String(row[2]).trim() : "",
      }));
    } catch (e) {
      console.warn("Excel parse warning in Step3Sessions:", e);
    }

    onSessionFileChange(session.key, { file, name: file.name, inviteesList });
    if (inviteesList.length > 0) onSkipInviteesChange(false);
    onOpenInviteesPreview(session.name, inviteesList);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 font-sans text-xs">
      {sessions.map((sess) => {
        const fileInfo = sessionFiles[sess.key];
        const timeError = errors[`session:${sess.key}:time`];
        const nameError = errors[`session:${sess.key}:name`];
        return (
          <div key={sess.key} className="p-5 border border-gray-200 rounded-md bg-white space-y-4 shadow-2xs">
            {/* Session Name Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5 gap-2">
                <label className="font-bold text-gray-900 text-xs">
                  Session Name<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                {!sess.backendId && sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSession(sess.key)}
                    className="text-[#FF5B22] hover:underline font-semibold text-[11px] cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                maxLength={100}
                value={sess.name}
                onChange={(e) => updateSession(sess.key, { name: e.target.value })}
                placeholder="Entry Session"
                className={`w-full px-3.5 py-2.5 bg-[#F9FAFB] border rounded-md text-gray-900 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] ${nameError ? "border-rose-400" : "border-gray-200"}`}
              />
              {nameError && <p className="mt-1 text-[11px] font-medium text-rose-600">{nameError}</p>}
            </div>

            {/* Consider validation checkbox */}
            <label
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => updateSession(sess.key, { validateAgainstOtherSessions: !sess.validateAgainstOtherSessions })}
            >
              <div
                role="checkbox"
                aria-checked={sess.validateAgainstOtherSessions}
                className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
                  sess.validateAgainstOtherSessions ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white border border-gray-300 text-transparent"
                }`}
              >
                <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-400 font-medium text-xs">
                Consider Access session validation on other session access
              </span>
            </label>

            {/* Start / End Time & Access Control Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["start", "end"] as const).map((field) => (
                <div key={field} className="min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-gray-900 text-xs">
                      {field === "start" ? "Start Time" : "End Time"}
                      <span className="text-[#FF5B22] ml-0.5">*</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenSessionPicker(sess.key, field)}
                    className={`w-full px-3 py-2.5 bg-[#F9FAFB] border rounded-md text-gray-900 font-medium text-xs flex items-center justify-between gap-2 text-left hover:bg-gray-100/70 cursor-pointer ${timeError ? "border-rose-400" : "border-gray-200"}`}
                  >
                    <span className="truncate">{formatDateTime(field === "start" ? sess.start : sess.end, "Select date and time")}</span>
                    <CalendarIcon />
                  </button>
                </div>
              ))}

              <div className="min-w-0">
                <div className="flex items-center justify-between mb-1.5 relative">
                  <label className="font-bold text-gray-900 text-xs">
                    Access Control<span className="text-[#FF5B22] ml-0.5">*</span>
                  </label>
                  <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 cursor-pointer relative group">
                    i
                    <span className="hidden group-hover:block absolute right-0 top-6 z-40 bg-[#1E232A] text-white text-[11px] p-2.5 rounded-md shadow-xl w-52 text-left font-normal leading-tight pointer-events-none">
                      If the invitees are allowed access to the Session any number of times, set No Restrictions.
                    </span>
                  </span>
                </div>
                <CustomDropdown
                  value={sess.accessControl}
                  onChange={(val) => updateSession(sess.key, { accessControl: val as AccessControl })}
                  options={ACCESS_OPTIONS}
                  placeholder="Access Control"
                />
              </div>
            </div>
            {timeError && <p className="-mt-2 text-[11px] font-medium text-rose-600">{timeError}</p>}
            {sess.timesLinked && (
              <p className="-mt-2 text-[10px] text-gray-400 font-medium">Follows the event start and end until you change it.</p>
            )}

            {/* Add Invitees List Zone */}
            <div>
              <label className="block font-bold text-gray-900 text-xs mb-1.5">
                Add Invitees List
              </label>

              <div className="flex items-center bg-[#F9FAFB] border border-gray-200 rounded-md overflow-hidden p-1 min-w-0">
                <label className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-md cursor-pointer transition-colors shrink-0">
                  Choose File
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(sess, file);
                      e.target.value = "";
                    }}
                  />
                </label>

                <div className="flex-1 px-3 flex items-center justify-between min-w-0">
                  {fileInfo ? (
                    <button
                      type="button"
                      onClick={() => onOpenInviteesPreview(sess.name, fileInfo.inviteesList)}
                      className="flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-[#FF5B22] cursor-pointer min-w-0"
                    >
                      <ExcelLogo className="w-4 h-4 shrink-0" />
                      <span className="truncate" title={fileInfo.name}>
                        {fileInfo.name} ({fileInfo.inviteesList.length} invitees)
                      </span>
                    </button>
                  ) : (
                    <span className="text-gray-400 font-medium text-xs">No file chosen</span>
                  )}

                  {fileInfo && (
                    <button
                      type="button"
                      onClick={() => onSessionFileChange(sess.key, null)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer shrink-0"
                      title="Remove file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-[10px] text-gray-400 font-medium">
                Invitees from the sheet are imported into this event when you save. Files are not kept in the saved draft.
              </p>

              {/* Download Sample Link */}
              <div className="flex justify-end items-center gap-1.5 mt-2 text-xs">
                <ExcelLogo className="w-4 h-4 shrink-0" />
                <button
                  type="button"
                  onClick={() => downloadInviteeTemplate()}
                  className="font-bold text-gray-900 underline hover:text-[#FF5B22] transition-colors text-xs cursor-pointer"
                >
                  Download Excel Sample
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* + Add Sessions */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleAddSession}
          className="px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
        >
          <span className="text-sm font-semibold">+</span> Add Sessions
        </button>
      </div>

      {/* Bottom Checkbox */}
      <div className="pt-2 flex items-center justify-end">
        <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onSkipInviteesChange(!skipInvitees)}>
          <div
            role="checkbox"
            aria-checked={skipInvitees}
            className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
              skipInvitees ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white border border-gray-300 text-transparent"
            }`}
          >
            <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-400">
            I don&apos;t have any invitees list yet, skip for later
          </span>
        </label>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold text-xs rounded-md transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-7 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-md shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

"use client";

import React, { useState } from "react";
import CustomDropdown from "@/components/common/CustomDropdown";
import * as XLSX from "xlsx";

interface SessionData {
  id: string;
  name: string;
  considerValidation: boolean;
  startTime: string;
  endTime: string;
  accessControl: string;
  uploadedFileName?: string;
  uploadedFile?: File;
  inviteesCount?: number;
  inviteesList?: any[];
  keepSameInviteesAs?: string;
}

interface Step3SessionsProps {
  onFinish: (sessions?: SessionData[]) => void;
  onBack: () => void;
  onOpenInviteesPreview: (sessionName: string, inviteesList?: any[]) => void;
  onOpenDatePicker: (field: "start" | "end" | "rsvp", callback?: (val: string) => void) => void;
  startDate?: string;
  endDate?: string;
}

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

function getFormattedCurrentDateTime(offsetHours: number = 0): string {
  const date = new Date(Date.now() + offsetHours * 3600 * 1000);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hh = String(hours).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}.${minutes} ${ampm}`;
}

export default function Step3Sessions({
  onFinish,
  onBack,
  onOpenInviteesPreview,
  onOpenDatePicker,
  startDate,
  endDate,
}: Step3SessionsProps) {
  const [sessions, setSessions] = useState<SessionData[]>([
    {
      id: "1",
      name: "Entry Session",
      considerValidation: false,
      startTime: startDate || getFormattedCurrentDateTime(0),
      endTime: endDate || getFormattedCurrentDateTime(0),
      accessControl: "No Restrictions",
      uploadedFileName: undefined,
    },
    {
      id: "2",
      name: "Lunch Session",
      considerValidation: false,
      startTime: startDate || getFormattedCurrentDateTime(0),
      endTime: endDate || getFormattedCurrentDateTime(0),
      accessControl: "Only Once",
      uploadedFileName: undefined,
      keepSameInviteesAs: "-select-",
    },
  ]);

  React.useEffect(() => {
    if (startDate || endDate) {
      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          startTime: startDate || s.startTime,
          endTime: endDate || s.endTime,
        }))
      );
    }
  }, [startDate, endDate]);

  const handlePickSessionDate = (sessionId: string, field: "start" | "end") => {
    onOpenDatePicker(field, (newVal: string) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, [field === "start" ? "startTime" : "endTime"]: newVal } : s))
      );
    });
  };

  const [skipInvitees, setSkipInvitees] = useState(true); // Pre-checked as shown in image #5

  const handleAddSession = () => {
    const newId = `${sessions.length + 1}`;
    setSessions([
      ...sessions,
      {
        id: newId,
        name: `Session ${newId}`,
        considerValidation: false,
        startTime: startDate || getFormattedCurrentDateTime(0),
        endTime: endDate || getFormattedCurrentDateTime(4),
        accessControl: "No Restrictions",
      },
    ]);
  };

  const handleRemoveFile = (id: string) => {
    setSessions(
      sessions.map((s) => (s.id === id ? { ...s, uploadedFileName: undefined, uploadedFile: undefined, inviteesList: undefined, inviteesCount: undefined } : s))
    );
  };

  const handleFileUpload = async (id: string, file: File) => {
    let count = 0;
    let inviteesList: any[] = [];
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

      let rows = rawRows.filter(
        (r) => r && Array.isArray(r) && r.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== "")
      );

      if (rows.length > 0) {
        const firstRowStr = rows[0].map((c) => String(c).toLowerCase()).join(" ");
        if (firstRowStr.includes("name") || firstRowStr.includes("email") || firstRowStr.includes("mobile") || firstRowStr.includes("phone")) {
          rows = rows.slice(1);
        }
      }

      count = rows.length;
      if (rows.length > 0) {
        // Preview only what the file contains; the backend import validates each row
        inviteesList = rows.map((row, idx) => ({
          id: String(idx + 1).padStart(2, "0"),
          name: row[0] ? String(row[0]).trim() : "",
          email: row[1] ? String(row[1]).trim() : "",
          phone: row[2] ? String(row[2]).trim() : "",
        }));
      }
    } catch (e) {
      console.warn("Excel parse warning in Step3Sessions:", e);
    }

    if (inviteesList.length === 0) {
      count = 0;
    }

    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, uploadedFileName: file.name, uploadedFile: file, inviteesCount: count, inviteesList } : s))
    );

    try {
      localStorage.setItem("app_local_invitees_draft", JSON.stringify(inviteesList));
      localStorage.setItem("app_local_invitees_1", JSON.stringify(inviteesList));
    } catch (e) {}

    const matchedSess = sessions.find((s) => s.id === id);
    const sessionName = matchedSess ? matchedSess.name : "Session 1 - Entry Session";
    onOpenInviteesPreview(sessionName, inviteesList);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish(sessions);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 font-sans text-xs">
      {sessions.map((sess, idx) => (
        <div key={sess.id} className="p-5 border border-gray-200 rounded-md bg-white space-y-4 shadow-2xs">
          {/* Session Name Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-gray-900 text-xs">
                Session Name<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                i
              </span>
            </div>
            <input
              type="text"
              required
              value={sess.name}
              onChange={(e) => {
                const val = e.target.value;
                setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, name: val } : s)));
              }}
              placeholder="Entry Session"
              className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-gray-900 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22]"
            />
          </div>

          {/* Consider validation checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => {
                const val = !sess.considerValidation;
                setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, considerValidation: val } : s)));
              }}
              className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
                sess.considerValidation ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white border border-gray-300 text-transparent"
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
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-900 text-xs">
                  Start Time<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                  i
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={sess.startTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, startTime: val } : s)));
                  }}
                  className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-gray-900 font-medium text-xs focus:outline-none focus:border-[#FF5B22] pr-8"
                />
                <svg
                  onClick={() => handlePickSessionDate(sess.id, "start")}
                  className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#FF5B22] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-900 text-xs">
                  End Time<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                  i
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={sess.endTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, endTime: val } : s)));
                  }}
                  className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-gray-900 font-medium text-xs focus:outline-none focus:border-[#FF5B22] pr-8"
                />
                <svg
                  onClick={() => handlePickSessionDate(sess.id, "end")}
                  className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#FF5B22] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div>
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
                onChange={(val) => {
                  setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, accessControl: val } : s)));
                }}
                options={[
                  { value: "No Restrictions", label: "No Restrictions" },
                  { value: "Only Once", label: "Only Once" },
                  { value: "Multiple Entry", label: "Multiple Entry" },
                ]}
                placeholder="Access Control"
              />
            </div>
          </div>

          {/* If Session 2+, option to keep same invitees (matching images #4 & #5) */}
          {idx > 0 && (
            <div className="flex items-center gap-2.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => {
                    const checked = !sess.keepSameInviteesAs;
                    setSessions(
                      sessions.map((s) =>
                        s.id === sess.id
                          ? { ...s, keepSameInviteesAs: checked ? "-select-" : undefined }
                          : s
                      )
                    );
                  }}
                  className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
                    sess.keepSameInviteesAs ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white border border-gray-300 text-transparent"
                  }`}
                >
                  <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-500">Keep same invitees as</span>
              </label>

              <div className="w-36">
                <CustomDropdown
                  value={sess.keepSameInviteesAs || "-select-"}
                  onChange={(val) => {
                    setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, keepSameInviteesAs: val } : s)));
                  }}
                  options={[
                    { value: "-select-", label: "-select-" },
                    { value: "Session 1", label: "Session 1" },
                  ]}
                  placeholder="-select-"
                />
              </div>
            </div>
          )}

          {/* Add Invitees List Zone */}
          <div>
            <label className="block font-bold text-gray-900 text-xs mb-1.5">
              Add Invitees List
            </label>

            <div className="flex items-center bg-[#F9FAFB] border border-gray-200 rounded-md overflow-hidden p-1">
              <label className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-md cursor-pointer transition-colors shrink-0">
                Choose File
                <input
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(sess.id, file);
                  }}
                />
              </label>

              <div className="flex-1 px-3 flex items-center justify-between">
                {sess.uploadedFileName ? (
                  <button
                    type="button"
                    onClick={() => onOpenInviteesPreview(sess.name, sess.inviteesList)}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-[#FF5B22] cursor-pointer"
                  >
                    <ExcelLogo className="w-4 h-4 shrink-0" />
                    <span className="truncate max-w-[220px]" title={sess.uploadedFileName}>{sess.uploadedFileName} ({sess.inviteesCount ?? sess.inviteesList?.length ?? 0} invitees)</span>
                  </button>
                ) : (
                  <span className="text-gray-400 font-medium text-xs">No file chosen</span>
                )}

                {sess.uploadedFileName && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(sess.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                    title="Remove file"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Download Sample Link */}
            <div className="flex justify-end items-center gap-1.5 mt-2 text-xs">
              <ExcelLogo className="w-4 h-4 shrink-0" />
              <a
                href="#"
                className="font-bold text-gray-900 underline hover:text-[#FF5B22] transition-colors text-xs"
              >
                Download Excel Sample
              </a>
              <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ml-0.5">
                i
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* + Add Sessions & Delete Sessions Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleAddSession}
          className="px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
        >
          <span className="text-sm font-semibold">+</span> Add Sessions
        </button>

        {sessions.length > 1 && (
          <button
            type="button"
            onClick={() => setSessions(sessions.slice(0, -1))}
            className="text-[#FF5B22] hover:underline font-semibold text-xs cursor-pointer"
          >
            Delete Sessions
          </button>
        )}
      </div>

      {/* Bottom Checkbox (Image #5: Checked green box) */}
      <div className="pt-2 flex items-center justify-end">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setSkipInvitees(!skipInvitees)}
            className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
              skipInvitees ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white border border-gray-300 text-transparent"
            }`}
          >
            <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-400">
            I don&apos;t have have any invitees list yet, skip for later
          </span>
        </label>
      </div>

      {/* Bottom Footer Actions (Image #4 & #5: Finish orange button) */}
      <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold text-xs rounded-md transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-7 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-md shadow-xs transition-all cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );
}

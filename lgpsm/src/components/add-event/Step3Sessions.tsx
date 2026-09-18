"use client";

import React, { useState } from "react";

interface SessionData {
  id: string;
  name: string;
  considerValidation: boolean;
  startTime: string;
  endTime: string;
  accessControl: string;
  uploadedFileName?: string;
  keepSameInviteesAs?: string;
}

interface Step3SessionsProps {
  onFinish: () => void;
  onBack: () => void;
  onOpenInviteesPreview: (sessionName: string) => void;
  onOpenDatePicker: (field: "start" | "end" | "rsvp") => void;
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

export default function Step3Sessions({
  onFinish,
  onBack,
  onOpenInviteesPreview,
  onOpenDatePicker,
}: Step3SessionsProps) {
  const [sessions, setSessions] = useState<SessionData[]>([
    {
      id: "1",
      name: "Entry Session",
      considerValidation: false,
      startTime: "05/01/26 10:00 AM",
      endTime: "05/01/26 04:30 PM",
      accessControl: "No Restrictions",
      uploadedFileName: "All-Invitees.XLS",
    },
    {
      id: "2",
      name: "Lunch Session",
      considerValidation: false,
      startTime: "05/01/26 10:00 AM",
      endTime: "05/01/26 04:30 PM",
      accessControl: "Only Once",
      uploadedFileName: "Invitees-Lunch.XLS",
      keepSameInviteesAs: "-select-",
    },
  ]);

  const [skipInvitees, setSkipInvitees] = useState(true); // Pre-checked as shown in image #5

  const handleAddSession = () => {
    const newId = `${sessions.length + 1}`;
    setSessions([
      ...sessions,
      {
        id: newId,
        name: `Session ${newId}`,
        considerValidation: false,
        startTime: "05/01/26 10:00 AM",
        endTime: "05/01/26 04:30 PM",
        accessControl: "No Restrictions",
      },
    ]);
  };

  const handleRemoveFile = (id: string) => {
    setSessions(
      sessions.map((s) => (s.id === id ? { ...s, uploadedFileName: undefined } : s))
    );
  };

  const handleFileUpload = (id: string, fileName: string) => {
    setSessions(
      sessions.map((s) => (s.id === id ? { ...s, uploadedFileName: fileName } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish();
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
              <button
                type="button"
                onClick={() => onOpenDatePicker("start")}
                className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-gray-700 text-xs font-medium flex items-center justify-between text-left cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span>{sess.startTime}</span>
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
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
              <button
                type="button"
                onClick={() => onOpenDatePicker("end")}
                className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-gray-700 text-xs font-medium flex items-center justify-between text-left cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span>{sess.endTime}</span>
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-900 text-xs">
                  Access Control<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                  i
                </span>
              </div>
              <select
                value={sess.accessControl}
                onChange={(e) => {
                  const val = e.target.value;
                  setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, accessControl: val } : s)));
                }}
                className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-gray-900 font-medium text-xs focus:outline-none cursor-pointer"
              >
                <option value="No Restrictions">No Restrictions</option>
                <option value="Only Once">Only Once</option>
                <option value="Multiple Entry">Multiple Entry</option>
              </select>
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

              <select
                value={sess.keepSameInviteesAs || "-select-"}
                onChange={(e) => {
                  const val = e.target.value;
                  setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, keepSameInviteesAs: val } : s)));
                }}
                className="px-2.5 py-1 bg-[#F9FAFB] border border-gray-200 rounded-md text-xs font-semibold text-gray-500 cursor-pointer"
              >
                <option value="-select-">-select-</option>
                <option value="Session 1">Session 1</option>
              </select>
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
                    if (file) handleFileUpload(sess.id, file.name);
                  }}
                />
              </label>

              <div className="flex-1 px-3 flex items-center justify-between">
                {sess.uploadedFileName ? (
                  <button
                    type="button"
                    onClick={() => onOpenInviteesPreview(sess.name)}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-[#FF5B22] cursor-pointer"
                  >
                    <ExcelLogo className="w-4 h-4 shrink-0" />
                    <span>{sess.uploadedFileName}</span>
                  </button>
                ) : (
                  <span className="text-gray-400 font-medium text-xs">No file choosn</span>
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

      {/* + Add Sessions Button */}
      <div>
        <button
          type="button"
          onClick={handleAddSession}
          className="px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="text-sm font-semibold">+</span> Add Sessions
        </button>
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
      <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
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
          Finish
        </button>
      </div>
    </form>
  );
}

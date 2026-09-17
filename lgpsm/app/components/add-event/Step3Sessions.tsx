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

function ExcelLogo({ className = "w-5 h-5 shrink-0" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background/Base Grid Container */}
      <path
        d="M26 8H38.5C39.8807 8 41 9.11929 41 10.5V37.5C41 38.8807 39.8807 40 38.5 40H26V8Z"
        fill="#185C37"
      />
      {/* Spreadsheet Grid Lines */}
      <path d="M26 14.5H41M26 21H41M26 27.5H41M26 34H41" stroke="#21A366" strokeWidth="1.5" />
      <path d="M33.5 8V40" stroke="#21A366" strokeWidth="1.5" />

      {/* White Cell Fill Accents */}
      <rect x="27.5" y="9.5" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="35" y="9.5" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="27.5" y="16" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="35" y="16" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="27.5" y="22.5" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="35" y="22.5" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="27.5" y="29" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="35" y="29" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="27.5" y="35.5" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="35" y="35.5" width="4.5" height="3.5" fill="#FFFFFF" fillOpacity="0.8" />

      {/* Main Left Box with Green Brand Fill */}
      <path
        d="M7 10.5C7 9.11929 8.11929 8 9.5 8H26.5C27.8807 8 29 9.11929 29 10.5V37.5C29 38.8807 27.8807 40 26.5 40H9.5C8.11929 40 7 38.8807 7 37.5V10.5Z"
        fill="#107C41"
      />
      {/* Distinctive White 'X' Logo Mark */}
      <path
        d="M13.2 16H16.4L18.6 21.6L20.8 16H24L20.3 23.9L24.5 32H21.3L18.6 26.2L15.9 32H12.7L16.9 23.9L13.2 16Z"
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
      keepSameInviteesAs: "Session 1",
    },
  ]);

  const [skipInvitees, setSkipInvitees] = useState(false);

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
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 font-[family-name:var(--font-space-grotesk)] text-xs">
      {sessions.map((sess, idx) => (
        <div key={sess.id} className="p-5 border border-gray-200 rounded-xl bg-white space-y-4 shadow-2xs">
          {/* Session Name Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-gray-900">
                Session Name<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">
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
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:bg-white"
            />
          </div>

          {/* Consider validation checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sess.considerValidation}
              onChange={(e) => {
                const val = e.target.checked;
                setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, considerValidation: val } : s)));
              }}
              className="w-4 h-4 text-[#FF5B22] rounded border-gray-300 focus:ring-0 cursor-pointer"
            />
            <span className="text-gray-600 font-medium">Consider Access session validation on other session access</span>
          </label>

          {/* Start / End Time & Access Control Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-gray-900">
                  Start Time<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">i</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenDatePicker("start")}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium flex items-center justify-between text-left cursor-pointer"
              >
                <span>{sess.startTime}</span>
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-gray-900">
                  End Time<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">i</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenDatePicker("end")}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium flex items-center justify-between text-left cursor-pointer"
              >
                <span>{sess.endTime}</span>
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-gray-900">
                  Access Control<span className="text-[#FF5B22] ml-0.5">*</span>
                </label>
                <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">i</span>
              </div>
              <select
                value={sess.accessControl}
                onChange={(e) => {
                  const val = e.target.value;
                  setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, accessControl: val } : s)));
                }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none"
              >
                <option value="No Restrictions">No Restrictions</option>
                <option value="Only Once">Only Once</option>
                <option value="Multiple Entry">Multiple Entry</option>
              </select>
            </div>
          </div>

          {/* If Session 2+, option to keep same invitees */}
          {idx > 0 && (
            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(sess.keepSameInviteesAs)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSessions(
                      sessions.map((s) =>
                        s.id === sess.id
                          ? { ...s, keepSameInviteesAs: checked ? "Session 1" : undefined }
                          : s
                      )
                    );
                  }}
                  className="w-4 h-4 text-[#FF5B22] rounded border-gray-300 focus:ring-0 cursor-pointer"
                />
                <span className="font-medium text-gray-700">Keep same invitees as</span>
              </label>

              <select
                value={sess.keepSameInviteesAs || "-select-"}
                onChange={(e) => {
                  const val = e.target.value;
                  setSessions(sessions.map((s) => (s.id === sess.id ? { ...s, keepSameInviteesAs: val } : s)));
                }}
                className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold text-gray-700"
              >
                <option value="-select-">-select-</option>
                <option value="Session 1">Session 1</option>
              </select>
            </div>
          )}

          {/* Add Invitees List Zone */}
          <div>
            <label className="block font-semibold text-gray-900 mb-1">Add Invitees List</label>

            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden p-1">
              <label className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-md cursor-pointer transition-colors shrink-0">
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
                    className="flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    <ExcelLogo className="w-5 h-5 shrink-0" />
                    <span>{sess.uploadedFileName}</span>
                  </button>
                ) : (
                  <span className="text-gray-400 font-medium">No file chosen</span>
                )}

                {sess.uploadedFileName && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(sess.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                    title="Remove file"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Download Sample Link */}
            <div className="flex justify-end items-center gap-1.5 mt-1.5 text-[11px]">
              <ExcelLogo className="w-5 h-5 shrink-0" />
              <a href="#" className="font-semibold text-gray-900 underline hover:text-[#FF5B22] transition-colors">
                Download Excel Sample
              </a>
              <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold ml-0.5">
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
          className="px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="text-base font-normal">+</span> Add Sessions
        </button>
      </div>

      {/* Bottom Checkbox */}
      <div className="pt-2 flex items-center justify-end">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={skipInvitees}
            onChange={(e) => setSkipInvitees(e.target.checked)}
            className="w-4 h-4 text-[#FF5B22] rounded border-gray-300 focus:ring-0 cursor-pointer"
          />
          <span className="text-xs font-semibold text-gray-600">
            I don&apos;t have any Invitees list yet, skip for later
          </span>
        </label>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer"
        >
          Finish
        </button>
      </div>
    </form>
  );
}

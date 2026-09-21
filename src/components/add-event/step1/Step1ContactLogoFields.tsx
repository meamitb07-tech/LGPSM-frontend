"use client";

import React, { useRef } from "react";

interface Step1ContactLogoFieldsProps {
  contactNumber: string;
  setContactNumber: (val: string) => void;
  logoFile: { name: string; url: string } | null;
  setLogoFile: (val: { name: string; url: string } | null) => void;
  enableRsvp: boolean;
  setEnableRsvp: (val: boolean) => void;
  rsvpDate: string;
  onOpenDatePicker: (field: "start" | "end" | "rsvp") => void;
  address: string;
  setAddress: (val: string) => void;
}

export default function Step1ContactLogoFields({
  contactNumber,
  setContactNumber,
  logoFile,
  setLogoFile,
  enableRsvp,
  setEnableRsvp,
  rsvpDate,
  onOpenDatePicker,
  address,
  setAddress,
}: Step1ContactLogoFieldsProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoSelect = (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoFile({ name: file.name, url });
    }
  };

  return (
    <>
      {/* Contact Number & Logo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-gray-900 mb-1">
            Contact Number<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          <div className="flex items-center bg-white border border-gray-200/90 rounded-md overflow-hidden">
            <span className="px-3 text-gray-500 font-medium border-r border-gray-200">+91</span>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter Number"
              className="w-full px-3 py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none font-medium"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-gray-900">
              Event Logo/image<span className="text-[#FF5B22] ml-0.5">*</span>
            </label>
          </div>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoSelect(file);
            }}
          />

          {logoFile ? (
            <div className="p-2.5 border border-emerald-200 rounded-md bg-emerald-50/50 flex items-center justify-between min-h-[76px]">
              <div className="flex items-center gap-3 overflow-hidden">
                {logoFile.url.startsWith("blob:") || logoFile.url.startsWith("data:") ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 border border-emerald-300">
                    <img src={logoFile.url} alt="Logo preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <span className="text-xs font-semibold text-emerald-900 truncate max-w-[150px]">
                  {logoFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLogoFile(null)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => logoInputRef.current?.click()}
              className="p-4 border-2 border-dashed border-gray-200 rounded-md bg-white text-center flex items-center justify-center min-h-[76px] hover:border-[#FF5B22] transition-colors cursor-pointer select-none"
            >
              <p className="text-[11px] text-gray-400 font-medium">
                Drag and drop a photo here or <br />
                <span className="text-[#FF5B22] font-semibold underline">click to open file</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RSVP Box */}
      <div className="p-4 border border-gray-200/90 rounded-md bg-white space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enableRsvp}
              onChange={(e) => setEnableRsvp(e.target.checked)}
              className="w-4 h-4 text-[#FF5B22] rounded border-gray-300 focus:ring-0 cursor-pointer"
            />
            <span className="font-semibold text-gray-900">
              Event RSVP Acceptance<span className="text-[#FF5B22] ml-0.5">*</span>
            </span>
          </div>
        </label>

        {enableRsvp && (
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              Acceptance Last Date<span className="text-[#FF5B22] ml-0.5">*</span>
            </label>
            <button
              type="button"
              onClick={() => onOpenDatePicker("rsvp")}
              className="w-full max-w-xs px-3.5 py-2 bg-white border border-gray-200 rounded-md text-gray-900 font-medium flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors cursor-pointer"
            >
              <span className={rsvpDate ? "text-gray-900 font-semibold" : "text-gray-400"}>
                {rsvpDate || "Select end date and time"}
              </span>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Address Field */}
      <div>
        <label className="block font-semibold text-gray-900 mb-1">
          Event Address<span className="text-[#FF5B22] ml-0.5">*</span>
        </label>
        <div className="flex items-center bg-white border border-gray-200/90 rounded-md p-1">
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Event Address"
            className="w-full px-3 py-1.5 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none font-medium"
          />
          <button
            type="button"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Verify
          </button>
        </div>
      </div>
    </>
  );
}

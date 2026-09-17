"use client";

import React, { useState } from "react";

interface Step1EventDetailsProps {
  onNext: () => void;
  onOpenDatePicker: (field: "start" | "end" | "rsvp") => void;
  startDate: string;
  endDate: string;
  rsvpDate: string;
}

export default function Step1EventDetails({
  onNext,
  onOpenDatePicker,
  startDate,
  endDate,
  rsvpDate,
}: Step1EventDetailsProps) {
  const [title, setTitle] = useState("Sharmistha Birthday Event 2026");
  const [description, setDescription] = useState(
    "Eg: Join us for an unforgettable event filled with celebration, connection, and memorable moments."
  );
  const [category, setCategory] = useState("Personal");
  const [subcategory, setSubcategory] = useState("Birthday");
  const [contactNumber, setContactNumber] = useState("");
  const [enableRsvp, setEnableRsvp] = useState(true);
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 font-[family-name:var(--font-space-grotesk)] text-xs">
      {/* Title Field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="font-semibold text-gray-900">
            Title<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          <span className="text-[10px] text-gray-400 font-medium">50 Chars remaining</span>
        </div>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sharmistha Birthday Event 2026"
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 font-medium"
        />
      </div>

      {/* Description Field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="font-semibold text-gray-900">
            Description<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          <span className="text-[10px] text-gray-400 font-medium">10 Chars remaining</span>
        </div>
        <textarea
          rows={3}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Eg: Join us for an unforgettable event filled with celebration..."
          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 font-medium leading-relaxed"
        />
      </div>

      {/* Category & Subcategory Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-gray-900 mb-1">
            Event Category<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none"
          >
            <option value="Personal">Personal</option>
            <option value="Corporate">Corporate</option>
            <option value="Wedding">Wedding</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-1">
            Event Subcategory<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none"
          >
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Party">Party</option>
          </select>
        </div>
      </div>

      {/* Start Date & End Date Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-gray-900 mb-1">
            Event Start Date Time<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          <button
            type="button"
            onClick={() => onOpenDatePicker("start")}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors cursor-pointer"
          >
            <span className={startDate ? "text-gray-900 font-semibold" : "text-gray-400"}>
              {startDate || "Select start date and time"}
            </span>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-1">
            Event End Date Time<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          <button
            type="button"
            onClick={() => onOpenDatePicker("end")}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors cursor-pointer"
          >
            <span className={endDate ? "text-gray-900 font-semibold" : "text-gray-400"}>
              {endDate || "Select end date and time"}
            </span>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contact Number & RSVP Acceptance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Number */}
        <div>
          <label className="block font-semibold text-gray-900 mb-1">
            Contact Number<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
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

        {/* Logo / Image Zone */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-gray-900">
              Event Logo/image<span className="text-[#FF5B22] ml-0.5">*</span>
            </label>
            <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">
              i
            </span>
          </div>
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/60 text-center flex items-center justify-center min-h-[76px] hover:bg-gray-100/50 transition-colors cursor-pointer">
            <p className="text-[11px] text-gray-400 font-medium">
              Drag and drop a photo here or <br /> click to open file
            </p>
          </div>
        </div>
      </div>

      {/* RSVP Box */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-3">
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
          <span className="w-3.5 h-3.5 text-gray-400 border border-gray-400 rounded-full flex items-center justify-center text-[9px] font-bold">
            i
          </span>
        </label>

        {enableRsvp && (
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              Acceptance Last Date<span className="text-[#FF5B22] ml-0.5">*</span>
            </label>
            <button
              type="button"
              onClick={() => onOpenDatePicker("rsvp")}
              className="w-full max-w-xs px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors cursor-pointer"
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

      {/* Address Field with Verify Button */}
      <div>
        <label className="block font-semibold text-gray-900 mb-1">
          Event Address<span className="text-[#FF5B22] ml-0.5">*</span>
        </label>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
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
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Verify
          </button>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
        <button
          type="button"
          className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer"
        >
          Next
        </button>
      </div>
    </form>
  );
}

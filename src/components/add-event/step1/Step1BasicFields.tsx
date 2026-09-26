"use client";

import React from "react";

interface Step1BasicFieldsProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  titleError?: string;
}

export default function Step1BasicFields({
  title,
  setTitle,
  description,
  setDescription,
  titleError,
}: Step1BasicFieldsProps) {
  const TITLE_MIN_REQUIRED = 10;
  const DESC_MIN_REQUIRED = 10;

  const titleRemaining = Math.max(0, TITLE_MIN_REQUIRED - title.length);
  const descRemaining = Math.max(0, DESC_MIN_REQUIRED - description.length);

  return (
    <>
      {/* Title Field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="font-semibold text-gray-900">
            Title<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          {titleRemaining > 0 ? (
            <span className="text-[10px] text-gray-400 font-medium">
              {titleRemaining} Chars remaining
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold" title="Minimum character requirement met">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Sharmistha Birthday Event 2026"
          aria-invalid={!!titleError}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#FF5B22] font-medium ${titleError ? "border-rose-400" : "border-gray-200/90"}`}
        />
        {titleError && <p className="mt-1 text-[11px] font-medium text-rose-600">{titleError}</p>}
      </div>

      {/* Description Field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="font-semibold text-gray-900">
            Description<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          {descRemaining > 0 ? (
            <span className="text-[10px] text-gray-400 font-medium">
              {descRemaining} Chars remaining
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold" title="Minimum character requirement met">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        <textarea
          rows={3}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Eg: Join us for an unforgettable event filled with celebration..."
          className="w-full px-3.5 py-2.5 bg-white border border-gray-200/90 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#FF5B22] font-medium leading-relaxed"
        />
      </div>
    </>
  );
}

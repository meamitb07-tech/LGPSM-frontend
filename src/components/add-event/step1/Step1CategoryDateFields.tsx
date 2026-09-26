"use client";

import React from "react";
import CustomDropdown from "@/components/common/CustomDropdown";

interface Step1CategoryDateFieldsProps {
  category: string;
  setCategory: (val: string) => void;
  subcategory: string;
  setSubcategory: (val: string) => void;
  categoryOptions: { value: string; label: string }[];
  subcategoryOptions: { value: string; label: string }[];
  categoriesError?: string | null;
  startDate: string;
  endDate: string;
  startError?: string;
  endError?: string;
  onOpenDatePicker: (field: "start" | "end" | "rsvp") => void;
}

export default function Step1CategoryDateFields({
  category,
  setCategory,
  subcategory,
  setSubcategory,
  categoryOptions,
  subcategoryOptions,
  categoriesError,
  startDate,
  endDate,
  startError,
  endError,
  onOpenDatePicker,
}: Step1CategoryDateFieldsProps) {
  return (
    <>
      {/* Category & Subcategory Row with CustomDropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-gray-900 mb-1">
            Event Category
          </label>
          <CustomDropdown
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            placeholder={categoryOptions.length ? "- Category -" : "No categories yet (General)"}
          />
          {categoriesError && <p className="mt-1 text-[11px] font-medium text-rose-600">{categoriesError}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-1">
            Event Subcategory
          </label>
          <CustomDropdown
            value={subcategory}
            onChange={setSubcategory}
            options={subcategoryOptions}
            placeholder={subcategoryOptions.length ? "- Subcategory -" : "None for this category"}
          />
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
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200/90 rounded-md text-gray-900 font-medium flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors cursor-pointer"
          >
            <span className={startDate ? "text-gray-900 font-semibold" : "text-gray-400"}>
              {startDate || "Select start date and time"}
            </span>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          {startError && <p className="mt-1 text-[11px] font-medium text-rose-600">{startError}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-1">
            Event End Date Time<span className="text-[#FF5B22] ml-0.5">*</span>
          </label>
          <button
            type="button"
            onClick={() => onOpenDatePicker("end")}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200/90 rounded-md text-gray-900 font-medium flex items-center justify-between text-left hover:bg-gray-100/70 transition-colors cursor-pointer"
          >
            <span className={endDate ? "text-gray-900 font-semibold" : "text-gray-400"}>
              {endDate || "Select end date and time"}
            </span>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          {endError && <p className="mt-1 text-[11px] font-medium text-rose-600">{endError}</p>}
        </div>
      </div>
    </>
  );
}

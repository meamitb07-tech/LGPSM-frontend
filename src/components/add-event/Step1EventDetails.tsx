"use client";

import React, { useState, useEffect } from "react";
import Step1BasicFields from "./step1/Step1BasicFields";
import Step1CategoryDateFields from "./step1/Step1CategoryDateFields";
import Step1ContactLogoFields from "./step1/Step1ContactLogoFields";

interface Step1EventDetailsProps {
  onNext: () => void;
  onOpenDatePicker: (field: "start" | "end" | "rsvp") => void;
  startDate: string;
  endDate: string;
  rsvpDate: string;
  initialData?: any;
  onDataChange?: (data: any) => void;
}

export default function Step1EventDetails({
  onNext,
  onOpenDatePicker,
  startDate,
  endDate,
  rsvpDate,
  initialData,
  onDataChange,
}: Step1EventDetailsProps) {
  const [logoFile, setLogoFile] = useState<{ name: string; url: string } | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "Personal");
  const [subcategory, setSubcategory] = useState(initialData?.subcategory || "Birthday");
  const [contactNumber, setContactNumber] = useState(initialData?.contactNumber || "");
  const [enableRsvp, setEnableRsvp] = useState(true);
  const [address, setAddress] = useState(initialData?.venue || "");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setCategory(initialData.category || "Personal");
      setSubcategory(initialData.subcategory || "Birthday");
      setContactNumber(initialData.contactNumber || "");
      setAddress(initialData.venue || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onDataChange) {
      onDataChange({
        title,
        description,
        category,
        subcategory,
        contactNumber,
        venue: address,
      });
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 font-sans text-xs">
      <Step1BasicFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />

      <Step1CategoryDateFields
        category={category}
        setCategory={setCategory}
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        startDate={startDate}
        endDate={endDate}
        onOpenDatePicker={onOpenDatePicker}
      />

      <Step1ContactLogoFields
        contactNumber={contactNumber}
        setContactNumber={setContactNumber}
        logoFile={logoFile}
        setLogoFile={setLogoFile}
        enableRsvp={enableRsvp}
        setEnableRsvp={setEnableRsvp}
        rsvpDate={rsvpDate}
        onOpenDatePicker={onOpenDatePicker}
        address={address}
        setAddress={setAddress}
      />

      {/* Footer Actions */}
      <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
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

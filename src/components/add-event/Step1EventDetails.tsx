"use client";

import React from "react";
import Step1BasicFields from "./step1/Step1BasicFields";
import Step1CategoryDateFields from "./step1/Step1CategoryDateFields";
import Step1ContactLogoFields from "./step1/Step1ContactLogoFields";
import { DraftErrors, EventDraft } from "./eventDraft";
import { Category } from "@/services/categoryService";
import { formatDateTime } from "@/utils/dateTime";

export type EventDateField = "start" | "end" | "rsvpDeadline";

interface Step1EventDetailsProps {
  draft: EventDraft;
  onChange: (patch: Partial<EventDraft>) => void;
  onOpenDatePicker: (field: EventDateField) => void;
  categories: Category[];
  categoriesError?: string | null;
  errors: DraftErrors;
  logoFile: { name: string; url: string } | null;
  setLogoFile: (val: { name: string; url: string } | null) => void;
  onNext: () => void;
  onCancel: () => void;
}

// Controlled step: all values live in the wizard draft owned by the page
export default function Step1EventDetails({
  draft,
  onChange,
  onOpenDatePicker,
  categories,
  categoriesError,
  errors,
  logoFile,
  setLogoFile,
  onNext,
  onCancel,
}: Step1EventDetailsProps) {
  const selectedCategory = categories.find((c) => c._id === draft.categoryId);
  const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }));
  const subcategoryOptions = (selectedCategory?.subcategories || [])
    .filter((s) => s._id)
    .map((s) => ({ value: s._id as string, label: s.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 font-sans text-xs">
      <Step1BasicFields
        title={draft.title}
        setTitle={(title) => onChange({ title })}
        description={draft.description}
        setDescription={(description) => onChange({ description })}
        titleError={errors.title}
      />

      <Step1CategoryDateFields
        category={draft.categoryId}
        setCategory={(categoryId) => onChange({ categoryId, subcategoryId: "" })}
        subcategory={draft.subcategoryId}
        setSubcategory={(subcategoryId) => onChange({ subcategoryId })}
        categoryOptions={categoryOptions}
        subcategoryOptions={subcategoryOptions}
        categoriesError={categoriesError}
        startDate={formatDateTime(draft.start)}
        endDate={formatDateTime(draft.end)}
        startError={errors.start}
        endError={errors.end}
        onOpenDatePicker={(field) => onOpenDatePicker(field === "rsvp" ? "rsvpDeadline" : field)}
      />

      <Step1ContactLogoFields
        contactNumber={draft.contactNumber}
        setContactNumber={(contactNumber) => onChange({ contactNumber })}
        logoFile={logoFile}
        setLogoFile={setLogoFile}
        enableRsvp={draft.rsvpEnabled}
        setEnableRsvp={(rsvpEnabled) => onChange({ rsvpEnabled })}
        rsvpDate={formatDateTime(draft.rsvpDeadline)}
        rsvpError={errors.rsvpDeadline}
        onOpenDatePicker={(field) => onOpenDatePicker(field === "rsvp" ? "rsvpDeadline" : field)}
        address={draft.venue}
        setAddress={(venue) => onChange({ venue })}
      />

      {/* Footer Actions */}
      <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
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

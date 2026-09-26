"use client";

import React, { useState } from "react";
import { DraftErrors, EventDraft, PreferenceCategory, newClientKey } from "./eventDraft";

interface Step2SettingsProps {
  draft: EventDraft;
  onChange: (patch: Partial<EventDraft>) => void;
  errors: DraftErrors;
  onNext: () => void;
  onBack: () => void;
}

// Controlled step: values live in the wizard draft owned by the page
export default function Step2Settings({ draft, onChange, errors, onNext, onBack }: Step2SettingsProps) {
  const categories = draft.preferenceCategories;
  const setCategories = (updater: (prev: PreferenceCategory[]) => PreferenceCategory[]) =>
    onChange({ preferenceCategories: updater(categories) });
  const maxAttendees = draft.thresholdLimit;
  const acceptAll = draft.allowAllInvited;
  const allowNotResponded = draft.allowNotResponded;
  const allowDeclined = draft.allowDeclined;
  const askFoodPreference = draft.dietaryEnabled;

  const [savedCategories, setSavedCategories] = useState<Record<string, boolean>>({});

  // Category Title Change Handler
  const handleTitleChange = (id: string, newTitle: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, title: newTitle } : cat))
    );
  };

  // Option Value Change Handler
  const handleOptionChange = (catId: string, optIdx: number, val: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        const updated = [...cat.options];
        updated[optIdx] = val;
        return { ...cat, options: updated };
      })
    );
  };

  // Add Option to Category ("Add another option?")
  const handleAddOption = (catId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        return { ...cat, options: [...cat.options, ""] };
      })
    );
  };

  // Remove Option from Category
  const handleRemoveOption = (catId: string, optIdx: number) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
        if (cat.options.length <= 1) return cat;
        const updated = cat.options.filter((_, idx) => idx !== optIdx);
        return { ...cat, options: updated };
      })
    );
  };

  // Add New Preference Category ("+ Add Another")
  const handleAddCategory = () => {
    const newId = newClientKey("pref");
    setCategories((prev) => [
      ...prev,
      {
        id: newId,
        title: "",
        options: [""],
      },
    ]);
  };

  // Remove Category Block
  const handleRemoveCategory = (catId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== catId));
  };

  // Save Category Feedback
  const handleSaveCategory = (catId: string) => {
    setSavedCategories((prev) => ({ ...prev, [catId]: true }));
    setTimeout(() => {
      setSavedCategories((prev) => ({ ...prev, [catId]: false }));
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 font-sans text-xs">
      {/* Attendee threshold limit */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-900">
          Attendee threshold limit
        </label>
        <input
          type="number"
          value={maxAttendees}
          onChange={(e) => onChange({ thresholdLimit: e.target.value })}
          placeholder="Enter Max Attendee count"
          min={1}
          className="w-full max-w-lg px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] font-medium transition-all"
        />
        {errors.thresholdLimit && <p className="text-[11px] font-medium text-rose-600">{errors.thresholdLimit}</p>}
      </div>

      {/* Checkbox Options List */}
      <div className="space-y-3">
        {/* Accept all invited attendees */}
        <div className="p-3.5 border border-gray-200 rounded-md bg-white flex items-center justify-between shadow-2xs">
          <label className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onChange({ allowAllInvited: !acceptAll })}>
            <div
              role="checkbox"
              aria-checked={acceptAll}
              className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
                acceptAll ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white border border-gray-300 text-transparent"
              }`}
            >
              <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-xs">
              Accept all invited attendees
            </span>
          </label>
          <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
            i
          </span>
        </div>

        {/* Allow not-responded invitees */}
        <div className="p-3.5 border border-gray-200 rounded-md bg-white flex items-center justify-between shadow-2xs">
          <label className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onChange({ allowNotResponded: !allowNotResponded })}>
            <div
              role="checkbox"
              aria-checked={allowNotResponded}
              className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
                allowNotResponded ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white border border-gray-300 text-transparent"
              }`}
            >
              <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium text-gray-400 text-xs">
              Allow not-responded invitees
            </span>
          </label>
          <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
            i
          </span>
        </div>

        {/* Allow RSVP declined invitees */}
        <div className="p-3.5 border border-gray-200 rounded-md bg-white flex items-center justify-between shadow-2xs">
          <label className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onChange({ allowDeclined: !allowDeclined })}>
            <div
              role="checkbox"
              aria-checked={allowDeclined}
              className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
                allowDeclined ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white border border-gray-300 text-transparent"
              }`}
            >
              <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium text-gray-400 text-xs">
              Allow RSVP declined invitees
            </span>
          </label>
          <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
            i
          </span>
        </div>

        {/* Ask for food preference */}
        <div className="p-4 border border-gray-200 rounded-md bg-white space-y-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onChange({ dietaryEnabled: !askFoodPreference })}>
              <div
                role="checkbox"
                aria-checked={askFoodPreference}
                className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 ${
                  askFoodPreference ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white border border-gray-300 text-transparent"
                }`}
              >
                <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-xs">
                Ask for food preference
              </span>
            </label>
            <span className="w-4 h-4 text-gray-400 border border-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
              i
            </span>
          </div>

          {askFoodPreference && (
            <div className="pt-2 space-y-6">
              {categories.map((category, catIdx) => (
                <div
                  key={category.id}
                  className="pt-4 border-t border-gray-200 first:border-t-0 first:pt-0 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-900">
                      Write title (e.g. Preference Category)
                    </label>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Remove Category
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={category.title}
                    onChange={(e) => handleTitleChange(category.id, e.target.value)}
                    placeholder="Dietary Preference"
                    className="w-full max-w-md px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-md text-gray-900 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22]"
                  />

                  {/* Radio Options List */}
                  <div className="space-y-2.5 pt-1">
                    {category.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full border-2 border-[#10B981] flex items-center justify-center shrink-0">
                          <span className="w-2 h-2 bg-[#10B981] rounded-full" />
                        </span>
                        <div className="flex-1 max-w-xs flex items-center gap-2">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(category.id, optIdx, e.target.value)
                            }
                            placeholder={`Option ${optIdx + 1}`}
                            className="w-full border-b border-gray-300 focus:border-[#FF5B22] focus:outline-none py-0.5 text-xs text-gray-900 font-medium"
                          />
                          {category.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(category.id, optIdx)}
                              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete option"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* "Add another option?" Action Link */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                      <span className="text-xs text-gray-400 font-medium">
                        Option {category.options.length + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddOption(category.id)}
                        className="text-[#10B981] font-semibold hover:underline ml-1 text-xs cursor-pointer"
                      >
                        Add another option?
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSaveCategory(category.id)}
                      className="px-5 py-2 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-md shadow-2xs transition-all cursor-pointer"
                    >
                      Save
                    </button>
                    {savedCategories[category.id] && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        ✓ Saved
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* "+ Add Another" Button for adding new Preference Categories */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 border border-[#FF5B22] text-[#FF5B22] hover:bg-[#FF5B22]/5 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold">+</span> Add Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Actions */}
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
          Next
        </button>
      </div>
    </form>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import CustomDropdown from "@/components/common/CustomDropdown";
import { templateService, Template } from "@/services/templateService";
import { categoryService, Category } from "@/services/categoryService";
import { SelectedTemplate, templatePreviewUrl } from "../eventDraft";

interface SelectTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: SelectedTemplate | null) => void;
  selectedTemplateId?: string | null;
  // Pre-filter by the event's category when one is chosen
  categoryId?: string;
}

const ALL = "__all__";

export default function SelectTemplateModal({
  isOpen,
  onClose,
  onSelectTemplate,
  selectedTemplateId,
  categoryId,
}: SelectTemplateModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"templates" | "upload">("templates");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  // The parent remounts this modal (via key) each time it opens, so state starts from the props
  const [loading, setLoading] = useState(isOpen);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>(categoryId || ALL);
  const [pendingId, setPendingId] = useState<string | null>(selectedTemplateId || null);

  // Load real templates when the picker opens
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    Promise.all([templateService.getTemplates(), categoryService.getCategories()]).then(([tRes, cRes]) => {
      if (cancelled) return;
      if (tRes.success && Array.isArray(tRes.data)) {
        setTemplates(tRes.data.filter((t) => t.isActive !== false));
      } else {
        setTemplates([]);
        setLoadError(tRes.message || "Failed to load templates.");
      }
      setCategories(cRes.success && Array.isArray(cRes.data) ? cRes.data : []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && overlayRef.current && modalRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.fromTo(modalRef.current, { scale: 0.8, opacity: 0, y: 15 }, { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.2)" });
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const templateCategoryId = (t: Template) =>
    typeof t.categoryId === "object" && t.categoryId ? t.categoryId._id : t.categoryId || "";
  const visibleTemplates = templates.filter((t) => filterCategory === ALL || templateCategoryId(t) === filterCategory);
  const categoryOptions = [
    { value: ALL, label: "All categories" },
    ...categories.map((c) => ({ value: c._id, label: c.name })),
  ];

  const handleSave = () => {
    const chosen = templates.find((t) => t._id === pendingId);
    onSelectTemplate(chosen ? { id: chosen._id, name: chosen.name, previewUrl: templatePreviewUrl(chosen.previewImageKey) } : null);
    onClose();
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Select Template" className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">Select Template</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 pb-2 space-y-4">
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Event Category</label>
            <CustomDropdown value={filterCategory} onChange={setFilterCategory} options={categoryOptions} />
          </div>

          <div className="flex border-b border-gray-200 gap-6 text-xs font-bold pt-2">
            <button onClick={() => setActiveTab("templates")} className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${activeTab === "templates" ? "border-[#FF5B22] text-[#FF5B22]" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Templates</button>
            <button onClick={() => setActiveTab("upload")} className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${activeTab === "upload" ? "border-[#FF5B22] text-[#FF5B22]" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Upload your own</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-[220px]">
          {activeTab === "templates" ? (
            loading ? (
              <p className="text-xs text-gray-500 font-medium py-10 text-center">Loading templates...</p>
            ) : loadError ? (
              <p className="text-xs text-rose-600 font-medium py-10 text-center break-words">{loadError}</p>
            ) : visibleTemplates.length === 0 ? (
              <p className="text-xs text-gray-500 font-medium py-10 text-center">
                {templates.length === 0 ? "No templates have been published yet." : "No templates in this category."}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {visibleTemplates.map((tmpl) => {
                  const preview = templatePreviewUrl(tmpl.previewImageKey);
                  const isSelected = pendingId === tmpl._id;
                  return (
                    <button
                      key={tmpl._id}
                      type="button"
                      onClick={() => setPendingId(isSelected ? null : tmpl._id)}
                      aria-pressed={isSelected}
                      title={tmpl.name}
                      className={`relative aspect-[9/14] rounded-lg overflow-hidden border-2 transition-all cursor-pointer group bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 ${isSelected ? "border-[#FF5B22] ring-2 ring-[#FF5B22]/30" : "border-transparent hover:border-gray-300"}`}
                    >
                      {preview ? (
                        <img src={preview} alt={tmpl.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : null}
                      <span className="absolute inset-x-0 bottom-0 bg-black/55 text-white text-[10px] font-semibold px-1.5 py-1 truncate">
                        {tmpl.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center space-y-1">
              <p className="text-xs font-semibold text-gray-700">Custom template upload is not available yet.</p>
              <p className="text-[11px] text-gray-500">It needs media storage, which is not configured on this server.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center gap-3">
          <span className="text-[11px] text-gray-500 truncate">
            {pendingId ? `Selected: ${templates.find((t) => t._id === pendingId)?.name || "template"}` : "No template selected"}
          </span>
          <button onClick={handleSave} disabled={activeTab !== "templates"} className="px-6 py-2.5 bg-[#FF5B22] text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0">Save</button>
        </div>
      </div>
    </div>
  );
}

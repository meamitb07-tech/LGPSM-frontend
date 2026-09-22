"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import CustomDropdown from "@/components/common/CustomDropdown";

interface SelectTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (src: string) => void;
  currentCategory?: string;
  currentSubcategory?: string;
}

const SAMPLE_TEMPLATES = [
  { id: 1, name: "Birthday Blue", src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80" },
  { id: 2, name: "Birthday Balloons", src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80" },
  { id: 3, name: "Rose Birthday", src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&q=80" },
  { id: 4, name: "Pink Birthday", src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80" },
  { id: 5, name: "Yellow Frame", src: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=500&q=80" },
];

export default function SelectTemplateModal({
  isOpen,
  onClose,
  onSelectTemplate,
  currentCategory = "Personal",
  currentSubcategory = "Birthday",
}: SelectTemplateModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const templateUploadRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"templates" | "upload">("templates");
  const [category, setCategory] = useState(currentCategory);
  const [subcategory, setSubcategory] = useState(currentSubcategory);
  const [selectedSrc, setSelectedSrc] = useState(SAMPLE_TEMPLATES[0].src);
  const [customUploadedSrc, setCustomUploadedSrc] = useState<string | null>(null);

  const categoryOptions = [
    { value: "Personal", label: "Personal" },
    { value: "Corporate", label: "Corporate" },
    { value: "Wedding", label: "Wedding" },
  ];

  const subcategoryOptions = [
    { value: "Birthday", label: "Birthday" },
    { value: "Anniversary", label: "Anniversary" },
    { value: "Party", label: "Party" },
  ];

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

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div ref={modalRef} className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">Select Template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 pb-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Event Category*</label>
              <CustomDropdown value={category} onChange={setCategory} options={categoryOptions} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Event Subcategory*</label>
              <CustomDropdown value={subcategory} onChange={setSubcategory} options={subcategoryOptions} />
            </div>
          </div>

          <div className="flex border-b border-gray-200 gap-6 text-xs font-bold pt-2">
            <button onClick={() => setActiveTab("templates")} className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${activeTab === "templates" ? "border-[#FF5B22] text-[#FF5B22]" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Templates</button>
            <button onClick={() => setActiveTab("upload")} className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${activeTab === "upload" ? "border-[#FF5B22] text-[#FF5B22]" : "border-transparent text-gray-500 hover:text-gray-800"}`}>Upload your own</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-[220px]">
          {activeTab === "templates" ? (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-3">{subcategory}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {SAMPLE_TEMPLATES.map((tmpl) => (
                  <button key={tmpl.id} onClick={() => setSelectedSrc(tmpl.src)} className={`relative aspect-[9/14] rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${selectedSrc === tmpl.src ? "border-[#FF5B22] ring-2 ring-[#FF5B22]/30 scale-105" : "border-transparent hover:border-gray-300"}`}>
                    <Image src={tmpl.src} alt={tmpl.name} fill sizes="120px" className="object-cover group-hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <input ref={templateUploadRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setSelectedSrc(URL.createObjectURL(file)); setCustomUploadedSrc(URL.createObjectURL(file)); } }} />
              {customUploadedSrc ? (
                <div className="p-4 border-2 border-emerald-300 rounded-md bg-emerald-50/40 flex flex-col items-center justify-center">
                  <div className="w-24 h-36 rounded-lg overflow-hidden relative shadow-md mb-2"><Image src={customUploadedSrc} alt="Preview" fill className="object-cover" /></div>
                  <button type="button" onClick={() => templateUploadRef.current?.click()} className="text-xs text-[#FF5B22] font-bold underline">Change photo</button>
                </div>
              ) : (
                <div onClick={() => templateUploadRef.current?.click()} className="p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer">
                  <p className="text-xs text-gray-600">Drag and drop a photo here or <span className="text-[#FF5B22] font-semibold underline">click</span></p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button onClick={() => { onSelectTemplate(selectedSrc); onClose(); }} className="px-6 py-2.5 bg-[#FF5B22] text-white font-bold text-xs rounded-lg shadow-xs">Save</button>
        </div>
      </div>
    </div>
  );
}

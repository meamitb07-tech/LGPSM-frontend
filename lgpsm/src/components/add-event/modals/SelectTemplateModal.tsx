"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface SelectTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (src: string) => void;
  currentCategory?: string;
  currentSubcategory?: string;
}

const SAMPLE_TEMPLATES = [
  { id: 1, name: "Birthday Blue Claudia", src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80" },
  { id: 2, name: "Birthday Balloons", src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80" },
  { id: 3, name: "Rose 2nd Birthday", src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&q=80" },
  { id: 4, name: "Pink Birthday Girl", src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80" },
  { id: 5, name: "Yellow Photo Frame", src: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=500&q=80" },
  { id: 6, name: "Happy Birthday Gold", src: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&q=80" },
  { id: 7, name: "Samira's Birthday", src: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=500&q=80" },
  { id: 8, name: "Classic Pink Wish", src: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500&q=80" },
  { id: 9, name: "Blue Crown Birthday", src: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&q=80" },
  { id: 10, name: "Green Balloon Celebration", src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80" },
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

  const handleTemplateUpload = (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomUploadedSrc(url);
      setSelectedSrc(url);
    }
  };

  useEffect(() => {
    if (isOpen && overlayRef.current && modalRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.fromTo(
          modalRef.current,
          { scale: 0.8, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.2)" }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSelectTemplate(selectedSrc);
    onClose();
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Select Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 pb-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Event Category<span className="text-[#FF5B22]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:border-gray-300"
              >
                <option value="Personal">Personal</option>
                <option value="Corporate">Corporate</option>
                <option value="Wedding">Wedding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Event Subcategory<span className="text-[#FF5B22]">*</span>
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:border-gray-300"
              >
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Party">Party</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 gap-6 text-xs font-bold pt-2">
            <button
              onClick={() => setActiveTab("templates")}
              className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === "templates"
                  ? "border-[#FF5B22] text-[#FF5B22]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === "upload"
                  ? "border-[#FF5B22] text-[#FF5B22]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Upload your own
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-[260px]">
          {activeTab === "templates" ? (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-3">{subcategory}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {SAMPLE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedSrc(tmpl.src)}
                    className={`relative aspect-[9/14] rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                      selectedSrc === tmpl.src
                        ? "border-[#FF5B22] ring-2 ring-[#FF5B22]/30 shadow-md scale-105"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={tmpl.src}
                      alt={tmpl.name}
                      fill
                      sizes="120px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <input
                ref={templateUploadRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleTemplateUpload(file);
                }}
              />

              {customUploadedSrc ? (
                <div className="p-4 border-2 border-emerald-300 rounded-xl bg-emerald-50/40 flex flex-col items-center justify-center text-center relative">
                  <div className="w-24 h-36 rounded-lg overflow-hidden relative shadow-md border border-emerald-400 mb-3">
                    <Image
                      src={customUploadedSrc}
                      alt="Custom template preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 mb-2">Custom Template Uploaded!</p>
                  <button
                    type="button"
                    onClick={() => templateUploadRef.current?.click()}
                    className="text-xs text-[#FF5B22] font-bold underline cursor-pointer hover:text-[#E04B16]"
                  >
                    Change photo
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => templateUploadRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleTemplateUpload(file);
                  }}
                  className="p-8 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100/60 transition-colors flex flex-col items-center justify-center text-center cursor-pointer select-none"
                >
                  <p className="text-xs text-gray-600 mb-2 pointer-events-none">
                    Drag and drop a photo here or <span className="text-[#FF5B22] font-semibold underline">click</span> to open file
                  </p>
                  <ul className="text-[11px] text-gray-400 space-y-1 mt-4 text-left list-disc list-inside pointer-events-none">
                    <li>File format JPG, JPEG, PNG, PDF</li>
                    <li>Maximum file size 55 Mb</li>
                    <li>Image ratio should be 9:16 (Portrait)</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

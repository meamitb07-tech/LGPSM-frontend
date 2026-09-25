"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import { categoryService, Category } from "@/services/categoryService";
import { templateService, Template } from "@/services/templateService";

interface TemplateItem {
  id: string;
  name: string;
  title?: string;
  category: string;
  subcategory: string;
  imageUrl: string;
}

export default function TemplatesPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Birthday");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, tmplRes] = await Promise.allSettled([
          categoryService.getCategories(),
          templateService.getTemplates(),
        ]);

        if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value.data)) {
          setCategories(catRes.value.data);
          if (catRes.value.data.length > 0) {
            setSelectedCategory(catRes.value.data[0].name);
          }
        }

        if (tmplRes.status === "fulfilled" && tmplRes.value?.success && Array.isArray(tmplRes.value.data)) {
          const formatted: TemplateItem[] = tmplRes.value.data.map((t: Template) => ({
            id: t._id || t.id || String(Math.random()),
            name: t.name,
            title: t.name,
            category: typeof (t as any).category === "object" ? (t as any).category?.name : (t.categoryId || "General"),
            subcategory: t.subcategoryId || "General",
            imageUrl: t.previewImageKey || "/images/auth/login_side_img.png",
          }));
          setTemplates(formatted);
        }
      } catch (err) {
        console.error("Failed to load templates or categories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full min-h-full bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <h1 className="text-xl font-bold text-gray-900">Templates</h1>
        </div>
        <UserNavDropdown />
      </header>

      {/* Page Content */}
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 pb-24">
          {/* Controls Bar: Category & Subcategory Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
            {/* Event Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-800">
                Event Category<span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 focus:outline-none focus:border-[#FF5B22] cursor-pointer"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Personal">Personal</option>
                    <option value="Corporate">Corporate</option>
                  </>
                )}
              </select>
            </div>

            {/* Event Subcategory */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-800">
                Event Subcategory<span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 focus:outline-none focus:border-[#FF5B22] cursor-pointer"
              >
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Wedding">Wedding</option>
                <option value="Conference">Conference</option>
              </select>
            </div>
          </div>

          {/* Templates Grid */}
          {templates.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-400 text-sm">No templates available yet.</p>
              <p className="text-gray-300 text-xs mt-1">Templates will appear here once created.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-2">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="group relative bg-white border border-gray-200 rounded-md overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col aspect-[3/4]"
                >
                  {/* Expand icon on top-right */}
                  <button
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/40 hover:bg-black/70 text-white rounded flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>

                  {/* Template Visual Card Placeholder */}
                  <div className="relative w-full h-full bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 flex flex-col items-center justify-center p-3 text-center">
                    <div className="font-bold text-gray-800 text-sm tracking-tight drop-shadow-xs">
                      HAPPY BIRTHDAY
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/80 border border-white my-2 flex items-center justify-center text-[10px] font-semibold text-gray-600">
                      PHOTO
                    </div>
                    <div className="text-[10px] text-gray-600 italic">
                      Wish You All The Best
                    </div>
                  </div>

                  {/* Hover overlay with "Use This Template" button */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <button
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="px-3 py-1.5 bg-white text-gray-900 text-[11px] font-bold rounded shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Template Preview</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left Image Box */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 rounded-md overflow-hidden flex flex-col items-center justify-center text-white p-6 shadow-md">
                <button className="absolute top-3 right-3 w-7 h-7 bg-black/40 text-white rounded flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <h4 className="text-xl font-extrabold tracking-wider mb-2">Happy Birthday</h4>
                <p className="text-xs text-white/80 italic text-center max-w-[200px]">
                  Wishing you joy, love, and success on your special day!
                </p>
              </div>

              {/* Right Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{previewTemplate.title}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    <strong>Category:</strong> {previewTemplate.category} &nbsp;|&nbsp; <strong>Sub Category:</strong> {previewTemplate.subcategory}
                  </p>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.
                </p>

                {/* Yellow Warning Note (Image 5) */}
                <div className="bg-[#FEF9C3]/80 border border-[#FEF08A] rounded-md p-3.5 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0 font-extrabold text-[11px] mt-0.5 shadow-2xs">
                    !
                  </div>
                  <p className="text-[11px] font-bold text-gray-900 leading-snug">
                    <strong className="font-extrabold">CREATE AN EVENT</strong> to preview the template with your event content. Click on Create an event below and start inviting people.
                  </p>
                </div>

                {/* Edit Template Button */}
                <div className="pt-2">
                  <button className="px-6 py-2.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-2xs">
                    Edit Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

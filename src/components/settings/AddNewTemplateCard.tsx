"use client";

import React, { useState } from "react";
import { TemplateCategory, TemplateSubcategory } from "@/types/settings";
import CustomDropdown from "@/components/common/CustomDropdown";

interface AddNewTemplateCardProps {
  categories: TemplateCategory[];
  subcategories: TemplateSubcategory[];
  onOpenAddCategory: () => void;
  onOpenAddSubcategory: () => void;
  onAddTemplate: (newTemplate: {
    name: string;
    categoryId: string;
    subcategoryId: string;
    isPublished: boolean;
  }) => void;
}

export default function AddNewTemplateCard({
  categories,
  subcategories,
  onOpenAddCategory,
  onOpenAddSubcategory,
  onAddTemplate,
}: AddNewTemplateCardProps) {
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [templateFile, setTemplateFile] = useState<{ name: string; url: string } | null>(null);
  const templateInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setTemplateFile({ name: file.name, url });
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const filteredSubcategories = subcategories
    .filter((sub) => !selectedCategory || sub.categoryId === selectedCategory)
    .map((sub) => ({
      value: sub.id,
      label: sub.name,
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedCategory || !selectedSubcategory) return;
    onAddTemplate({
      name: name.trim(),
      categoryId: selectedCategory,
      subcategoryId: selectedSubcategory,
      isPublished,
    });
    setName("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setIsPublished(false);
  };

  return (
    <div className="bg-white rounded-md border border-gray-200/80 p-6 shadow-xs mb-8">
      <h2 className="text-base font-bold text-gray-800 mb-5">Add New Template</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name, Category, Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Template Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Template Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Type"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gray-200/90 rounded-md bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] text-gray-800"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-700">
                Category<span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={onOpenAddCategory}
                className="text-[11px] font-semibold text-[#FF5B22] hover:underline"
              >
                + Add Category
              </button>
            </div>
            <CustomDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              placeholder="- Category -"
            />
          </div>

          {/* Subcategory Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subcategory<span className="text-red-500">*</span>
            </label>
            <CustomDropdown
              value={selectedSubcategory}
              onChange={setSelectedSubcategory}
              options={filteredSubcategories}
              placeholder="- Subcategory -"
              topAction={{
                label: "Add New Subcategory",
                onClick: onOpenAddSubcategory,
              }}
            />
          </div>
        </div>

        {/* Row 2: Upload Card Template */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Upload Card Template
          </label>
          <input
            ref={templateInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />

          {templateFile ? (
            <div className="w-full max-w-md p-3 border border-emerald-300 rounded-md bg-emerald-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                {templateFile.url.startsWith("blob:") || templateFile.url.startsWith("data:") ? (
                  <div className="w-12 h-16 rounded overflow-hidden relative shrink-0 border border-emerald-300">
                    <img src={templateFile.url} alt="Template preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <span className="text-xs font-semibold text-emerald-900 truncate max-w-[200px]">
                  {templateFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTemplateFile(null)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => templateInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className="w-full max-w-md border-2 border-dashed border-gray-200 rounded-md p-6 text-center hover:border-[#FF5B22] transition-colors bg-gray-50/30 cursor-pointer select-none"
            >
              <p className="text-xs text-gray-500">
                Drag and drop an image here or{" "}
                <span className="text-[#FF5B22] font-semibold hover:underline">click to open file</span>
              </p>
            </div>
          )}
        </div>

        {/* Row 3: Publish toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-700">Publish</span>
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPublished ? "bg-[#FF5B22]" : "bg-gray-300"
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isPublished ? "translate-x-4" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        {/* Add Template Button */}
        <div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#FF5B22] text-white text-xs font-semibold rounded-md hover:bg-[#e04f1d] transition-colors shadow-xs"
          >
            Add Template
          </button>
        </div>
      </form>
    </div>
  );
}

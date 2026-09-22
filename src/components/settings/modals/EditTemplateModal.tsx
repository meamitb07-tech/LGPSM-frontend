"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TemplateItem, TemplateCategory, TemplateSubcategory } from "@/types/settings";
import CustomDropdown from "@/components/common/CustomDropdown";

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateItem | null;
  categories: TemplateCategory[];
  subcategories: TemplateSubcategory[];
  onSave: (updated: TemplateItem) => void;
  onDelete: (id: string) => void;
}

export default function EditTemplateModal({
  isOpen,
  onClose,
  template,
  categories,
  subcategories,
  onSave,
  onDelete,
}: EditTemplateModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (template) {
      setName(template.name);
      setCategory(template.categoryId);
      setSubcategory(template.subcategoryId);
      setIsPublished(template.status === "Published");
      setImageUrl(template.imageUrl);
    }
  }, [template]);

  if (!isOpen || !template) return null;

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const subcategoryOptions = subcategories
    .filter((sub) => !category || sub.categoryId === category)
    .map((s) => ({
      value: s.id,
      label: s.name,
    }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...template,
      name,
      categoryId: category,
      subcategoryId: subcategory,
      status: isPublished ? "Published" : "Saved on Draft",
      imageUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-md shadow-xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">Edit Template Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content: 2-Column Grid */}
        <form onSubmit={handleSave} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column: Image Preview with Upload Button */}
            <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center group">
              <Image src={imageUrl || "/images/auth/login_side_img.png"} alt={name} fill className="object-cover" />
              <button
                type="button"
                className="absolute top-3 right-3 p-1.5 bg-black/40 text-white rounded-md hover:bg-black/60 transition-colors"
                title="Expand"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 bg-[#FF5B22] text-white text-xs font-semibold rounded-lg hover:bg-[#e04f1d] transition-colors shadow-md"
                >
                  Upload Template
                </button>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Template Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-200/90 rounded-md bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5B22] text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category<span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  value={category}
                  onChange={setCategory}
                  options={categoryOptions}
                  placeholder="- Select Category -"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Subcategory<span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  value={subcategory}
                  onChange={setSubcategory}
                  options={subcategoryOptions}
                  placeholder="- Select Subcategory -"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
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

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF5B22] text-white text-xs font-medium rounded-lg hover:bg-[#e04f1d] transition-colors shadow-xs"
                >
                  Save Template
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(template.id);
                    onClose();
                  }}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline transition-colors"
                >
                  Delete Template
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

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
          <div className="w-full max-w-md border-2 border-dashed border-gray-200 rounded-md p-6 text-center hover:border-[#FF5B22] transition-colors bg-gray-50/30 cursor-pointer">
            <p className="text-xs text-gray-500">
              Drag and drop a image here or{" "}
              <span className="text-[#FF5B22] font-semibold hover:underline">click to open file</span>
            </p>
          </div>
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

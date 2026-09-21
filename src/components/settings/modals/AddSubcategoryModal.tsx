"use client";

import React, { useState } from "react";
import { TemplateCategory } from "@/types/settings";
import CustomDropdown from "@/components/common/CustomDropdown";

interface AddSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: TemplateCategory[];
  onAddSubcategory: (categoryId: string, subcategoryName: string) => void;
}

export default function AddSubcategoryModal({
  isOpen,
  onClose,
  categories,
  onAddSubcategory,
}: AddSubcategoryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");

  if (!isOpen) return null;

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !subcategoryName.trim()) return;
    onAddSubcategory(selectedCategory, subcategoryName.trim());
    setSubcategoryName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-md shadow-xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">Add Subcategory</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <CustomDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              placeholder="- Category -"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subcategory Name
            </label>
            <input
              type="text"
              placeholder="Type"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gray-200/90 rounded-md bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5B22] focus:border-[#FF5B22] text-gray-800"
              required
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-[#FF5B22] rounded-lg hover:bg-[#e04f1d] transition-colors shadow-xs"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { TemplateCategory, TemplateSubcategory, TemplateItem } from "@/types/settings";
import TemplateGridItem from "./TemplateGridItem";
import CustomDropdown from "@/components/common/CustomDropdown";

interface TemplateFilterGridProps {
  templates: TemplateItem[];
  categories: TemplateCategory[];
  subcategories: TemplateSubcategory[];
  onEditTemplate: (template: TemplateItem) => void;
}

export default function TemplateFilterGrid({
  templates,
  categories,
  subcategories,
  onEditTemplate,
}: TemplateFilterGridProps) {
  const [selectedCat, setSelectedCat] = useState("personal");
  const [selectedSub, setSelectedSub] = useState("birthday");
  const [statusFilter, setStatusFilter] = useState("All");

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const subcategoryOptions = [
    { value: "", label: "All Subcategories" },
    ...subcategories
      .filter((s) => !selectedCat || s.categoryId === selectedCat)
      .map((s) => ({ value: s.id, label: s.name })),
  ];

  const statusOptions = [
    { value: "All", label: "All Status" },
    { value: "Published", label: "Published" },
    { value: "Draft", label: "Saved on Draft" },
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const matchCat = !selectedCat || tpl.categoryId === selectedCat;
    const matchSub = !selectedSub || tpl.subcategoryId === selectedSub;
    const matchStatus =
      statusFilter === "All" ||
      !statusFilter ||
      tpl.status.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter === "Published" && tpl.status === "Published") ||
      (statusFilter === "Draft" && tpl.status === "Saved on Draft");
    return matchCat && matchSub && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Event Category */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Event Category<span className="text-red-500">*</span>
          </label>
          <CustomDropdown
            value={selectedCat}
            onChange={setSelectedCat}
            options={categoryOptions}
            placeholder="- Event Category -"
          />
        </div>

        {/* Event Subcategory */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Event Subcategory<span className="text-red-500">*</span>
          </label>
          <CustomDropdown
            value={selectedSub}
            onChange={setSelectedSub}
            options={subcategoryOptions}
            placeholder="- Event Subcategory -"
          />
        </div>

        {/* Template Status */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Template Status
          </label>
          <CustomDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="- Template Status -"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-md border border-gray-200 p-8 text-center text-gray-500 text-xs">
          No card templates found for the selected filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateGridItem
              key={template.id}
              template={template}
              onEdit={onEditTemplate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import AddNewTemplateCard from "@/components/settings/AddNewTemplateCard";
import TemplateFilterGrid from "@/components/settings/TemplateFilterGrid";
import AddCategoryModal from "@/components/settings/modals/AddCategoryModal";
import AddSubcategoryModal from "@/components/settings/modals/AddSubcategoryModal";
import EditTemplateModal from "@/components/settings/modals/EditTemplateModal";
import { categoryService, Category } from "@/services/categoryService";
import { templateService, Template } from "@/services/templateService";
import {
  TemplateCategory,
  TemplateSubcategory,
  TemplateItem,
} from "@/types/settings";

// Shown until a real preview image is uploaded for a template
const TEMPLATE_PLACEHOLDER_IMAGE = "/images/branding/Invitation_Card_Sample.png";

export default function TemplateSettingsPage() {
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [subcategories, setSubcategories] = useState<TemplateSubcategory[]>([]);
  const [rawCategories, setRawCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);

  const loadData = useCallback(async () => {
    const [catRes, tmplRes] = await Promise.all([
      categoryService.getCategories(),
      templateService.getTemplates(),
    ]);

    if (catRes.success && Array.isArray(catRes.data)) {
      setRawCategories(catRes.data);
      setCategories(catRes.data.map((c: Category) => ({ id: c._id || c.id || "", name: c.name })));
      setSubcategories(
        catRes.data.flatMap((c: Category) =>
          (c.subcategories || [])
            .filter((sub) => sub._id)
            .map((sub) => ({ id: sub._id as string, categoryId: c._id, name: sub.name }))
        )
      );
    } else {
      setFeedback({ type: "error", message: catRes.message || "Failed to load categories." });
    }

    if (tmplRes.success && Array.isArray(tmplRes.data)) {
      setTemplates(
        tmplRes.data.map((t: Template) => ({
          id: t._id || t.id || "",
          name: t.name,
          categoryId: typeof t.categoryId === "object" && t.categoryId ? t.categoryId._id : t.categoryId || "",
          subcategoryId: t.subcategoryId || "",
          imageUrl: t.previewImageKey || TEMPLATE_PLACEHOLDER_IMAGE,
          status: t.isActive === false ? "Saved on Draft" : "Published",
          createdAt: t.createdAt ? new Date(t.createdAt).toISOString().split("T")[0] : "",
        }))
      );
    } else {
      setFeedback({ type: "error", message: tmplRes.message || "Failed to load templates." });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCategory = async (name: string) => {
    const res = await categoryService.createCategory({ name });
    if (!res.success) {
      setFeedback({ type: "error", message: res.message || "Failed to add category." });
      return;
    }
    setFeedback({ type: "success", message: `Category "${name}" added.` });
    await loadData();
  };

  const handleAddSubcategory = async (categoryId: string, name: string) => {
    const parent = rawCategories.find((c) => c._id === categoryId);
    if (!parent) {
      setFeedback({ type: "error", message: "Select a valid category first." });
      return;
    }
    const res = await categoryService.updateCategory(categoryId, {
      subcategories: [...(parent.subcategories || []).map((sub) => ({ name: sub.name, isActive: sub.isActive })), { name }],
    });
    if (!res.success) {
      setFeedback({ type: "error", message: res.message || "Failed to add subcategory." });
      return;
    }
    setFeedback({ type: "success", message: `Subcategory "${name}" added.` });
    await loadData();
  };

  const handleAddTemplate = async (data: {
    name: string;
    categoryId: string;
    subcategoryId: string;
    isPublished: boolean;
  }) => {
    const res = await templateService.createTemplate({
      name: data.name,
      categoryId: data.categoryId || undefined,
      subcategoryId: data.subcategoryId || undefined,
      isPublished: data.isPublished,
    });
    if (!res.success) {
      setFeedback({ type: "error", message: res.message || "Failed to create template." });
      return;
    }
    setFeedback({ type: "success", message: `Template "${data.name}" created.` });
    await loadData();
  };

  const handleSaveEditedTemplate = async (updated: TemplateItem) => {
    const res = await templateService.updateTemplate(updated.id, {
      name: updated.name,
      categoryId: updated.categoryId || undefined,
      subcategoryId: updated.subcategoryId || undefined,
      isPublished: updated.status === "Published",
    });
    if (!res.success) {
      setFeedback({ type: "error", message: res.message || "Failed to update template." });
      return;
    }
    setFeedback({ type: "success", message: "Template updated." });
    await loadData();
  };

  const handleDeleteTemplate = async (id: string) => {
    const res = await templateService.deleteTemplate(id);
    if (!res.success) {
      setFeedback({ type: "error", message: res.message || "Failed to delete template." });
      return;
    }
    setFeedback({ type: "success", message: "Template deleted." });
    await loadData();
  };

  return (
    <div className="w-full min-h-full bg-white">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <svg className="w-6 h-6 text-[#FF5B22] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <h1 className="text-base font-bold text-gray-800">Template Settings</h1>
        </div>
        <UserNavDropdown />
      </header>

      {/* Page Content */}
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6 pb-24">
        {feedback && (
          <div
            className={`p-3 rounded-md text-xs font-medium flex items-center justify-between gap-3 border ${
              feedback.type === "error" ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <span className="break-words min-w-0">{feedback.message}</span>
            <button type="button" onClick={() => setFeedback(null)} className="font-semibold shrink-0 cursor-pointer">
              Dismiss
            </button>
          </div>
        )}
        {loading && <p className="text-xs text-gray-500 font-medium">Loading templates...</p>}
        <AddNewTemplateCard
          categories={categories}
          subcategories={subcategories}
          onOpenAddCategory={() => setIsAddCatOpen(true)}
          onOpenAddSubcategory={() => setIsAddSubOpen(true)}
          onAddTemplate={handleAddTemplate}
        />

        <TemplateFilterGrid
          templates={templates}
          categories={categories}
          subcategories={subcategories}
          onEditTemplate={(tpl) => setEditingTemplate(tpl)}
        />
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddCatOpen}
        onClose={() => setIsAddCatOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <AddSubcategoryModal
        isOpen={isAddSubOpen}
        onClose={() => setIsAddSubOpen(false)}
        categories={categories}
        onAddSubcategory={handleAddSubcategory}
      />

      <EditTemplateModal
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        template={editingTemplate}
        categories={categories}
        subcategories={subcategories}
        onSave={handleSaveEditedTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
}

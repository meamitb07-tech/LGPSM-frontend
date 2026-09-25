"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import AddNewTemplateCard from "@/components/settings/AddNewTemplateCard";
import TemplateFilterGrid from "@/components/settings/TemplateFilterGrid";
import AddCategoryModal from "@/components/settings/modals/AddCategoryModal";
import AddSubcategoryModal from "@/components/settings/modals/AddSubcategoryModal";
import EditTemplateModal from "@/components/settings/modals/EditTemplateModal";
import { categoryService, Category } from "@/services/categoryService";
import { templateService, Template } from "@/services/templateService";
import {
  initialCategories,
  initialSubcategories,
  initialTemplates,
} from "@/data/settingsData";
import {
  TemplateCategory,
  TemplateSubcategory,
  TemplateItem,
} from "@/types/settings";

export default function TemplateSettingsPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<TemplateCategory[]>(initialCategories);
  const [subcategories, setSubcategories] = useState<TemplateSubcategory[]>(
    initialSubcategories
  );
  const [templates, setTemplates] = useState<TemplateItem[]>(initialTemplates);

  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [catRes, tmplRes] = await Promise.allSettled([
        categoryService.getCategories(),
        templateService.getTemplates(),
      ]);

      if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value.data)) {
        const backendCats: TemplateCategory[] = catRes.value.data.map((c: Category) => ({
          id: c._id || c.id || c.name.toLowerCase().replace(/\s+/g, "-"),
          name: c.name,
        }));
        if (backendCats.length > 0) {
          setCategories(backendCats);
        }
      }

      if (tmplRes.status === "fulfilled" && tmplRes.value?.success && Array.isArray(tmplRes.value.data)) {
        const backendTmpls: TemplateItem[] = tmplRes.value.data.map((t: Template) => ({
          id: t._id || t.id || Date.now().toString(),
          name: t.name,
          categoryId: t.categoryId || "personal",
          subcategoryId: t.subcategoryId || "birthday",
          imageUrl: t.previewImageKey || "/images/auth/login_side_img.png",
          status: t.isPublished ? "Published" : "Saved on Draft",
          createdAt: t.createdAt ? new Date(t.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        }));
        if (backendTmpls.length > 0) {
          setTemplates(backendTmpls);
        }
      }
    } catch (err) {
      console.error("Failed to load settings templates/categories:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCategory = async (name: string) => {
    const newCat: TemplateCategory = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
    };
    setCategories((prev) => [...prev, newCat]);
    try {
      await categoryService.createCategory({ name });
      loadData();
    } catch (e) {}
  };

  const handleAddSubcategory = (categoryId: string, name: string) => {
    const newSub: TemplateSubcategory = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      categoryId,
      name,
    };
    setSubcategories((prev) => [...prev, newSub]);
  };

  const handleAddTemplate = async (data: {
    name: string;
    categoryId: string;
    subcategoryId: string;
    isPublished: boolean;
  }) => {
    const newTpl: TemplateItem = {
      id: Date.now().toString(),
      name: data.name,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      imageUrl: "/images/auth/login_side_img.png",
      status: data.isPublished ? "Published" : "Saved on Draft",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTemplates((prev) => [newTpl, ...prev]);

    try {
      await templateService.createTemplate({
        name: data.name,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        isPublished: data.isPublished,
      });
      loadData();
    } catch (err) {
      console.error("Failed to create template on backend:", err);
    }
  };

  const handleSaveEditedTemplate = async (updated: TemplateItem) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    try {
      await templateService.updateTemplate(updated.id, {
        name: updated.name,
        categoryId: updated.categoryId,
        subcategoryId: updated.subcategoryId,
        isPublished: updated.status === "Published",
      });
      loadData();
    } catch (e) {}
  };

  const handleDeleteTemplate = async (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    try {
      await templateService.deleteTemplate(id);
    } catch (e) {}
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

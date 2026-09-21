"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import UserNavDropdown from "@/components/common/UserNavDropdown";
import AddNewTemplateCard from "@/components/settings/AddNewTemplateCard";
import TemplateFilterGrid from "@/components/settings/TemplateFilterGrid";
import AddCategoryModal from "@/components/settings/modals/AddCategoryModal";
import AddSubcategoryModal from "@/components/settings/modals/AddSubcategoryModal";
import EditTemplateModal from "@/components/settings/modals/EditTemplateModal";
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

  const handleAddCategory = (name: string) => {
    const newCat: TemplateCategory = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const handleAddSubcategory = (categoryId: string, name: string) => {
    const newSub: TemplateSubcategory = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      categoryId,
      name,
    };
    setSubcategories((prev) => [...prev, newSub]);
  };

  const handleAddTemplate = (data: {
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
  };

  const handleSaveEditedTemplate = (updated: TemplateItem) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="w-full min-h-full bg-white">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <h1 className="text-base font-bold text-gray-800">Template Settings</h1>
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

"use client";

import React from "react";
import Image from "next/image";
import { TemplateItem } from "@/types/settings";

interface TemplateGridItemProps {
  template: TemplateItem;
  onEdit: (template: TemplateItem) => void;
}

export default function TemplateGridItem({ template, onEdit }: TemplateGridItemProps) {
  const isPublished = template.status === "Published";

  return (
    <div className="group relative bg-white border border-gray-200 rounded-md overflow-hidden shadow-xs hover:shadow-md transition-all">
      {/* Thumbnail Image Container */}
      <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        <Image
          src={template.imageUrl || "/images/auth/login_side_img.png"}
          alt={template.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top-Right Edit Button */}
        <button
          onClick={() => onEdit(template)}
          className="absolute top-2.5 right-2.5 p-1.5 bg-black/40 text-white rounded-md hover:bg-black/70 transition-colors z-10"
          title="Edit Template"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>

        {/* Bottom Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-center">
          <span
            className={`px-3 py-1 rounded-md text-[11px] font-semibold shadow-xs ${
              isPublished
                ? "bg-[#FF5B22] text-white"
                : "bg-white/95 text-gray-800 backdrop-blur-xs border border-gray-200"
            }`}
          >
            {template.status}
          </span>
        </div>
      </div>
    </div>
  );
}

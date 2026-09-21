"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface MobileCardPreviewProps {
  selectedTemplateSrc: string;
  onOpenTemplateModal: () => void;
}

export default function MobileCardPreview({
  selectedTemplateSrc,
  onOpenTemplateModal,
}: MobileCardPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState("100%");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageContainerRef.current) {
      gsap.fromTo(
        imageContainerRef.current,
        { opacity: 0.3, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [selectedTemplateSrc]);

  return (
    <div className="w-full bg-white border-l border-gray-200 p-6 flex flex-col items-center justify-between min-h-full font-[family-name:var(--font-space-grotesk)]">
      {/* Top Controls Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 rounded-md text-gray-700 shadow-2xs">
          Preview
        </span>

        <select
          value={zoomLevel}
          onChange={(e) => setZoomLevel(e.target.value)}
          className="text-xs font-semibold px-2 py-1 bg-white border border-gray-200 rounded-md text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="100%">100%</option>
          <option value="75%">75%</option>
          <option value="50%">50%</option>
        </select>
      </div>

      {/* Smartphone Outer Container */}
      <div className="my-auto py-2 flex flex-col items-center">
        <div className="relative w-[230px] sm:w-[250px] aspect-[9/18] bg-black rounded-[36px] p-2.5 shadow-2xl border-[3px] border-gray-800">
          {/* Speaker / Camera Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-black rounded-full z-20 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gray-900 rounded-full border border-gray-800" />
          </div>

          {/* Screen Display Area */}
          <div
            ref={imageContainerRef}
            className="relative w-full h-full rounded-[28px] overflow-hidden bg-gray-100 flex items-center justify-center transition-all duration-300"
          >
            <Image
              src={selectedTemplateSrc}
              alt="Invitation Card Preview"
              fill
              priority
              sizes="300px"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Change Template Button */}
        <button
          onClick={onOpenTemplateModal}
          className="mt-6 px-5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
        >
          Change Template
        </button>

        <p className="text-[11px] text-gray-500 font-medium mt-3">
          Looking for custom card design?{" "}
          <a href="#" className="text-[#FF5B22] font-semibold hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}

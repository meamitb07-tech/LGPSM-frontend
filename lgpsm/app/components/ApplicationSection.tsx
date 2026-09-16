"use client";

import React, { useEffect, useRef } from "react";
import StatsBanner from "./application/StatsBanner";
import HowItWorks from "./application/HowItWorks";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ApplicationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#212629] text-white font-[family-name:var(--font-space-grotesk)] relative overflow-hidden">
      {/* Subtle Grainy Noise Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="grainNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainNoise)" />
        </svg>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10">
        <StatsBanner />

        {/* Sleek Gradient Divider Line matching design */}
        <div className="w-full max-w-[1680px] mx-auto px-6 lg:px-12 my-2">
          <div ref={dividerRef} className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-600/100 to-transparent origin-center" />
        </div>

        <HowItWorks />
      </div>
    </div>
  );
}


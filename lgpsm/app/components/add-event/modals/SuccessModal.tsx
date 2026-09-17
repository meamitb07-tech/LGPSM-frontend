"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && overlayRef.current && modalRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
        gsap.fromTo(
          modalRef.current,
          { scale: 0.75, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavigate = () => {
    onClose();
    router.push("/dashboard");
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-[family-name:var(--font-space-grotesk)]">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center overflow-hidden my-auto relative">
        {/* Success Green Check Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
          <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Event Creation Successful!</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-6 max-w-xs mx-auto">
          Kindly proceed with sending the invitations from the &lsquo;Event Management&rsquo; details page or the &lsquo;Invitees Management&rsquo; page.
        </p>

        <button
          onClick={handleNavigate}
          className="w-full py-3 bg-[#FF5B22] hover:bg-[#E04B16] text-white font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer"
        >
          Go to your Invitees Management
        </button>
      </div>
    </div>
  );
}

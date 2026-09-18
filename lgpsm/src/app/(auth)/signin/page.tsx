"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { gsap } from "gsap";

export default function SigninPage() {
  const router = useRouter();
  const { login } = useAuth();

  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, x: -30, scale: 0.97 },
          { opacity: 1, x: 0, scale: 1, duration: 0.65, ease: "power2.out" }
        );
      }
      if (formRef.current) {
        gsap.fromTo(
          formRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: "power2.out",
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("show_dashboard_popup", "true");
        }
        router.push("/dashboard");
      } else {
        setErrorMessage(res.message || "Invalid credentials. Please check your email and password.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex bg-white font-[family-name:var(--font-space-grotesk)] relative overflow-hidden">
      {/* ── Left Hero Side (Orange Panel) ── */}
      <div className="hidden lg:flex w-[40%] xl:w-[42%] bg-[#FF5B22] items-center relative shrink-0 h-full">
        {/* Soft Radial Sunburst Ray Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <svg className="w-full h-full object-cover" viewBox="0 0 600 600" fill="none">
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              return (
                <polygon
                  key={i}
                  points={`300,300 ${(300 + 900 * Math.cos(rad - 0.1)).toFixed(4)},${(300 + 900 * Math.sin(rad - 0.1)).toFixed(4)} ${(300 + 900 * Math.cos(rad + 0.1)).toFixed(4)},${(300 + 900 * Math.sin(rad + 0.1)).toFixed(4)}`}
                  fill="#FFFFFF"
                />
              );
            })}
          </svg>
        </div>

        {/* Overlapping Image Card */}
        <div ref={heroRef} className="relative z-20 w-[100%] h-[85vh] max-h-[720px] rounded-[12px] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.35)] border border-white/20 ml-8 xl:ml-12 shrink-0 my-auto">
          <Image
            src="/images/auth/Auth.png"
            alt="Admin Login Banner"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* ── Right Form Side ── */}
      <div className="w-full lg:w-[60%] xl:w-[58%] flex flex-col justify-center p-6 sm:p-10 lg:py-6 lg:pl-32 lg:pr-16 max-w-[700px] relative z-10 my-auto overflow-y-auto lg:overflow-y-visible">
        <div ref={formRef} className="w-full">
          {/* Brand Logo */}
          <div className="mb-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/navbar/Nav_logo.png"
                alt="LGPSM Logo"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Back to Home Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-900 hover:text-[#FF5B22] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1.5">
              Sign in your account
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              Welcome back! Login to Admin Dashboard
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign In Button (Placeholder until OAuth phase) */}
          <button
            type="button"
            disabled
            title="Google login will be integrated in future release"
            className="w-full py-3 px-4 border border-gray-200/90 rounded-lg bg-[#F8F9FA] opacity-60 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-gray-500 transition-all cursor-not-allowed shadow-none mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            Sign in with Google (Coming Soon)
          </button>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-gray-200/80"></div>
            <span className="absolute bg-white px-3 text-[11px] font-semibold text-gray-400 tracking-widest">
              OR
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Email Address<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200/90 rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                Password<span className="text-[#FF5B22] ml-0.5">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Type your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200/90 rounded-lg text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all pr-10 font-[family-name:var(--font-space-grotesk)] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 013.98-1.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#FF5B22] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-gray-500 font-medium">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-gray-900 hover:underline underline-offset-2"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#FF5B22] hover:bg-[#E04B16] text-white text-sm font-bold rounded-lg shadow-sm transition-all hover:shadow cursor-pointer mt-6 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Bottom Sign up Link */}
        <div className="text-center pt-8 text-xs text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#FF5B22] font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

export function WelcomeBanner() {
  const { user, loading } = useSupabaseAuth();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) return;

    const hasDismissed = localStorage.getItem("welcome-banner-dismissed");
    if (hasDismissed) return;

    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [user, loading]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("welcome-banner-dismissed", "true");
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible || user) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-9998 transition-transform duration-500 ease-out ${
        dismissed ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="bg-gradient-to-r from-[#c9a98a] via-[#e8c9b0] to-[#c9a98a] border-b border-[#b8956e] shadow-md">
        <div className="px-3 sm:px-4 py-2.5 sm:py-3">

          {/* Mobile layout: stacked */}
          <div className="flex flex-col gap-2 sm:hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className="h-3.5 w-3.5 text-[#7a4f2e] shrink-0 mt-0.5" />
                <p className="text-xs text-[#4a2e1a] font-medium leading-snug">
                  Welcome to Mahz-Skin! Sign in to save your cart &amp; wishlist.
                </p>
              </div>
              <button
                onClick={handleDismiss}
                aria-label="Dismiss banner"
                className="p-1 text-[#4a2e1a] hover:text-[#7a4f2e] transition-colors shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="flex-1 text-center text-xs font-semibold px-3 py-1.5 rounded bg-[#4a2e1a] text-white hover:bg-[#3a2010] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 text-center text-xs font-semibold px-3 py-1.5 rounded border border-[#4a2e1a] text-[#4a2e1a] hover:bg-[#4a2e1a] hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Tablet & desktop layout: single row */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Sparkles className="h-4 w-4 text-[#7a4f2e] shrink-0" />
              <p className="text-sm text-[#4a2e1a] font-medium">
                <span className="hidden md:inline">
                  Welcome to Malz-Skin! ✨ Sign in or create an account to save your cart and enjoy the full experience.
                </span>
                <span className="md:hidden">
                  Welcome to Malz-Skin! ✨ Sign in to save your cart &amp; wishlist.
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/auth/login"
                className="text-xs font-semibold px-3 py-1.5 rounded bg-[#4a2e1a] text-white hover:bg-[#3a2010] transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-xs font-semibold px-3 py-1.5 rounded border border-[#4a2e1a] text-[#4a2e1a] hover:bg-[#4a2e1a] hover:text-white transition-colors whitespace-nowrap"
              >
                Sign Up
              </Link>
              <button
                onClick={handleDismiss}
                aria-label="Dismiss banner"
                className="p-1 text-[#4a2e1a] hover:text-[#7a4f2e] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

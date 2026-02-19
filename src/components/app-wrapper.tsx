"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "./loading-screen";
import { loadCurrencyRates } from "@/lib/currency-rates";

interface AppWrapperProps {
  children: React.ReactNode;
}

// Custom hook to handle hydration without cascading renders
function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Use setTimeout to defer state update and avoid cascading renders
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return isHydrated;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const isHydrated = useHydration();

  // Always start with loading screen to ensure server/client consistency
  const [showLoading, setShowLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Handle session storage check after hydration
  useEffect(() => {
    if (!isHydrated) return;

    // Load currency rates from API or cache
    loadCurrencyRates();

    // Defer state updates to avoid cascading renders
    const timer = setTimeout(() => {
      // Check if user has visited before
      const hasVisited = window.sessionStorage?.getItem("hasVisited");

      if (hasVisited) {
        // Return visitor - skip loading animation
        setShowLoading(false);
        setShowContent(true);
      } else {
        // First time visitor - show loading animation and set flag
        window.sessionStorage?.setItem("hasVisited", "true");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isHydrated]);

  // Handle loading complete
  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Small delay before showing content
    setTimeout(() => setShowContent(true), 300);
  };

  // Show loading spinner during SSR and initial hydration
  if (!isHydrated) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
      </div>
    );
  }

  return (
    <>
      {/* Loading Screen */}
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main Content */}
      <div
        className={`transition-opacity duration-500 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
        style={{ display: showContent ? "block" : "none" }}
      >
        {children}
      </div>
    </>
  );
}

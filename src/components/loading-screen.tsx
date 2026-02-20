"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const brandName = "MAHZSKIN";
  const letters = brandName.split("");

  useEffect(() => {
    // Start letter animation
    const letterInterval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Only increment if not showing complete state
        if (!showComplete && prev < letters.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 200);

    // Set complete state after all letters are shown
    const completeTimeout = setTimeout(() => {
      setShowComplete(true);
      // Call onComplete after a brief pause
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, letters.length * 200 + 1000);

    return () => {
      clearInterval(letterInterval);
      clearTimeout(completeTimeout);
    };
  }, [letters.length, onComplete, showComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div
        className={`text-center transition-opacity duration-500 ${
          showComplete ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-center space-x-2 mb-6">
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`text-4xl sm:text-6xl md:text-8xl font-bold transition-all duration-500 ${
                index <= currentIndex
                  ? "opacity-100 scale-100"
                  : "opacity-30 scale-75"
              }`}
              style={{
                fontFamily: "serif",
                color: "#E6C6B4",
                textShadow: index <= currentIndex ? "0 0 20px rgba(230, 198, 180, 0.5)" : undefined,
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div
          className={`text-lg md:text-xl font-light tracking-widest transition-all duration-500 ${
            currentIndex >= letters.length - 1
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ color: "#E6C6B4" }}
        >
          Premium Skincare
        </div>

        <div className="flex justify-center space-x-3 mt-8">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: "#E6C6B4",
                animationDelay: `${dot * 200}ms`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

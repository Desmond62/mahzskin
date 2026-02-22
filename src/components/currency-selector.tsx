"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import type { Currency } from "@/lib/types";
import { getCurrency, saveCurrency } from "@/lib/storage";

const CURRENCIES: { code: Currency; name: string }[] = [
  { code: "EUR", name: "Euro" },
  { code: "USD", name: "US Dollar" },
  { code: "GBP", name: "British Pound" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "CHF", name: "Swiss Franc" },
];

export function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    () => getCurrency() as Currency
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (isOpen) {
      // Close the dropdown
      setIsAnimating(false);
      setTimeout(() => setIsOpen(false), 300);
    } else {
      // Open the dropdown
      setIsOpen(true);
      setIsAnimating(true);
    }
  };

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClose]);

  const handleSelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    saveCurrency(currency);
    handleClose();
    window.dispatchEvent(new Event("currencyChange"));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
        aria-label="Select currency"
      >
        {selectedCurrency}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 ${
            isAnimating ? "animate-slide-in-left" : "animate-slide-out-left"
          }`}
        >
          {CURRENCIES.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleSelect(currency.code)}
              className={`w-full px-4 py-3 text-left text-sm hover:bg-accent transition-colors ${
                selectedCurrency === currency.code
                  ? "bg-accent font-medium"
                  : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{currency.name}</span>
                <span className="text-muted-foreground">{currency.code}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

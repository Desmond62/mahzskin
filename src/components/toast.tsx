"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-top-2 ${getBgColor()}`}
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent<Toast>) => {
      // Generate a truly unique ID using timestamp + random number
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { ...event.detail, id: uniqueId };
      setToasts((prev) => [...prev, newToast]);
    };

    window.addEventListener("showToast", handleToast as EventListener);
    return () => window.removeEventListener("showToast", handleToast as EventListener);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

// Helper function to show toasts with duplicate prevention
let lastToastTime = 0;
let lastToastMessage = "";

export function showToast(message: string, type: "success" | "error" | "info" = "info", duration = 3000) {
  const now = Date.now();
  
  // Prevent duplicate toasts within 500ms with the same message
  if (now - lastToastTime < 500 && message === lastToastMessage) {
    return;
  }
  
  lastToastTime = now;
  lastToastMessage = message;
  
  const toast: Toast = { id: "", message, type, duration };
  window.dispatchEvent(new CustomEvent("showToast", { detail: toast }));
}
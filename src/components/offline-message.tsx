"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface OfflineMessageProps {
  onRetry?: () => void;
  message?: string;
}

export function OfflineMessage({ 
  onRetry, 
  message = "Unable to load content" 
}: OfflineMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-accent/50 rounded-full p-6 mb-6">
        <WifiOff className="h-16 w-16 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">No Internet Connection</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {message}. Please check your internet connection and try again.
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} size="lg" className="gap-2">
          <RefreshCw className="h-5 w-5" />
          Try Again
        </Button>
      )}
      
      <p className="text-xs text-muted-foreground mt-4">
        Make sure you have an active internet connection
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "./ui/button";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export function ComingSoon({ 
  title = "COMING SOON!", 
  description = "We're working hard to bring you something amazing. Stay tuned!" 
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-[#F8E7DD] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">
          {description}
        </p>

        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="h-px w-16 bg-primary/30" />
          <div className="h-2 w-2 rounded-full bg-primary" />
          <div className="h-px w-16 bg-primary/30" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/shop">
              Shop Now
            </Link>
          </Button>
        </div>

        {/* Newsletter Signup Hint */}
        <p className="text-sm text-muted-foreground pt-8">
          Want to be notified when we launch? Join our newsletter for updates!
        </p>
      </div>
    </div>
  );
}

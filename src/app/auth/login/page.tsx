"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Label, Loader } from "@/components/ui";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

// Define User type for storage (includes password)
interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Define User type for auth (no password)
interface User {
  id: string;
  name: string;
  email: string;
}

// 1️⃣ Define validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState("");
  const router = useRouter();

  // Helper function to get display name from full name
  const getDisplayName = (fullName: string): string => {
    const firstName = fullName.trim().split(' ')[0];
    // If first name is 4+ characters, take first 3 letters and capitalize
    if (firstName.length >= 4) {
      return firstName.substring(0, 3).toUpperCase();
    }
    // Otherwise, use the full first name
    return firstName.toUpperCase();
  };

  // 2️⃣ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 3️⃣ Handle login validation + localStorage check
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    const { email, password } = formData;
    const storedUsers: StoredUser[] = JSON.parse(
      localStorage.getItem("fw_users") || "[]"
    );

    // 4️⃣ If no user in localStorage → go to signup
    if (!storedUsers.length) {
      router.push("/auth/signup");
      return;
    }

    // 5️⃣ Check if user exists
    const foundStoredUser = storedUsers.find(
      (user: StoredUser) => user.email === email && user.password === password
    );

    if (!foundStoredUser) {
      // Check if email exists but password is wrong
      const emailExists = storedUsers.some(
        (user: StoredUser) => user.email === email
      );
      if (!emailExists) {
        router.push("/auth/signup"); // not registered → redirect to signup
        return;
      }

      setErrors({ password: "Incorrect password" });
      setIsLoading(false);
      return;
    }

    // 6️⃣ Save logged-in user (without password)
    const user: User = {
      id: foundStoredUser.id,
      name: foundStoredUser.name,
      email: foundStoredUser.email
    };
    localStorage.setItem("fw_user", JSON.stringify(user));
    
    // Dispatch event to update UI
    window.dispatchEvent(new Event("userChanged"));

    // Set display name and show success message
    const displayName = getDisplayName(foundStoredUser.name);
    setUserDisplayName(displayName);
    setShowSuccess(true);
    setIsLoading(false);

    // Navigate to home after showing success message
    setTimeout(() => {
      router.push("/");
    }, 3000); // Show success message for 3 seconds
  };

  return (
    <div className="min-h-screen bg-[#F8E7DD] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          {showSuccess ? (
            // Success Message
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-green-600 mb-2">
                  Welcome Back!
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                  Hi <span className="font-bold text-primary">{userDisplayName}</span>! 👋
                </p>
                <p className="text-sm text-gray-600">
                  You&apos;ve been successfully logged in. You&apos;ll be redirected to the homepage shortly.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-gray-600">Redirecting...</span>
              </div>
            </div>
          ) : (
            // Login Form
            <>
              <h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* SUBMIT */}
            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
              {isLoading && <Loader className="h-5 w-5" />}
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

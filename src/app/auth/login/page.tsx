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

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={() => {
              // TODO: Implement Google Sign In
              console.log("Google Sign In clicked");
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </button>

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

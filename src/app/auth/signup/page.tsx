"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Label, Loader } from "@/components/ui";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

// Define User type
interface User {
  id: string;
  name: string;
  email: string;
}

// Define StoredUser type (includes password for storage)
interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

// 1️⃣ Define validation schema
const signupSchema = z
  .object({
    name: z.string().min(3, "Full name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // 3️⃣ Handle submit with validation + localStorage
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const result = signupSchema.safeParse(formData);

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

    const { name, email, password } = formData;
    const existingUsers: StoredUser[] = JSON.parse(
      localStorage.getItem("mahzskin_users") || "[]"
    );

    const userExists = existingUsers.some((user: StoredUser) => user.email === email);
    if (userExists) {
      setErrors({ email: "Email already registered" });
      setIsLoading(false);
      return;
    }

    const userId = Date.now().toString();
    const newStoredUser = { 
      id: userId,
      name, 
      email,
      password // Store password for login verification
    };
    const newUser: User = { 
      id: userId,
      name, 
      email 
    };
    
    localStorage.setItem("mahzskin_users", JSON.stringify([...existingUsers, newStoredUser]));
    localStorage.setItem("mahzskin_user", JSON.stringify(newUser));
    
    // Dispatch event to update UI
    window.dispatchEvent(new Event("userChanged"));

    // Set display name and show success message
    const displayName = getDisplayName(name);
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
                    Welcome to MalzSkin!
                  </h1>
                  <p className="text-lg text-gray-700 mb-4">
                    Hi <span className="font-bold text-primary">{userDisplayName}</span>! 👋
                  </p>
                  <p className="text-sm text-gray-600">
                    Your account has been created successfully. You&apos;ll be redirected to the homepage shortly.
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-gray-600">Redirecting...</span>
                </div>
              </div>
            ) : (
              // Registration Form
              <>
                <h1 className="text-2xl font-bold text-center mb-8">
                  Create Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
            {/* FULL NAME */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

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

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
              {isLoading && <Loader className="h-5 w-5" />}
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
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

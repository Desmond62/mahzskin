"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button, Loader } from "@/components/ui";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thanks for contacting us. We'll get back to you as soon as possible.",
        });
        setFormData({ name: "", email: "", phone: "", comment: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8E7DD]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-12">CONTACT US</h1>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className=" p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Send us an email</h2>
            <p className="text-sm text-gray-600 mb-6">
              Ask us anything. We&apos;re here to help.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border  bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border  bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border  bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-2">
                  Comment *
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                />
              </div>

              {submitStatus.type && (
                <div
                  className={`p-4 rounded-md ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black  text-white hover:bg-gray-800 py-3 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader className="h-5 w-5" />}
                {isSubmitting ? "SENDING..." : "SUBMIT CONTACT"}
              </Button>
            </form>
          </div>

          {/* Live Help */}
          <div className="bg- p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Live Help</h2>
            <p className="text-sm text-gray-600 mb-6">
              If you have an issue or question that requires immediate assistance, you can get a call through to us. If you aren&apos;t available, drop us an email to the address we will get back to you within 24-48 hours
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1 shrink-0" />
                <div>
                  <p className="font-medium">WhatsApp: +234707723208</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 shrink-0" />
                <div>
                  <a
                    href="mailto:info@fairandwhite.com"
                    className=" hover:underline"
                  >
                   mahzskinltd@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 shrink-0" />
                <div>
                  <p>Kaduna 1, opp. Victory Plaza,</p>
                  <p>Tradefair,</p>
                  <p>Lagos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

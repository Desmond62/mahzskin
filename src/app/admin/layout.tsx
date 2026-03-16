"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { checkIsAdmin } from "@/lib/supabase/admin";
import { Loader } from "@/components/ui";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function verifyAdmin() {
      try {
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
        if (!adminStatus) router.push("/");
      } catch {
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }
    verifyAdmin();
  }, [router]);

  const openSidebar = () => {
    setSidebarOpen(true);
    setTimeout(() => setSidebarVisible(true), 10);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
    setTimeout(() => setSidebarOpen(false), 300);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8E7DD] flex items-center justify-center">
        <Loader className="h-8 w-8" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#F8E7DD]">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="font-bold text-gray-900 text-sm">Admin Panel</p>
          <p className="text-xs text-gray-500">Mahz Skin</p>
        </div>
        <button onClick={openSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${sidebarVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeSidebar}
          />
          <div
            className={`relative w-72 bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-in-out ${sidebarVisible ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="p-5 flex items-center justify-between border-b border-gray-200">
              <div>
                <p className="font-bold text-gray-900">Admin Panel</p>
                <p className="text-xs text-gray-500">Mahz Skin</p>
              </div>
              <button onClick={closeSidebar} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === href ? "bg-black text-white" : "text-gray-700 hover:bg-[#F8E7DD]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 space-y-1">
              <Link
                href="/"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#F8E7DD] rounded-lg transition-colors w-full"
              >
                <ExternalLink className="h-5 w-5" />
                <span>View Store</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Mahz Skin</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === href ? "bg-black text-white" : "text-gray-700 hover:bg-[#F8E7DD]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#F8E7DD] rounded-lg transition-colors w-full"
          >
            <ExternalLink className="h-5 w-5" />
            <span>View Store</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 lg:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}

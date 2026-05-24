"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  User,
  LogOut,
  Sun,
  Moon,
  Leaf,
  ChevronRight,
  Languages,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import "@/lib/i18n";
import { useAuthStore, useThemeStore, useLangStore } from "@/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { dark, toggle, init } = useThemeStore();
  const { lang, setLang } = useLangStore();

  // Zustand store'un localStorage'dan yüklenmesini bekle
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    init();
    i18n.changeLanguage(lang);
  }, []);

  useEffect(() => {
    // Sadece mount olduktan sonra kontrol et
    if (mounted && !user) {
      router.push("/auth/login");
    }
  }, [mounted, user]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const NAV = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/products", icon: Package, label: t("nav.products") },
    { to: "/users", icon: Users, label: t("nav.users"), adminOnly: true },
    { to: "/profile", icon: User, label: t("nav.profile") },
  ];

  const navItems = NAV.filter((n) => !n.adminOnly || user?.role === "admin");

  // Mount olmadan veya kullanıcı yoksa boş ekran göster (login'e yönlendirme useEffect'te)
  if (!mounted || !user) return null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
          },
        }}
      />

      <aside
        className="w-64 flex flex-col border-r shrink-0"
        style={{ background: "var(--bg-card)" }}
      >
        <div className="px-6 py-5 border-b flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--brand)" }}
          >
            <Leaf size={16} className="text-white" />
          </div>
          <div>
            <div
              className="font-display font-bold text-sm"
              style={{ color: "var(--text)" }}
            >
              PassportX
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                href={to}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-all",
                  active ? "text-white" : "hover:opacity-80",
                )}
                style={
                  active
                    ? { background: "var(--brand)" }
                    : { color: "var(--text-muted)" }
                }
              >
                <Icon size={16} />
                <span>{label}</span>
                {active && (
                  <ChevronRight size={12} className="ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t space-y-1">
          <div
            className="px-3 py-2.5 rounded-lg mb-1"
            style={{ background: "var(--bg-subtle)" }}
          >
            <div
              className="text-xs font-display font-semibold truncate"
              style={{ color: "var(--text)" }}
            >
              {user.full_name}
            </div>
            <div
              className="text-[10px] font-mono mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {user.role}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-display font-medium transition hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <Languages size={16} />
            {lang === "tr" ? "English" : "Türkçe"}
          </button>

          <button
            type="button"
            onClick={toggle}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-display font-medium transition hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? t("nav.lightMode") : t("nav.darkMode")}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-display font-medium transition hover:opacity-70 text-red-500"
          >
            <LogOut size={16} />
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

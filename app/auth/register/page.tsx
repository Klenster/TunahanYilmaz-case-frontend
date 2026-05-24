"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import api from "@/lib/api";
import { useLangStore } from "@/store";

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { lang, setLang } = useLangStore();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.full_name || form.full_name.trim().length < 2)
      errs.full_name = t("register.errors.name");
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = t("register.errors.email");
    if (!form.password || form.password.length < 8)
      errs.password = t("register.errors.password");
    else if (!/[A-Z]/.test(form.password))
      errs.password = t("register.errors.passwordUpper");
    else if (!/[0-9]/.test(form.password))
      errs.password = t("register.errors.passwordNumber");
    if (form.password !== form.confirm)
      errs.confirm = t("register.errors.confirm");
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await api.post("/auth/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });
      toast.success(t("register.success"));
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t("register.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          },
        }}
      />
      <div className="w-full max-w-sm animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--brand)" }}
            >
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <div
                className="font-display font-bold text-lg"
                style={{ color: "var(--text)" }}
              >
                PassportX
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            className="text-xs font-mono px-2 py-1 rounded border transition hover:opacity-70"
            style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
          >
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </div>

        <div className="card p-6">
          <h1
            className="font-display font-bold text-xl mb-1"
            style={{ color: "var(--text)" }}
          >
            {t("register.title")}
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {t("register.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t("register.fullName")}</label>
              <input
                className="input"
                value={form.full_name}
                onChange={set("full_name")}
              />
              {errors.full_name && (
                <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>
              )}
            </div>
            <div>
              <label className="label">{t("register.email")}</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={set("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="label">{t("register.password")}</label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={set("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="label">{t("register.confirmPassword")}</label>
              <input
                className="input"
                type="password"
                value={form.confirm}
                onChange={set("confirm")}
              />
              {errors.confirm && (
                <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>
              )}
            </div>
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? t("register.loading") : t("register.submit")}
            </button>
          </form>
        </div>

        <p
          className="text-center text-sm mt-4"
          style={{ color: "var(--text-muted)" }}
        >
          {t("register.hasAccount")}{" "}
          <Link
            href="/auth/login"
            className="font-medium"
            style={{ color: "var(--brand)" }}
          >
            {t("register.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import api from "@/lib/api";
import { useAuthStore, useLangStore } from "@/store";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { lang, setLang } = useLangStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = t("login.errors.email");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = t("login.errors.emailInvalid");
    if (!form.password) errs.password = t("login.errors.password");
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
      const { data } = await api.post("/auth/login", form);
      setAuth(data.user, data.access_token);
      toast.success(t("login.welcome", { name: data.user.full_name }));
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t("login.failed"));
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
            {t("login.title")}
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {t("login.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t("login.email")}</label>
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
              <label className="label">{t("login.password")}</label>
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
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? t("login.loading") : t("login.submit")}
            </button>
          </form>
        </div>

        <p
          className="text-center text-sm mt-4"
          style={{ color: "var(--text-muted)" }}
        >
          {t("login.noAccount")}{" "}
          <Link
            href="/auth/register"
            className="font-medium"
            style={{ color: "var(--brand)" }}
          >
            {t("login.createOne")}
          </Link>
        </p>
      </div>
    </div>
  );
}

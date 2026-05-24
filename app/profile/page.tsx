"use client";

import { useState } from "react";
import { ShieldCheck, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import api from "@/lib/api";
import { useAuthStore } from "@/store";

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPw((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!pw.current) errs.current = t("profile.errors.current");
    if (!pw.next || pw.next.length < 8) errs.next = t("profile.errors.next");
    else if (!/[A-Z]/.test(pw.next)) errs.next = t("profile.errors.nextUpper");
    else if (!/[0-9]/.test(pw.next)) errs.next = t("profile.errors.nextNumber");
    if (pw.next !== pw.confirm) errs.confirm = t("profile.errors.confirm");
    return errs;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await api.patch("/users/me/password", {
        current_password: pw.current,
        new_password: pw.next,
      });
      toast.success(t("profile.updateSuccess"));
      setPw({ current: "", next: "", confirm: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t("profile.updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-lg">
      <h1
        className="font-display font-bold text-2xl"
        style={{ color: "var(--text)" }}
      >
        {t("profile.title")}
      </h1>

      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl text-white"
            style={{ background: "var(--brand)" }}
          >
            {user?.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div
              className="font-display font-bold text-lg"
              style={{ color: "var(--text)" }}
            >
              {user?.full_name}
            </div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              {user?.email}
            </div>
          </div>
        </div>
        <div className="pt-3 border-t">
          <div className="label">{t("profile.role")}</div>
          <span
            className={user?.role === "admin" ? "badge-admin" : "badge-auditor"}
          >
            {user?.role === "admin" ? (
              <ShieldCheck size={11} />
            ) : (
              <Eye size={11} />
            )}
            {user?.role}
          </span>
        </div>
        <div>
          <div className="label">{t("profile.userId")}</div>
          <div
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            {user?.id}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2
          className="font-display font-semibold text-sm mb-4"
          style={{ color: "var(--text)" }}
        >
          {t("profile.changePassword")}
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">{t("profile.currentPassword")}</label>
            <input
              className="input"
              type="password"
              value={pw.current}
              onChange={set("current")}
            />
            {errors.current && (
              <p className="text-xs text-red-500 mt-1">{errors.current}</p>
            )}
          </div>
          <div>
            <label className="label">{t("profile.newPassword")}</label>
            <input
              className="input"
              type="password"
              value={pw.next}
              onChange={set("next")}
            />
            {errors.next && (
              <p className="text-xs text-red-500 mt-1">{errors.next}</p>
            )}
          </div>
          <div>
            <label className="label">{t("profile.confirmPassword")}</label>
            <input
              className="input"
              type="password"
              value={pw.confirm}
              onChange={set("confirm")}
            />
            {errors.confirm && (
              <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>
            )}
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? t("profile.updating") : t("profile.update")}
          </button>
        </form>
      </div>
    </div>
  );
}

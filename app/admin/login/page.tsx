"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { S } from "@/lib/strings";
import { WEDDING_NAMES } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error ?? S.loginError);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <div className="text-3xl mb-4">🔒</div>
          <h1
            className="text-3xl font-light tracking-wide mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {WEDDING_NAMES}
          </h1>
          <p className="text-stone-400 text-sm">{S.adminLoginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-stone-500 mb-1.5 tracking-wide uppercase">
              {S.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-base focus:outline-none focus:border-stone-400 bg-white"
              style={{ fontSize: "16px" }}
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 bg-stone-800 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? "…" : S.loginButton}
          </button>
        </form>
      </div>
    </main>
  );
}

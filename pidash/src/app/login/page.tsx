"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailValid && password.length >= 6 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Connexion impossible. Réessayez.");
        return;
      }
      router.replace(from);
      router.refresh();
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Marque */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-amber-600 text-lg font-bold text-black shadow-lg shadow-amber-500/20">
            ♠
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">PiDash</h1>
            <p className="text-xs text-muted">Console d&apos;exploitation casino</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/40 sm:p-8"
        >
          <h2 className="text-lg font-semibold">Connexion</h2>
          <p className="mt-1 text-sm text-muted">
            Accédez à votre tableau de bord opérateur.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-rose/40 bg-rose/10 px-3 py-2 text-sm text-rose"
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mt-5">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@casino.com"
              className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/60 focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            />
          </div>

          {/* Mot de passe */}
          <div className="mt-4">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 pr-16 text-sm outline-none transition placeholder:text-muted/60 focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-muted transition hover:text-foreground"
              >
                {showPassword ? "Cacher" : "Afficher"}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="mt-4 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-surface-2 accent-gold"
              />
              Se souvenir de moi
            </label>
            <a href="#" className="text-sm text-gold hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-gold to-amber-600 px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            )}
            {loading ? "Connexion…" : "Se connecter"}
          </button>

          {/* Aide démo */}
          <p className="mt-5 rounded-lg bg-surface-2 px-3 py-2 text-center text-xs text-muted">
            Démo · <span className="font-mono text-foreground">admin@pidash.io</span>{" "}
            / <span className="font-mono text-foreground">casino123</span>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          © 2026 PiDash. Jeu responsable · +18 ans.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

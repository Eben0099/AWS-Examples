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
      setError("Réseau indisponible. Vérifiez la connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-[26rem] rise">
        {/* En-tête maison, sur le feutre */}
        <div className="mb-6 text-center">
          <p className="eyebrow">Maison de jeu · Salle privée</p>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-parchment">
            PiDash
          </h1>
        </div>

        {/* Le « ticket » : parchemin posé sur le tapis */}
        <form
          onSubmit={handleSubmit}
          className="relative rounded-[3px] bg-parchment text-ink shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)]"
        >
          {/* Filet laiton du haut, tranche du ticket */}
          <div className="h-1 w-full rounded-t-[3px] bg-gradient-to-r from-brass-dim via-brass to-brass-dim" />

          <div className="p-7 sm:p-8">
            {/* Ligne de registre : référence + accès */}
            <div className="flex items-baseline justify-between border-b border-dashed border-ink/25 pb-3">
              <span className="font-mono text-[0.7rem] uppercase tracking-widest text-ink/55">
                Bulletin d&apos;accès
              </span>
              <span className="font-mono text-[0.7rem] text-ink/45 tnum">
                Nº PIT·001
              </span>
            </div>

            <h2 className="mt-5 font-display text-2xl font-semibold">
              Accès à la salle
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Identifiez-vous pour ouvrir le registre.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-5 border-l-2 border-claret bg-claret/10 px-3 py-2 text-sm text-[#8f2d3d]"
              >
                {error}
              </div>
            )}

            {/* Email — champ de registre, souligné */}
            <div className="mt-6">
              <label
                htmlFor="email"
                className="mb-1 block font-mono text-[0.7rem] uppercase tracking-widest text-ink/55"
              >
                Adresse
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@maison.jeu"
                className="w-full border-0 border-b border-ink/30 bg-transparent px-0 py-2 text-[0.95rem] text-ink outline-none transition placeholder:text-ink/35 focus:border-brass-dim"
              />
            </div>

            {/* Mot de passe */}
            <div className="mt-5">
              <label
                htmlFor="password"
                className="mb-1 block font-mono text-[0.7rem] uppercase tracking-widest text-ink/55"
              >
                Clé
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-0 border-b border-ink/30 bg-transparent px-0 py-2 pr-14 text-[0.95rem] text-ink outline-none transition placeholder:text-ink/35 focus:border-brass-dim"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[0.7rem] uppercase tracking-wide text-ink/50 transition hover:text-ink"
                >
                  {showPassword ? "Masquer" : "Voir"}
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-ink/70">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-[#123a2e]"
                />
                Garder la session
              </label>
              <a href="#" className="text-[#8a6d2e] underline-offset-2 hover:underline">
                Clé oubliée ?
              </a>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-[2px] bg-baize px-4 py-3 font-mono text-sm uppercase tracking-widest text-parchment transition hover:bg-baize-deep disabled:cursor-not-allowed disabled:opacity-45"
            >
              {loading && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-parchment/30 border-t-parchment" />
              )}
              {loading ? "Ouverture…" : "Ouvrir le registre"}
            </button>

            {/* Jeton d'essai */}
            <p className="mt-5 border-t border-dashed border-ink/20 pt-4 text-center text-xs text-ink/55">
              Jeton d&apos;essai —{" "}
              <span className="font-mono text-ink">admin@pidash.io</span> ·{" "}
              <span className="font-mono text-ink">casino123</span>
            </p>
          </div>
        </form>

        <p className="mt-6 text-center font-mono text-[0.7rem] uppercase tracking-widest text-sage/70">
          Jeu responsable · Réservé aux +18 ans
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

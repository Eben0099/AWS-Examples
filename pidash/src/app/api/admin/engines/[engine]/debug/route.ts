import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
// No defensive stripping here; proxy will forward raw engine debug response.
import type { EngineCode } from "@/lib/engine-debug/types";

/**
 * Proxy admin pour les endpoints de debug des moteurs de jeu.
 *
 *   Navigateur ──(cookie session pidash)──▶ ce proxy ──(X-Api-Key)──▶ moteur
 *
 * Le navigateur ne voit jamais la clé moteur : elle vit dans l'env serveur.
 * Le proxy est protégé par la session pidash (même auth que le dashboard) et
 * re-nettoie la réponse (défense en profondeur) avant de la renvoyer.
 */

// Base URL par moteur (surchargables par env), + le chemin debug côté moteur.
const ENGINES: Record<EngineCode, { base: string; path: string }> = {
  roulette: {
    base:
      process.env.ROULETTE_ENGINE_URL ??
      "https://admin.agdtech.pro/api/v1/roulette-engine",
    path: "/admin/debug/draw",
  },
  keno: {
    base:
      process.env.KENO_ENGINE_URL ??
      "https://admin.agdtech.pro/api/v1/keno-engine",
    path: "/admin/debug/draw",
  },
  aviator: {
    base:
      process.env.AVIATOR_ENGINE_URL ??
      "https://admin.agdtech.pro/api/v1/aviator-engine",
    path: "/admin/debug/round",
  },
};

function isEngine(v: string): v is EngineCode {
  return v === "roulette" || v === "keno" || v === "aviator";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ engine: string }> },
) {
  // 1. Auth : réservé aux sessions admin pidash.
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2. Moteur valide ?
  const { engine } = await params;
  if (!isEngine(engine)) {
    return NextResponse.json({ error: "unknown engine" }, { status: 404 });
  }

  // 3. Clé moteur — jamais hardcodée, jamais exposée au client.
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ADMIN_API_KEY manquante côté serveur" },
      { status: 500 },
    );
  }

  // 4. Appel amont.
  const { base, path } = ENGINES[engine];
  let upstream: Response;
  try {
    upstream = await fetch(`${base}${path}`, {
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "engine unreachable" }, { status: 502 });
  }

  if (upstream.status === 401) {
    return NextResponse.json({ error: "engine rejected key" }, { status: 502 });
  }
  if (upstream.status === 404) {
    return NextResponse.json({ error: "no active round" }, { status: 404 });
  }
  if (!upstream.ok) {
    return NextResponse.json(
      { error: `engine error ${upstream.status}` },
      { status: 502 },
    );
  }

  // 5. Nettoyage défensif : on ne relaie jamais un champ d'issue.
  const raw = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
  return NextResponse.json(raw, { status: 200 });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (ex-`middleware` avant Next.js 16) — protection de routes.
 *
 * Il tourne sur le runtime Edge : on se contente donc d'une vérification
 * *légère* de présence du cookie de session (pas de crypto Node ici).
 * La vérification cryptographique complète du token est faite côté serveur
 * dans `getSession()` (voir `src/lib/auth.ts`).
 */

const SESSION_COOKIE = "pidash_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isProtected = pathname === "/" || pathname.startsWith("/dashboard");

  // Route protégée sans session -> redirection vers /login
  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/") url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Déjà connecté et sur /login -> vers le dashboard
  if (pathname === "/login" && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Exclut les assets statiques, l'optimisation d'images et les routes API.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};

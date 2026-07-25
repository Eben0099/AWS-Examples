import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Authentification de démonstration (mock).
 * -----------------------------------------------------------
 * Le "store" d'utilisateurs et la vérification de mot de passe
 * sont volontairement simples pour le prototype. À remplacer par
 * une vraie base de données + hachage (bcrypt/argon2) et, idéalement,
 * un fournisseur d'identité, lors de l'intégration backend.
 */

const SECRET = process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me";

export const SESSION_COOKIE = "pidash_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 heures (en secondes)

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator";
};

type DemoUser = SessionUser & { password: string };

const USERS: DemoUser[] = [
  {
    id: "1",
    email: "admin@pidash.io",
    password: "casino123",
    name: "Admin",
    role: "admin",
  },
];

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function authenticate(email: string, password: string): SessionUser | null {
  const found = USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!found) return null;
  const { password: _pw, ...user } = found;
  void _pw;
  return user;
}

export function createSessionToken(user: SessionUser): string {
  const body = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const payload = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string | null): SessionUser | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  // Comparaison à temps constant pour éviter les timing attacks.
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const body = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof body.exp !== "number" || body.exp < Date.now()) return null;
    return {
      id: body.sub,
      email: body.email,
      name: body.name,
      role: body.role,
    };
  } catch {
    return null;
  }
}

/** Lit et vérifie la session courante (Server Components / Route Handlers). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

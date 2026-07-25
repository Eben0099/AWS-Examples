"use client";

export function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="post">
      <button
        type="submit"
        className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-muted transition hover:border-rose/40 hover:text-rose"
      >
        Déconnexion
      </button>
    </form>
  );
}

"use client";

export function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="post">
      <button
        type="submit"
        className="rounded-[2px] border border-baize-line px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wide text-sage/80 transition hover:border-claret/50 hover:text-claret"
      >
        Fermer
      </button>
    </form>
  );
}

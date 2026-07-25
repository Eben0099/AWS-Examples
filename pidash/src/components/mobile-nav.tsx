"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Verrouille le défilement de fond quand le tiroir est ouvert + Échap ferme.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-baize-line text-parchment"
      >
        <span className="sr-only">Menu</span>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M2 4.5h14M2 9h14M2 13.5h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <nav
            id="menu-mobile"
            aria-label="Navigation principale"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col border-r border-baize-line bg-baize"
          >
            <div className="flex items-center justify-between border-b border-baize-line px-5 py-5">
              <div>
                <p className="eyebrow">Maison de jeu</p>
                <p className="mt-1 font-display text-2xl font-semibold text-parchment">
                  PiDash
                </p>
              </div>
              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-baize-line text-sage"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 px-3 py-4">
              {NAV.map((item) => {
                const active = item.href === pathname;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 font-mono text-[0.85rem] uppercase tracking-wide transition ${
                      active ? "text-parchment" : "text-sage hover:text-parchment"
                    }`}
                  >
                    <span
                      className={`h-4 w-[2px] ${active ? "bg-brass" : "bg-transparent"}`}
                    />
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="border-t border-baize-line px-5 py-4">
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-sage">
                Jeu responsable · +18
              </p>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

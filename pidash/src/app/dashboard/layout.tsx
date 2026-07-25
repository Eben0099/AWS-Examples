import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { MobileNav } from "@/components/mobile-nav";
import { NAV } from "@/lib/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const initials = user.name.slice(0, 2).toUpperCase();
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex min-h-dvh">
      {/* Rail — la « cage » (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-baize-line bg-baize md:flex">
        <div className="border-b border-baize-line px-5 py-5">
          <p className="eyebrow">Maison de jeu</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-parchment">
            PiDash
          </p>
        </div>

        <nav className="flex-1 px-3 py-4" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active = item.href === "/dashboard";
            return (
              <a
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 font-mono text-[0.8rem] uppercase tracking-wide transition ${
                  active ? "text-parchment" : "text-sage hover:text-parchment"
                }`}
              >
                <span
                  className={`h-4 w-[2px] transition ${
                    active
                      ? "bg-brass"
                      : "bg-transparent group-hover:bg-baize-line"
                  }`}
                />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-baize-line px-5 py-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-sage">
            Jeu responsable · +18
          </p>
        </div>
      </aside>

      {/* Contenu */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-baize-line px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <MobileNav />
            <div>
              <p className="eyebrow">Registre du jour</p>
              <h1 className="mt-0.5 font-display text-lg font-semibold capitalize text-parchment sm:text-xl">
                {today}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight text-parchment">
                {user.name}
              </p>
              <p className="font-mono text-[0.7rem] text-sage">{user.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/50 font-mono text-xs font-semibold text-brass">
              {initials}
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

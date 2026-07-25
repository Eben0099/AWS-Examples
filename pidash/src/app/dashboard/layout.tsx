import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

const NAV = [
  { label: "Vue d'ensemble", icon: "▨", href: "/dashboard", active: true },
  { label: "Jeux", icon: "♠", href: "#" },
  { label: "Joueurs", icon: "◍", href: "#" },
  { label: "Transactions", icon: "€", href: "#" },
  { label: "Rapports", icon: "▤", href: "#" },
  { label: "Paramètres", icon: "⚙", href: "#" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-amber-600 font-bold text-black">
            ♠
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">PiDash</p>
            <p className="text-[11px] text-muted">Casino Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                item.active
                  ? "bg-surface-2 font-medium text-foreground"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              <span className="w-4 text-center text-gold">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-border p-3 text-[11px] text-muted">
          Jeu responsable · +18 ans
        </div>
      </aside>

      {/* Contenu */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface/70 px-5 py-3 backdrop-blur">
          <div>
            <h1 className="text-base font-semibold">Vue d&apos;ensemble</h1>
            <p className="text-xs text-muted">
              Activité en temps quasi réel · dernières 24 h
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{user.name}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-gold">
              {initials}
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}

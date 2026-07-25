import {
  BetsByGameChart,
  GameMixChart,
  RevenueChart,
} from "@/components/charts";
import { kpis, topGames } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const up = k.delta >= 0;
          return (
            <div
              key={k.label}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-muted">{k.label}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    up
                      ? "bg-emerald/10 text-emerald"
                      : "bg-rose/10 text-rose"
                  }`}
                >
                  {up ? "▲" : "▼"} {Math.abs(k.delta)}%
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {k.value}
              </p>
              <p className="mt-1 text-xs text-muted">{k.hint}</p>
            </div>
          );
        })}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Revenu brut de jeu (GGR)</h2>
            <span className="text-xs text-muted">7 derniers jours</span>
          </div>
          <div className="h-64">
            <RevenueChart />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Répartition par produit</h2>
          </div>
          <div className="h-64">
            <GameMixChart />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Mises par jeu</h2>
            <span className="text-xs text-muted">Volume (€)</span>
          </div>
          <div className="h-64">
            <BetsByGameChart />
          </div>
        </div>

        {/* Table top jeux */}
        <div className="rounded-2xl border border-border bg-surface p-4 lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold">Top jeux</h2>
          <div className="space-y-3">
            {topGames.map((g) => (
              <div
                key={g.game}
                className="flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{g.game}</p>
                  <p className="text-xs text-muted">{g.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{g.ggr}</p>
                  <span
                    className={`text-[11px] ${
                      g.status === "live" ? "text-emerald" : "text-gold"
                    }`}
                  >
                    {g.status === "live" ? "● Live" : "◐ Maintenance"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed table */}
      <section className="rounded-2xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold">Détail des jeux</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4 font-medium">Jeu</th>
                <th className="py-2 pr-4 font-medium">Catégorie</th>
                <th className="py-2 pr-4 font-medium">Mises</th>
                <th className="py-2 pr-4 font-medium">GGR</th>
                <th className="py-2 pr-4 font-medium">RTP</th>
                <th className="py-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {topGames.map((g) => (
                <tr key={g.game} className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-medium">{g.game}</td>
                  <td className="py-2.5 pr-4 text-muted">{g.category}</td>
                  <td className="py-2.5 pr-4">{g.bets}</td>
                  <td className="py-2.5 pr-4">{g.ggr}</td>
                  <td className="py-2.5 pr-4">{g.rtp}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        g.status === "live"
                          ? "bg-emerald/10 text-emerald"
                          : "bg-gold/10 text-gold"
                      }`}
                    >
                      {g.status === "live" ? "Live" : "Maintenance"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

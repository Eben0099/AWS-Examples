import {
  BetsByGameChart,
  GameMixChart,
  RevenueChart,
} from "@/components/charts";
import { EngineMonitorCard } from "@/components/engine-monitor-card";
import { kpis, revenueSeries, topGames } from "@/lib/data";

function euros(n: number) {
  return "€ " + n.toLocaleString("fr-FR");
}

export default function DashboardPage() {
  const hero = kpis[0]; // Produit brut des jeux
  const strip = kpis.slice(1); // joueurs, mises, reversement

  // Fait dérivé, réel : la meilleure journée de la semaine.
  const bestIdx = revenueSeries.ggr.reduce(
    (best, v, i) => (v > revenueSeries.ggr[best] ? i : best),
    0,
  );
  const DAYS: Record<string, string> = {
    Lun: "Lundi",
    Mar: "Mardi",
    Mer: "Mercredi",
    Jeu: "Jeudi",
    Ven: "Vendredi",
    Sam: "Samedi",
    Dim: "Dimanche",
  };
  const bestLabel = revenueSeries.labels[bestIdx];
  const bestDay = DAYS[bestLabel] ?? bestLabel;
  const bestVal = revenueSeries.ggr[bestIdx];

  return (
    <div className="space-y-6">
      {/* — Signature : l'en-tête du registre — */}
      <section className="pit-panel rise overflow-hidden rounded-[3px]">
        <div className="h-1 w-full bg-gradient-to-r from-brass via-brass-dim to-transparent" />
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Produit brut des jeux · 7 jours</p>
            <p className="mt-2 font-display text-6xl font-semibold leading-none tracking-tight text-parchment tnum sm:text-7xl">
              {hero.value}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-sm text-sage-up tnum">
                ▲ {hero.delta}%
              </span>
              <span className="text-sm text-sage">
                contre la semaine précédente
              </span>
            </div>
          </div>

          {/* Contrepartie de registre : la meilleure journée */}
          <div className="border-t border-dashed border-baize-line pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="eyebrow">Meilleure journée</p>
            <p className="mt-2 font-display text-2xl font-semibold text-parchment">
              {bestDay}
            </p>
            <p className="mt-1 font-mono text-lg text-brass tnum">
              {euros(bestVal)}
            </p>
            <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-widest text-sage/85">
              Clôture provisoire · non arrêtée
            </p>
          </div>
        </div>
      </section>

      {/* — Bandeau comptable : colonnes réglées, pas de cartes — */}
      <section className="pit-panel grid grid-cols-1 divide-y divide-baize-line rounded-[3px] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {strip.map((k) => {
          const up = k.delta >= 0;
          return (
            <div key={k.label} className="px-6 py-5">
              <p className="eyebrow">{k.label}</p>
              <p className="mt-2 font-mono text-2xl font-medium text-parchment tnum">
                {k.value}
              </p>
              <p className="mt-1.5 text-sm">
                <span className={up ? "text-sage-up" : "text-claret"}>
                  {up ? "▲" : "▼"} {Math.abs(k.delta)}%
                </span>
                <span className="ml-2 text-sage/85">{k.hint}</span>
              </p>
            </div>
          );
        })}
      </section>

      {/* — Courbe du PBJ + répartition — */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="pit-panel rounded-[3px] p-5 lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-parchment">
              Produit brut, jour par jour
            </h2>
            <span className="font-mono text-[0.7rem] uppercase tracking-widest text-sage/85">
              7 derniers jours
            </span>
          </div>
          <div className="brass-rule mb-4" />
          <div className="h-64">
            <RevenueChart />
          </div>
        </div>

        <div className="pit-panel rounded-[3px] p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-parchment">
            Répartition par produit
          </h2>
          <div className="brass-rule mb-4" />
          <div className="h-64">
            <GameMixChart />
          </div>
        </div>
      </section>

      {/* — Mises par jeu + top jeux — */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="pit-panel rounded-[3px] p-5 lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-parchment">
              Mises par jeu
            </h2>
            <span className="font-mono text-[0.7rem] uppercase tracking-widest text-sage/85">
              Volume misé
            </span>
          </div>
          <div className="brass-rule mb-4" />
          <div className="h-64">
            <BetsByGameChart />
          </div>
        </div>

        <div className="pit-panel rounded-[3px] p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-parchment">
            Meneurs de la salle
          </h2>
          <div className="brass-rule mb-4" />
          <ul className="space-y-3.5">
            {topGames.map((g, i) => (
              <li key={g.game} className="flex items-center gap-3">
                <span className="font-mono text-xs text-sage/80 tnum">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-parchment">
                    {g.game}
                  </p>
                  <p className="font-mono text-[0.7rem] uppercase tracking-wide text-sage/85">
                    {g.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-brass tnum">{g.ggr}</p>
                  <p
                    className={`font-mono text-[0.65rem] uppercase tracking-wide ${
                      g.status === "live" ? "text-sage-up" : "text-brass"
                    }`}
                  >
                    {g.status === "live" ? "en salle" : "maintenance"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* — Supervision des moteurs de jeu (lecture seule, métadonnées) — */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold text-parchment">
            Supervision des moteurs
          </h2>
          <span className="font-mono text-[0.7rem] uppercase tracking-widest text-sage/85">
            Temps réel · rafraîchi 2 s
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <EngineMonitorCard engine="roulette" />
          <EngineMonitorCard engine="keno" />
          <EngineMonitorCard engine="aviator" />
        </div>
      </section>

      {/* — Le registre détaillé — */}
      <section className="pit-panel rounded-[3px] p-5">
        <h2 className="mb-4 font-display text-lg font-semibold text-parchment">
          Registre des jeux
        </h2>
        {/* Mobile : fiches empilées, lisibles sans défilement horizontal */}
        <ul className="space-y-3 sm:hidden">
          {topGames.map((g) => (
            <li key={g.game} className="border border-baize-line/70 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-parchment">{g.game}</p>
                  <p className="font-mono text-[0.65rem] uppercase tracking-wide text-sage">
                    {g.category}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wide ${
                    g.status === "live" ? "text-sage-up" : "text-brass"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 ${
                      g.status === "live" ? "bg-sage-up" : "bg-brass-dim"
                    }`}
                  />
                  {g.status === "live" ? "En salle" : "Maint."}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-baize-line/60 pt-3 font-mono tnum">
                <div>
                  <dt className="text-[0.6rem] uppercase tracking-wide text-sage">
                    Mises
                  </dt>
                  <dd className="mt-0.5 text-sm text-parchment">{g.bets}</dd>
                </div>
                <div>
                  <dt className="text-[0.6rem] uppercase tracking-wide text-sage">
                    PBJ
                  </dt>
                  <dd className="mt-0.5 text-sm text-brass">{g.ggr}</dd>
                </div>
                <div>
                  <dt className="text-[0.6rem] uppercase tracking-wide text-sage">
                    Reversement
                  </dt>
                  <dd className="mt-0.5 text-sm text-parchment">{g.rtp}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        {/* Desktop : tableau-registre, défilable et focusable au clavier */}
        <div
          className="hidden overflow-x-auto sm:block"
          tabIndex={0}
          role="region"
          aria-label="Registre détaillé des jeux"
        >
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-baize-line text-left font-mono text-[0.68rem] uppercase tracking-widest text-sage">
                <th className="py-2.5 pr-4 font-medium">Jeu</th>
                <th className="py-2.5 pr-4 font-medium">Catégorie</th>
                <th className="py-2.5 pr-4 text-right font-medium">Mises</th>
                <th className="py-2.5 pr-4 text-right font-medium">PBJ</th>
                <th className="py-2.5 pr-4 text-right font-medium">Reversement</th>
                <th className="py-2.5 font-medium">État</th>
              </tr>
            </thead>
            <tbody className="text-parchment">
              {topGames.map((g) => (
                <tr
                  key={g.game}
                  className="border-b border-baize-line/50 last:border-0"
                >
                  <td className="py-3 pr-4 font-medium">{g.game}</td>
                  <td className="py-3 pr-4 text-sage/80">{g.category}</td>
                  <td className="py-3 pr-4 text-right font-mono tnum">{g.bets}</td>
                  <td className="py-3 pr-4 text-right font-mono text-brass tnum">
                    {g.ggr}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-sage/80 tnum">
                    {g.rtp}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wide ${
                        g.status === "live" ? "text-sage-up" : "text-brass"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 ${
                          g.status === "live" ? "bg-sage-up" : "bg-brass-dim"
                        }`}
                      />
                      {g.status === "live" ? "En salle" : "Maintenance"}
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

/**
 * Données de démonstration pour le dashboard casino.
 * À remplacer par des requêtes réelles (API / DB) lors de l'intégration.
 * GGR = Gross Gaming Revenue (mises - gains reversés).
 */

export type Kpi = {
  label: string;
  value: string;
  delta: number; // variation en % vs période précédente
  hint: string;
};

export const kpis: Kpi[] = [
  { label: "GGR (7 jours)", value: "€ 428 190", delta: 12.4, hint: "Revenu brut de jeu" },
  { label: "Joueurs actifs", value: "9 842", delta: 5.1, hint: "Uniques sur 24 h" },
  { label: "Mises du jour", value: "€ 1,28 M", delta: -2.3, hint: "Volume total misé" },
  { label: "Taux de reversement", value: "94,6 %", delta: 0.4, hint: "RTP moyen pondéré" },
];

export const revenueSeries = {
  labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  ggr: [48200, 52100, 46800, 58900, 71200, 89400, 61590],
  bets: [612000, 668000, 590000, 742000, 903000, 1120000, 780000],
};

export const betsByGame = {
  labels: ["Blackjack", "Roulette", "Machines à sous", "Poker", "Baccarat", "Craps"],
  values: [182000, 241000, 398000, 156000, 98000, 61000],
};

export const gameMix = {
  labels: ["Machines à sous", "Table (live)", "Poker", "Paris sportifs"],
  values: [46, 28, 14, 12],
};

export type GameRow = {
  game: string;
  category: string;
  bets: string;
  ggr: string;
  rtp: string;
  status: "live" | "maintenance";
};

export const topGames: GameRow[] = [
  { game: "Golden Nugget Slots", category: "Machines à sous", bets: "€ 214 300", ggr: "€ 21 640", rtp: "96,1 %", status: "live" },
  { game: "European Roulette", category: "Table", bets: "€ 188 900", ggr: "€ 18 020", rtp: "97,3 %", status: "live" },
  { game: "Texas Hold'em Pro", category: "Poker", bets: "€ 141 200", ggr: "€ 9 480", rtp: "—", status: "live" },
  { game: "VIP Blackjack", category: "Table", bets: "€ 132 750", ggr: "€ 14 210", rtp: "99,2 %", status: "maintenance" },
  { game: "Neon Baccarat", category: "Table", bets: "€ 96 100", ggr: "€ 7 330", rtp: "98,9 %", status: "live" },
];

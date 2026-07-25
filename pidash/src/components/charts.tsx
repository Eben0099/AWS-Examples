"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { betsByGame, gameMix, revenueSeries } from "@/lib/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

// Palette « Pit Ledger »
const BRASS = "#c8a04e";
const SAGE = "#7fb79a";
const PARCHMENT = "#ece3cc";
const CLARET = "#cf6b7c";
const FELT = "#123a2e";
const GRID = "rgba(236,227,204,0.07)";
const TICK = "rgba(158,204,178,0.9)";

ChartJS.defaults.color = TICK;
ChartJS.defaults.font.family =
  "var(--font-spline-mono), ui-monospace, monospace";
ChartJS.defaults.font.size = 11;

const tooltip = {
  backgroundColor: "#0b271f",
  borderColor: "rgba(200,160,78,0.4)",
  borderWidth: 1,
  titleColor: PARCHMENT,
  bodyColor: PARCHMENT,
  padding: 10,
  cornerRadius: 2,
};

const numericScales = {
  x: { grid: { display: false }, ticks: { color: TICK } },
  y: {
    grid: { color: GRID },
    border: { display: false },
    ticks: {
      color: TICK,
      callback: (v: string | number) =>
        typeof v === "number" ? `${Math.round(v / 1000)}k` : v,
    },
  },
};

export function RevenueChart() {
  const data = {
    labels: revenueSeries.labels,
    datasets: [
      {
        label: "PBJ (€)",
        data: revenueSeries.ggr,
        borderColor: BRASS,
        backgroundColor: (ctx: { chart: ChartJS }) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return "rgba(200,160,78,0.12)";
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, "rgba(200,160,78,0.28)");
          g.addColorStop(1, "rgba(200,160,78,0)");
          return g;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: BRASS,
        pointHoverBorderColor: FELT,
      },
    ],
  };
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: { legend: { display: false }, tooltip },
    scales: numericScales,
  };
  return (
    <Line
      data={data}
      options={options}
      role="img"
      aria-label="Courbe du produit brut des jeux par jour sur les 7 derniers jours, culminant samedi."
    />
  );
}

export function BetsByGameChart() {
  const data = {
    labels: betsByGame.labels,
    datasets: [
      {
        label: "Mises (€)",
        data: betsByGame.values,
        backgroundColor: "rgba(127,183,154,0.55)",
        hoverBackgroundColor: SAGE,
        borderRadius: 2,
        maxBarThickness: 40,
      },
    ],
  };
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip },
    scales: numericScales,
  };
  return (
    <Bar
      data={data}
      options={options}
      role="img"
      aria-label="Histogramme du volume misé par jeu ; les machines à sous dominent, suivies de la roulette."
    />
  );
}

export function GameMixChart() {
  const data = {
    labels: gameMix.labels,
    datasets: [
      {
        data: gameMix.values,
        backgroundColor: [BRASS, SAGE, PARCHMENT, CLARET],
        borderColor: FELT,
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "64%",
    plugins: {
      tooltip,
      legend: {
        position: "bottom",
        labels: {
          color: TICK,
          boxWidth: 10,
          boxHeight: 10,
          padding: 14,
          usePointStyle: true,
          font: { size: 11 },
        },
      },
    },
  };
  return (
    <Doughnut
      data={data}
      options={options}
      role="img"
      aria-label="Répartition du produit par famille de jeux : machines à sous, tables en direct, poker et paris sportifs."
    />
  );
}

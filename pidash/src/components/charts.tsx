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

const GOLD = "#f5c451";
const EMERALD = "#34d399";
const GRID = "rgba(255,255,255,0.06)";
const TICK = "#8b93a7";

ChartJS.defaults.color = TICK;
ChartJS.defaults.font.family =
  "var(--font-geist-sans), Arial, Helvetica, sans-serif";

const axisScales = {
  x: { grid: { color: GRID }, ticks: { color: TICK } },
  y: {
    grid: { color: GRID },
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
        label: "GGR (€)",
        data: revenueSeries.ggr,
        borderColor: GOLD,
        backgroundColor: (ctx: { chart: ChartJS }) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return "rgba(245,196,81,0.15)";
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, "rgba(245,196,81,0.35)");
          g.addColorStop(1, "rgba(245,196,81,0)");
          return g;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: GOLD,
      },
    ],
  };
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: axisScales,
  };
  return <Line data={data} options={options} />;
}

export function BetsByGameChart() {
  const data = {
    labels: betsByGame.labels,
    datasets: [
      {
        label: "Mises (€)",
        data: betsByGame.values,
        backgroundColor: "rgba(52,211,153,0.65)",
        hoverBackgroundColor: EMERALD,
        borderRadius: 6,
        maxBarThickness: 42,
      },
    ],
  };
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: axisScales,
  };
  return <Bar data={data} options={options} />;
}

export function GameMixChart() {
  const data = {
    labels: gameMix.labels,
    datasets: [
      {
        data: gameMix.values,
        backgroundColor: ["#f5c451", "#34d399", "#60a5fa", "#fb7185"],
        borderColor: "#10141f",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: TICK, boxWidth: 12, padding: 14, usePointStyle: true },
      },
    },
  };
  return <Doughnut data={data} options={options} />;
}

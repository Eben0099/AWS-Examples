import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

// Display : serif à caractère (opsz), pour le wordmark et les chiffres clés.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

// UI : grotesque sobre et lisible.
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

// Données : mono tabulaire pour les colonnes du registre.
const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PiDash — Salle de jeu",
  description: "Console d'exploitation pour maison de jeu : registre du produit brut, mises et activité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${instrument.variable} ${splineMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

"use client";

import {
  useGetRouletteDebugQuery,
  useGetKenoDebugQuery,
  useGetAviatorDebugQuery,
} from "@/lib/engine-debug/api";
import type {
  AviatorDebug,
  EngineCode,
  KenoDebug,
  RouletteDebug,
} from "@/lib/engine-debug/types";

const ENGINE_LABELS: Record<EngineCode, string> = {
  roulette: "Roulette",
  keno: "Keno",
  aviator: "Aviator",
};

// Phases où l'issue est déjà publique (post-révélation).
const REVEALED_PHASES = new Set(["Result", "results", "Crashed"]);

type NormalizedRound = {
  id: string;
  phase: string;
  mode: string; // source (roulette/keno) ou draw_mode (aviator)
  reason?: string | null;
  seedHash: string;
  generatedAt?: number;
  extras: { label: string; value: string; full?: boolean }[];
};

function normalize(
  engine: EngineCode,
  data: RouletteDebug | KenoDebug | AviatorDebug,
): NormalizedRound {
  if (engine === "aviator") {
    const d = data as AviatorDebug;
    const extras: { label: string; value: string; full?: boolean }[] = [];
    if ("crash_point" in d && typeof d.crash_point === "number") {
      extras.push({ label: "Issue", value: String(d.crash_point), full: true });
    }
    extras.push({ label: "Mises totales", value: formatNumber(d.total_staked) });
    extras.push({ label: "Cash-outs", value: String(Object.keys(d.cashouts ?? {}).length) });
    if ("flight_duration" in d && typeof d.flight_duration === "number") {
      extras.push({ label: "Durée vol", value: String(d.flight_duration) });
    }
    if ("crash_point_recommended" in d && d.crash_point_recommended != null) {
      extras.push({ label: "Reco — Crash", value: String(d.crash_point_recommended) });
    }
    if ("crash_point_normal" in d && d.crash_point_normal != null) {
      extras.push({ label: "Fair crash", value: String(d.crash_point_normal) });
    }
    if ("cumulative_paid" in d && typeof d.cumulative_paid === "number") {
      extras.push({ label: "Cumul payé", value: formatNumber(d.cumulative_paid) });
    }

    return {
      id: d.round_id,
      phase: d.phase,
      mode: d.draw_mode,
      seedHash: d.server_seed_hash,
      extras,
    };
  }
  const d = data as RouletteDebug | KenoDebug;
  const extras: { label: string; value: string; full?: boolean }[] = [];
  // Roulette pre-reveal outcome
  if ("winning_number" in d && typeof d.winning_number === "number") {
    extras.push({ label: "Issue", value: String(d.winning_number), full: true });
  }
  // Keno pre-reveal numbers (array)
  if ("numbers" in d && Array.isArray((d as KenoDebug).numbers)) {
    const nums = (d as KenoDebug).numbers!.join(", ");
    extras.push({ label: "Numéros", value: nums, full: true });
  }
  if (d.recommendation) {
    extras.push({ label: "Reco — Total misé", value: formatNumber(d.recommendation.totalStaked) });
    extras.push({ label: "Reco — Payout", value: formatNumber(d.recommendation.payout) });
    extras.push({ label: "Reco — RTP", value: String(d.recommendation.rtp) });
    extras.push({ label: "Reco — Distribution %", value: `${d.recommendation.distributionPct}%` });
    extras.push({ label: "Reco — Floor met", value: String(d.recommendation.floorMet) });
    extras.push({ label: "Reco — Winners", value: String(d.recommendation.winners) });
    extras.push({ label: "Reco — Tickets", value: String(d.recommendation.ticketCount) });
  }

  return {
    id: "round_id" in d ? d.round_id : `#${d.draw_id}`,
    phase: d.phase,
    mode: d.source,
    reason: d.reason,
    seedHash: d.server_seed_hash,
    generatedAt: d.generated_at,
    extras,
  };
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

function truncateHash(hash: string): string {
  if (!hash || hash.length <= 16) return hash || "—";
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`;
}

function describeError(error: unknown): string {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status: number | string }).status;
    if (status === 401) return "Non autorisé — session expirée.";
    if (status === 404) return "Aucun round actif.";
    if (typeof status === "number") return `Erreur moteur (HTTP ${status}).`;
    return "Moteur injoignable.";
  }
  return "Erreur inattendue.";
}

export function EngineMonitorCard({
  engine,
  pollingInterval = 2000,
}: {
  engine: EngineCode;
  pollingInterval?: number;
}) {
  // Les 3 hooks sont appelés inconditionnellement (règles des hooks) ; ceux qui
  // ne correspondent pas à `engine` sont `skip` et n'émettent aucune requête.
  const roulette = useGetRouletteDebugQuery(undefined, {
    skip: engine !== "roulette",
    pollingInterval,
  });
  const keno = useGetKenoDebugQuery(undefined, {
    skip: engine !== "keno",
    pollingInterval,
  });
  const aviator = useGetAviatorDebugQuery(undefined, {
    skip: engine !== "aviator",
    pollingInterval,
  });

  const q =
    engine === "roulette" ? roulette : engine === "keno" ? keno : aviator;
  const { data, error, isLoading, isFetching } = q;

  const round = data ? normalize(engine, data) : null;
  const revealed = round ? REVEALED_PHASES.has(round.phase) : false;

  return (
    <section
      className="pit-panel rounded-[3px] p-5"
      aria-label={`Supervision ${ENGINE_LABELS[engine]}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-parchment">
          {ENGINE_LABELS[engine]}
        </h3>
        <span
          className={`h-1.5 w-1.5 rounded-full bg-sage-up transition-opacity ${
            isFetching ? "opacity-100" : "opacity-25"
          }`}
          title={isFetching ? "Rafraîchissement…" : "En veille"}
          aria-hidden
        />
      </div>
      <div className="brass-rule mb-4" />

      {isLoading && <p className="text-sm text-sage/85">Chargement…</p>}

      {!isLoading && error && (
        <p
          role="alert"
          className="border-l-2 border-claret pl-3 text-sm text-claret"
        >
          {describeError(error)}
        </p>
      )}

      {!isLoading && !error && round && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Field label="Round" value={round.id} mono />
          <Field label="Phase" value={round.phase} tone={revealed ? "revealed" : "live"} />
          <Field
            label="Mode"
            value={round.mode}
            tone={round.mode === "fair" ? "live" : "controlled"}
          />
          {round.reason != null && <Field label="Raison" value={round.reason} />}
          {round.generatedAt != null && (
            <Field
              label="Généré"
              value={new Date(round.generatedAt).toLocaleTimeString("fr-FR")}
              mono
            />
          )}
          {round.extras.map((e) => (
            <Field key={e.label} label={e.label} value={e.value} mono full={e.full} />
          ))}
          <Field label="Seed hash" value={truncateHash(round.seedHash)} mono full />
        </dl>
      )}

      {!isLoading && !error && !round && (
        <p className="text-sm text-sage/85">Aucune donnée.</p>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  mono,
  full,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  full?: boolean;
  tone?: "live" | "revealed" | "controlled";
}) {
  return (
    <div className={`min-w-0 ${full ? "col-span-2" : ""}`}>
      <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-sage">
        {label}
      </dt>
      <dd className="mt-0.5">
        {tone ? (
          <span
            className={`inline-block rounded-[2px] px-2 py-0.5 font-mono text-xs uppercase tracking-wide ${TONE[tone]}`}
          >
            {value}
          </span>
        ) : (
          <span
            className={`text-sm text-parchment ${mono ? "font-mono tnum" : ""}`}
          >
            {value}
          </span>
        )}
      </dd>
    </div>
  );
}

const TONE: Record<string, string> = {
  live: "bg-sage-up/15 text-sage-up",
  revealed: "bg-baize-line/40 text-sage",
  controlled: "bg-brass/15 text-brass",
};

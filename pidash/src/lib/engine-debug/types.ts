// Safe, outcome-free response shapes for the engine debug endpoints.
//
// The pre-reveal outcome fields — roulette `winning_number`, keno `numbers`,
// aviator `crash_point` / `crash_point_normal` / `crash_point_recommended` /
// `flight_duration` / `cumulative_paid` — and the `recommendation` steering
// block are INTENTIONALLY ABSENT. The engine no longer emits them on these
// routes, so there is no in-flight outcome to model or surface. These types
// describe observability metadata only.

export type DrawSource = "fair" | "controlled";

/** Aviator reports a third mode; the outcome value itself is not exposed. */
export type AviatorDrawMode = "fair" | "controlled" | "boosted";

export type DrawReason = null | "fair_mode" | "empty" | "thin" | "unavailable";

export type RoulettePhase = "Betting" | "BetsClosing" | "Spinning" | "Result";
export type KenoPhase = "idle" | "preLaunch" | "draw" | "results";
export type AviatorPhase =
  | "Betting"
  | "Flying"
  | "Crashed"
  | "Idle"
  | "Maintenance";

export interface RouletteDebug {
  round_id: string;
  server_seed_hash: string;
  generated_at: number;
  /** If present, the engine provided the pre-reveal winning number. */
  winning_number?: number;
  source: DrawSource;
  reason: DrawReason;
  phase: RoulettePhase;
  /** Optional steering recommendation when the round is "controlled". */
  recommendation?: {
    totalStaked: number;
    payout: number;
    rtp: number;
    distributionPct: number;
    floorMet: boolean;
    winners: number;
    ticketCount: number;
    color?: string | null;
    parity?: string | null;
  } | null;
}

export interface KenoDebug {
  draw_id: number;
  server_seed_hash: string;
  generated_at: number;
  /** If present, the engine provided the pre-reveal numbers for Keno. */
  numbers?: number[];
  source: DrawSource;
  reason: DrawReason;
  phase: KenoPhase;
  /** Optional steering recommendation when the draw is "controlled". */
  recommendation?: {
    totalStaked: number;
    payout: number;
    rtp: number;
    distributionPct: number;
    floorMet: boolean;
    winners: number;
    ticketCount: number;
  } | null;
}

export interface AviatorDebug {
  round_id: string;
  phase: AviatorPhase;
  server_seed_hash: string;
  draw_mode: AviatorDrawMode;
  total_staked: number;
  /** Frozen cash-outs already made this round (observational, not predictive). */
  cashouts: Record<string, number>;
  /** Observational outcome fields (may be present for debug). */
  crash_point?: number;
  flight_duration?: number;
  crash_point_normal?: number | null;
  crash_point_recommended?: number | null;
  cumulative_paid?: number;
}

export type EngineCode = "roulette" | "keno" | "aviator";
export type AnyEngineDebug = RouletteDebug | KenoDebug | AviatorDebug;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RouletteDebug, KenoDebug, AviatorDebug } from "./types";

// NOTE: Client-side stripping removed — proxy now returns raw engine debug data.

// ---------------------------------------------------------------------------
// API slice — talks to pidash's OWN proxy (same origin), never the engine.
// ---------------------------------------------------------------------------
// The browser is authenticated by the httpOnly `pidash_session` cookie, sent
// automatically on same-origin requests. The proxy (src/app/api/admin/engines/
// [engine]/debug/route.ts) verifies that session, then attaches the engine
// `X-Api-Key` server-side. The admin key never reaches the browser.
export const engineDebugApi = createApi({
  reducerPath: "engineDebugApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  // Debug snapshots are point-in-time; never serve a stale cached value.
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getRouletteDebug: builder.query<RouletteDebug, void>({
      query: () => "admin/engines/roulette/debug",
      transformResponse: (r: RouletteDebug) => r,
    }),
    getKenoDebug: builder.query<KenoDebug, void>({
      query: () => "admin/engines/keno/debug",
      transformResponse: (r: KenoDebug) => r,
    }),
    getAviatorDebug: builder.query<AviatorDebug, void>({
      query: () => "admin/engines/aviator/debug",
      transformResponse: (r: AviatorDebug) => r,
    }),
  }),
});

export const {
  useGetRouletteDebugQuery,
  useGetKenoDebugQuery,
  useGetAviatorDebugQuery,
} = engineDebugApi;

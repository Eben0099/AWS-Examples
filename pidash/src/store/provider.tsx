"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./index";

/**
 * Fournit le store Redux (RTK Query) à l'arbre client.
 * Le store est créé une seule fois par montage, via une ref, pour éviter
 * de le recréer à chaque rendu (recommandation officielle Next + RTK).
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}

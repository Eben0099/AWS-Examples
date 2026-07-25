import { configureStore } from "@reduxjs/toolkit";
import { engineDebugApi } from "@/lib/engine-debug/api";

export function makeStore() {
  return configureStore({
    reducer: {
      [engineDebugApi.reducerPath]: engineDebugApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(engineDebugApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

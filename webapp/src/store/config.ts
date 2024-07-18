import { StoreKey } from "@/constant";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_CONFIG = {
};

export type AppConfig = typeof DEFAULT_CONFIG;

export type AppConfigStore = AppConfig & {
  reset: () => void;
  update: (updater: (config: AppConfig) => void) => void;
};

export const useConfigStore = create<AppConfigStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_CONFIG,

      reset() {
        set(() => ({ ...DEFAULT_CONFIG }));
      },

      update(updater) {
        const config = { ...get() };
        updater(config);
        set(() => config);
      },
    }),
    {
      name: StoreKey.Config,
      version: 1,
      migrate(persistedState, version) {
        const state = persistedState as AppConfig;

        if (version < 1) {
          // merge your old config
        }

        return state as any;
      },
    },
  ),
);

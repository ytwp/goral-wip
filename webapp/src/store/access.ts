import { StoreKey } from "@/constant";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface AccessControlStore {
  token: string;
  userId: string;
  userName: string;
  nickName: string;
  email: string;
  avatar: string;
  roles: string[];

  updateToken: (_: string) => void;
  isAuthorized: () => boolean;
  getUserInfo: (_?: boolean) => void;
  hasRole: (role: Role) => boolean;
}

let fetchState: number = 0; // 0 not fetch, 1 fetching, 2 done

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      token: "",
      userId: "",
      userName: "",
      nickName: "",
      email: "",
      avatar: "",
      roles: [],

      updateToken(token: string) {
        set(() => ({ token: token?.trim() }));
        if (get().token) {
          get().getUserInfo(true);
        }
      },
      isAuthorized() {
        get().getUserInfo();
        return (
          !!get().token
        );
      },
      getUserInfo(force: boolean = false) {
        if ((!get().token) || (!force && fetchState > 0)) return;
        // fetchState = 1;
        // getInfoApi().then((data) => {
        //   set(() => ({ ...data }));
        // }).catch(() => {
        //   // console.error("[Config] failed to fetch config");
        // }).finally(() => {
        //   fetchState = 2;
        // });
      },
      hasRole(role: Role) {
        return get().roles.includes(role);
      },
    }),
    {
      name: StoreKey.Access,
      version: 1,
      migrate(persistedState, version) {
        const state = persistedState as AccessControlStore;

        if (version < 1) {
          // merge your old config
        }

        return state as any;
      },
    },
  ),
);

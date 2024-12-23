import { createStore } from "zustand/vanilla";

export type AppState = {
  userId: string;
};

export type AppActions = {
  setUserId: (userId: string) => void;
};

export type AppStore = AppState & AppActions;

export const defaultInitState: AppState = {
  userId: "",
};

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    setUserId: (userId: string) => set({ userId }),
  }));
};

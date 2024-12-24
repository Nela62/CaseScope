import { createStore } from "zustand/vanilla";

export type AppState = {
  selectedCaseId: string | null;
};

export type AppActions = {
  setSelectedCaseId: (caseId: string) => void;
};

export type AppStore = AppState & AppActions;

export const defaultInitState: AppState = {
  selectedCaseId: null,
};

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    setSelectedCaseId: (caseId: string) => set({ selectedCaseId: caseId }),
  }));
};

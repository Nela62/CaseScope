import { createStore } from "zustand/vanilla";

export type AppState = {
  selectedCaseId: string | null;
  fileProcessingEvents: {
    name: string;
    id: string;
  }[];
};

export type AppActions = {
  setSelectedCaseId: (caseId: string) => void;
  setFileProcessingEvents: (
    events: {
      name: string;
      id: string;
    }[]
  ) => void;
  appendFileProcessingEvents: (
    events: {
      name: string;
      id: string;
    }[]
  ) => void;
  removeFileProcessingEvents: (events: string[]) => void;
};

export type AppStore = AppState & AppActions;

export const defaultInitState: AppState = {
  selectedCaseId: null,
  fileProcessingEvents: [],
};

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    setSelectedCaseId: (caseId: string) => set({ selectedCaseId: caseId }),
    setFileProcessingEvents: (
      events: {
        name: string;
        id: string;
      }[]
    ) => set({ fileProcessingEvents: events }),
    appendFileProcessingEvents: (
      events: {
        name: string;
        id: string;
      }[]
    ) =>
      set((state) => ({
        fileProcessingEvents: [...state.fileProcessingEvents, ...events],
      })),
    removeFileProcessingEvents: (events: string[]) =>
      set((state) => ({
        fileProcessingEvents: state.fileProcessingEvents.filter(
          (event) => !events.includes(event.id)
        ),
      })),
  }));
};

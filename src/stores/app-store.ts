import { createStore } from "zustand/vanilla";

export type AppState = {
  selectedCaseId: string | null;
  fileProcessingEvents: {
    name: string;
    id: string;
    status: string;
  }[];
};

export type AppActions = {
  setSelectedCaseId: (caseId: string | null) => void;
  setFileProcessingEvents: (
    events: {
      name: string;
      id: string;
      status: string;
    }[]
  ) => void;
  appendFileProcessingEvents: (
    events: {
      name: string;
      id: string;
      status: string;
    }[]
  ) => void;
  completeFileProcessingEvents: (events: string[]) => void;
};

export type AppStore = AppState & AppActions;

export const defaultInitState: AppState = {
  selectedCaseId: null,
  fileProcessingEvents: [],
};

export const createAppStore = (initState: AppState = defaultInitState) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    setSelectedCaseId: (caseId: string | null) =>
      set({ selectedCaseId: caseId }),
    setFileProcessingEvents: (
      events: {
        name: string;
        id: string;
        status: string;
      }[]
    ) => set({ fileProcessingEvents: events }),
    appendFileProcessingEvents: (
      events: {
        name: string;
        id: string;
        status: string;
      }[]
    ) =>
      set((state) => ({
        fileProcessingEvents: [...state.fileProcessingEvents, ...events],
      })),
    completeFileProcessingEvents: (events: string[]) =>
      set((state) => ({
        fileProcessingEvents: state.fileProcessingEvents.map((event) =>
          events.includes(event.id) ? { ...event, status: "completed" } : event
        ),
      })),
  }));
};

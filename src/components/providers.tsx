"use client";

import { AppStoreProvider } from "@/providers/app-store-provider";
import { PdfWorkerProvider } from "@/providers/pdf-worker-provider";
import { QueryClientProvider } from "@/providers/query-client-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      <AppStoreProvider>
        <PdfWorkerProvider>{children}</PdfWorkerProvider>
      </AppStoreProvider>
    </QueryClientProvider>
  );
};

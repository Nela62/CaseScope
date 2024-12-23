"use client";

import { AppStoreProvider } from "@/providers/app-store-provider";
import { QueryClientProvider } from "@/providers/query-client-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      <AppStoreProvider>{children}</AppStoreProvider>
    </QueryClientProvider>
  );
};

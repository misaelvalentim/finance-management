"use client";

import { SWRConfig } from "swr";
import { DataProvider } from "@/contexts/DataContext";
import localStorageProvider from "@/utils/cache";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ provider: localStorageProvider, revalidateOnFocus: false }}>
      <DataProvider>{children}</DataProvider>
    </SWRConfig>
  );
}

'use client';
import { ThemeProvider } from "@/components/themeProvider";
import { WalletProvider } from "@/context/walletProvider";
import { Toaster } from "sonner";

import { State } from "wagmi";

export function ClientProviders({ 
  children,
  initialState
}: { 
  children: React.ReactNode;
  initialState?: State;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="fate-protocol-theme"
    >
      <WalletProvider initialState={initialState}>
        {children}
        <Toaster position="top-right" richColors />
      </WalletProvider>
    </ThemeProvider>
  );
}
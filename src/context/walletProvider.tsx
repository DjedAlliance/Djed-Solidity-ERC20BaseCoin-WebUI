'use client';

import { useChainId, useAccount } from 'wagmi';
import UnsupportedNetwork from '@/components/UnsupportedNetwork';
import { DJED_SUPPORTED_CHAINS } from '@/utils/supportedChains';

import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import '@rainbow-me/rainbowkit/styles.css';
import {
    RainbowKitProvider,
    lightTheme,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, State } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/utils/wagmiConfig';

// Create QueryClient outside component to prevent recreation on re-renders
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 3, // Retry failed requests
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Add connection persistence
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1, // Retry failed mutations
        },
    },
});

export function WalletProvider({ 
    children,
    initialState
}: { 
    children: React.ReactNode;
    initialState?: State;
}) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Add connection persistence
        const handleBeforeUnload = () => {
            // Store connection state before page unload
            if (typeof window !== 'undefined') {
                localStorage.setItem('wallet-connection-persist', 'true');
            }
        };
        
        const handleVisibilityChange = () => {
            // Handle page visibility changes
            if (document.visibilityState === 'visible') {
                // Page became visible again
                localStorage.removeItem('wallet-connection-persist');
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Memoize the theme to prevent unnecessary re-renders
    const theme = useMemo(() => {
        if (!mounted) {
            // Use light theme as fallback during SSR/initial render
            return lightTheme({
                accentColor: 'black',
                accentColorForeground: 'white',
                borderRadius: 'medium',
                overlayBlur: 'small',
                fontStack: 'system',
            });
        }
        
        return resolvedTheme === 'dark' 
            ? darkTheme({
                accentColor: 'white',
                accentColorForeground: 'black',
                borderRadius: 'medium',
                overlayBlur: 'small',
                fontStack: 'system',
            })
            : lightTheme({
                accentColor: 'black',
                accentColorForeground: 'white',
                borderRadius: 'medium',
                overlayBlur: 'small',
                fontStack: 'system',
            });
    }, [mounted, resolvedTheme]);

    // Prevent wallet disconnection by ensuring stable provider setup
    const stableConfig = useMemo(() => config, []);

    // Always render the providers to ensure hooks work, but show loading state
    return (
    <WagmiProvider config={stableConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={theme}>
                <SupportedChainGuard>
                    {children}
                </SupportedChainGuard>
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
);
}
function SupportedChainGuard({ children }: { children: React.ReactNode }) {
    const chainId = useChainId();
    const { isConnected } = useAccount();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration swaps from interrupting RainbowKit/Wagmi boot process
    if (!isMounted) {
        return <>{children}</>;
    }

    if (isConnected && !DJED_SUPPORTED_CHAINS.includes(chainId)) {
        return <UnsupportedNetwork />;
    }

    return <>{children}</>;
}
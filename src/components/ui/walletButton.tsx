/* eslint-disable */
// @ts-nocheck
'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';

export default function WalletButton() {
    return (
        <div className="flex justify-end items-center">
            <div className="relative group">
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                    }) => {
                        // Note: If your app doesn't use authentication, you
                        // can remove all 'authenticationStatus' checks
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus ||
                                authenticationStatus === 'authenticated');

                        return (
                            <div
                                {...(!ready && {
                                    'aria-hidden': true,
                                    'style': {
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                    },
                                })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return (
                                            <button
                                                onClick={openConnectModal}
                                                type="button"
                                                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-out bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl hover:from-orange-500 hover:to-orange-400 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                            >
                                                <Wallet className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                                <span className="relative z-10">Connect Wallet</span>
                                                
                                                {/* Animated background gradient */}
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
                                                
                                                {/* Hover glow effect */}
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
                                            </button>
                                        );
                                    }

                                    if (chain.unsupported) {
                                        return (
                                            <button
                                                onClick={openChainModal}
                                                type="button"
                                                className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 transition-all duration-300 ease-out bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 hover:border-red-500/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                            >
                                                <AlertCircle className="w-4 h-4" />
                                                <span>Wrong network</span>
                                            </button>
                                        );
                                    }

                                    return (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={openChainModal}
                                                type="button"
                                                className="group relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-black dark:text-gray-300 transition-all duration-300 ease-out bg-transparent dark:bg-gray-800/50 border border-black dark:border-gray-700/50 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-700/50 hover:border-orange-400 dark:hover:border-gray-600/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                                            >
                                                {chain.hasIcon && (
                                                    <div
                                                        style={{
                                                            background: chain.iconBackground,
                                                            width: 16,
                                                            height: 16,
                                                            borderRadius: 999,
                                                            overflow: 'hidden',
                                                            marginRight: 4,
                                                        }}
                                                    >
                                                        {chain.iconUrl && (
                                                            <img
                                                                alt={chain.name ?? 'Chain icon'}
                                                                src={chain.iconUrl}
                                                                style={{ width: 16, height: 16 }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                <span className="hidden sm:block">{chain.name}</span>
                                                <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                                            </button>

                                            <button
                                                onClick={openAccountModal}
                                                type="button"
                                                className="group relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-out bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl hover:from-orange-500 hover:to-orange-400 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                            >
                                                <CheckCircle className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                                <span className="hidden sm:block">
                                                    {account.displayName}
                                                </span>
                                                <span className="sm:hidden">
                                                    {account.displayBalance
                                                        ? ` ${account.displayBalance}`
                                                        : account.address.slice(0, 6) + '...' + account.address.slice(-4)}
                                                </span>
                                                
                                                {/* Animated background gradient */}
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
                                                
                                                {/* Hover glow effect */}
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </div>
        </div>
    );
}

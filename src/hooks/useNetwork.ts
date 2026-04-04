/**
 * Custom React hook for network management and chain detection.
 * Provides utilities for checking network support and handling chain switches.
 * @module hooks/useNetwork
 */

import { useEffect, useState, useCallback } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import {
  isSupportedChain,
  getNetworkInfo,
  getNetworkName,
  getUnsupportedNetworkMessage,
  needsChainSwitch,
  getSupportedChainIds,
  type SupportedChainId,
} from '@/utils/networkHelpers';

/**
 * Network status object
 * @typedef {Object} NetworkStatus
 * @property {number | undefined} chainId - Current chain ID
 * @property {boolean} isSupported - Whether current chain is supported
 * @property {string} networkName - Human-readable network name
 * @property {string | null} error - Error message if unsupported
 * @property {boolean} isLoading - Whether chain switch is in progress
 * @property {boolean} needsSwitch - Whether network switch is needed
 */
export interface NetworkStatus {
  chainId: number | undefined;
  isSupported: boolean;
  networkName: string;
  error: string | null;
  isLoading: boolean;
  needsSwitch: (targetChainId: number) => boolean;
}

/**
 * Custom hook for managing blockchain network connections.
 * Provides network detection, validation, and switching capabilities.
 * 
 * @returns {Object} Network status and control functions
 * @returns {NetworkStatus} networkStatus - Current network information
 * @returns {Function} switchToChain - Function to switch to a specific chain
 * @returns {Function} switchToChainId - Function to switch by chain ID
 * @returns {Array} supportedChains - List of supported chain IDs
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { networkStatus, switchToChain, supportedChains } = useNetwork();
 * 
 *   if (!networkStatus.isSupported) {
 *     return (
 *       <Alert>
 *         {networkStatus.error}
 *         <button onClick={() => switchToChain(11155111)}>
 *           Switch to Sepolia
 *         </button>
 *       </Alert>
 *     );
 *   }
 * 
 *   return <div>Connected to {networkStatus.networkName}</div>;
 * }
 * ```
 */
export const useNetwork = () => {
  const { chainId, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);

  // Update error state when chain changes
  useEffect(() => {
    if (!isConnected) {
      setError(null);
      return;
    }

    if (!isSupportedChain(chainId)) {
      setError(getUnsupportedNetworkMessage(chainId || 0));
    } else {
      setError(null);
    }
  }, [chainId, isConnected]);

  /**
   * Switches to a specific chain by ID
   * @param {number} targetChainId - The chain ID to switch to
   * @returns {Promise<void>}
   */
  const switchToChainId = useCallback(
    async (targetChainId: number): Promise<void> => {
      if (!isSupportedChain(targetChainId)) {
        setError(`Chain ${targetChainId} is not supported`);
        return;
      }

      try {
        switchChain({ chainId: targetChainId as SupportedChainId });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to switch chain';
        setError(message);
      }
    },
    [switchChain]
  );

  /**
   * Switches to a specific chain by name or ID
   * @param {number | string} chain - Chain ID or name
   * @returns {Promise<void>}
   */
  const switchToChain = useCallback(
    async (chain: number | string): Promise<void> => {
      const chainId = typeof chain === 'string' ? parseInt(chain) : chain;
      await switchToChainId(chainId);
    },
    [switchToChainId]
  );

  const networkStatus: NetworkStatus = {
    chainId,
    isSupported: isSupportedChain(chainId),
    networkName: getNetworkName(chainId || 0),
    error,
    isLoading: isPending,
    needsSwitch: (targetChainId: number) => needsChainSwitch(chainId, targetChainId),
  };

  return {
    networkStatus,
    switchToChain,
    switchToChainId,
    supportedChains: getSupportedChainIds(),
  };
};

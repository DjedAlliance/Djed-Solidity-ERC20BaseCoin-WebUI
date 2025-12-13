/**
 * Network configuration and detection utilities for multi-chain support.
 * Handles chain switching, network validation, and RPC endpoint management.
 * @module utils/networkHelpers
 */

import { mainnet, polygon, sepolia, base, bsc } from 'wagmi/chains';

/**
 * Supported blockchain networks with their configurations.
 * @type {Object}
 */
export const SUPPORTED_NETWORKS = {
  1: {
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    rpcUrl: 'https://eth.rpc.blxrbdn.com',
    blockExplorer: 'https://etherscan.io',
    icon: '🔵',
    isTestnet: false,
  },
  11155111: {
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorer: 'https://sepolia.etherscan.io',
    icon: '🧪',
    isTestnet: true,
  },
  137: {
    name: 'Polygon (Matic)',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    icon: '🟣',
    isTestnet: false,
  },
  56: {
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    icon: '🟡',
    isTestnet: false,
  },
  8453: {
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    icon: '🔵',
    isTestnet: false,
  },
  61: {
    name: 'Ethereum Classic',
    symbol: 'ETC',
    rpcUrl: 'https://etc.rivet.link',
    blockExplorer: 'https://blockscout.com/etc/mainnet',
    icon: '♻️',
    isTestnet: false,
  },
  2001: {
    name: 'Milkomeda',
    symbol: 'MALK',
    rpcUrl: 'https://mainnet-jsonrpc.milkomeda.com',
    blockExplorer: 'https://mainnet-explorer.milkomeda.com',
    icon: '🟢',
    isTestnet: false,
  },
} as const;

/**
 * Type definition for supported chain IDs.
 */
export type SupportedChainId = keyof typeof SUPPORTED_NETWORKS;

/**
 * Checks if a chain ID is supported.
 * @param {number | undefined} chainId - The chain ID to check
 * @returns {boolean} True if chain is supported, false otherwise
 */
export const isSupportedChain = (chainId: number | undefined): chainId is SupportedChainId => {
  if (!chainId) return false;
  return chainId in SUPPORTED_NETWORKS;
};

/**
 * Gets network information for a given chain ID.
 * @param {number} chainId - The chain ID
 * @returns {Object | null} Network information or null if unsupported
 */
export const getNetworkInfo = (chainId: number) => {
  if (!isSupportedChain(chainId)) return null;
  return SUPPORTED_NETWORKS[chainId];
};

/**
 * Gets the network name from chain ID.
 * @param {number} chainId - The chain ID
 * @returns {string} Network name or "Unknown Network"
 */
export const getNetworkName = (chainId: number): string => {
  return getNetworkInfo(chainId)?.name || 'Unknown Network';
};

/**
 * Gets the block explorer URL for a transaction.
 * @param {number} chainId - The chain ID
 * @param {string} txHash - The transaction hash
 * @returns {string | null} Block explorer URL or null if unsupported
 */
export const getBlockExplorerUrl = (chainId: number, txHash: string): string | null => {
  const networkInfo = getNetworkInfo(chainId);
  if (!networkInfo) return null;
  return `${networkInfo.blockExplorer}/tx/${txHash}`;
};

/**
 * Gets the address explorer URL.
 * @param {number} chainId - The chain ID
 * @param {string} address - The contract or wallet address
 * @returns {string | null} Block explorer URL or null if unsupported
 */
export const getAddressExplorerUrl = (chainId: number, address: string): string | null => {
  const networkInfo = getNetworkInfo(chainId);
  if (!networkInfo) return null;
  return `${networkInfo.blockExplorer}/address/${address}`;
};

/**
 * Checks if a network is a testnet.
 * @param {number} chainId - The chain ID
 * @returns {boolean} True if testnet, false otherwise
 */
export const isTestnet = (chainId: number): boolean => {
  return getNetworkInfo(chainId)?.isTestnet ?? false;
};

/**
 * Gets all supported network IDs.
 * @returns {number[]} Array of supported chain IDs
 */
export const getSupportedChainIds = (): number[] => {
  return Object.keys(SUPPORTED_NETWORKS).map(Number);
};

/**
 * Validates if chain switching is needed.
 * @param {number | undefined} currentChainId - Current chain ID
 * @param {number} targetChainId - Target chain ID
 * @returns {boolean} True if switching is needed
 */
export const needsChainSwitch = (currentChainId: number | undefined, targetChainId: number): boolean => {
  return currentChainId !== targetChainId;
};

/**
 * Gets user-friendly error message for unsupported network.
 * @param {number} chainId - The unsupported chain ID
 * @returns {string} Error message
 */
export const getUnsupportedNetworkMessage = (chainId: number): string => {
  const supportedNetworks = Object.values(SUPPORTED_NETWORKS)
    .map(n => n.name)
    .join(', ');
  return `Network not supported. Please switch to one of: ${supportedNetworks}`;
};

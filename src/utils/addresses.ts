import { isAddress } from 'viem';

// A commonly used constant for the zero address
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// Chain-aware contract addresses
export type ChainId = 1 | 137 | 56 | 8453 | 11155111 | 61 | 2001;

export interface ContractAddresses {
  djed: `0x${string}`;
  stableCoin: `0x${string}`;
  reserveCoin: `0x${string}`;
  oracle: `0x${string}`;
  collateralAsset: `0x${string}`;
}

// Validation function to ensure addresses are valid
const validateAddress = (address: string, name: string, chainId: ChainId, allowZero: boolean = false): `0x${string}` => {
  if (!address) {
    throw new Error(`Invalid ${name} address for chain ${chainId}: ${address}`);
  }
  
  // Allow zero addresses for undeployed chains in development
  if (address === ZERO_ADDRESS && !allowZero) {
    throw new Error(`Invalid ${name} address for chain ${chainId}: ${address}`);
  }
  
  if (!isAddress(address)) {
    throw new Error(`Invalid ${name} address format for chain ${chainId}: ${address}`);
  }
  return address as `0x${string}`;
};

// Chain-specific contract addresses
export const CONTRACT_ADDRESSES: Record<ChainId, ContractAddresses> = {
  // Ethereum Mainnet (placeholder addresses - not yet deployed)
  1: {
    djed: validateAddress(ZERO_ADDRESS, "DJED", 1, true),
    stableCoin: validateAddress(ZERO_ADDRESS, "StableCoin", 1, true),
    reserveCoin: validateAddress(ZERO_ADDRESS, "ReserveCoin", 1, true),
    oracle: validateAddress(ZERO_ADDRESS, "Oracle", 1, true),
    collateralAsset: validateAddress(ZERO_ADDRESS, "CollateralAsset", 1, true),
  },
  // Polygon (placeholder addresses - not yet deployed)
  137: {
    djed: validateAddress(ZERO_ADDRESS, "DJED", 137, true),
    stableCoin: validateAddress(ZERO_ADDRESS, "StableCoin", 137, true),
    reserveCoin: validateAddress(ZERO_ADDRESS, "ReserveCoin", 137, true),
    oracle: validateAddress(ZERO_ADDRESS, "Oracle", 137, true),
    collateralAsset: validateAddress(ZERO_ADDRESS, "CollateralAsset", 137, true),
  },
  // BSC (placeholder addresses - not yet deployed)
  56: {
    djed: validateAddress(ZERO_ADDRESS, "DJED", 56, true),
    stableCoin: validateAddress(ZERO_ADDRESS, "StableCoin", 56, true),
    reserveCoin: validateAddress(ZERO_ADDRESS, "ReserveCoin", 56, true),
    oracle: validateAddress(ZERO_ADDRESS, "Oracle", 56, true),
    collateralAsset: validateAddress(ZERO_ADDRESS, "CollateralAsset", 56, true),
  },
  // Base (placeholder addresses - not yet deployed)
  8453: {
    djed: validateAddress(ZERO_ADDRESS, "DJED", 8453, true),
    stableCoin: validateAddress(ZERO_ADDRESS, "StableCoin", 8453, true),
    reserveCoin: validateAddress(ZERO_ADDRESS, "ReserveCoin", 8453, true),
    oracle: validateAddress(ZERO_ADDRESS, "Oracle", 8453, true),
    collateralAsset: validateAddress(ZERO_ADDRESS, "CollateralAsset", 8453, true),
  },
  // Sepolia Testnet (not yet deployed)
  11155111: {
    djed: validateAddress(ZERO_ADDRESS, "DJED", 11155111,true),
    stableCoin: validateAddress(ZERO_ADDRESS, "StableCoin", 11155111,true),
    reserveCoin: validateAddress(ZERO_ADDRESS, "ReserveCoin", 11155111,true),
    oracle: validateAddress(ZERO_ADDRESS, "Oracle", 11155111,true),
    collateralAsset: validateAddress(ZERO_ADDRESS, "CollateralAsset", 11155111,true),
  },
  // Ethereum Classic (placeholder addresses - not yet deployed)
  61: {
    djed: validateAddress(ZERO_ADDRESS, "DJED", 61, true),
    stableCoin: validateAddress(ZERO_ADDRESS, "StableCoin", 61, true),
    reserveCoin: validateAddress(ZERO_ADDRESS, "ReserveCoin", 61, true),
    oracle: validateAddress(ZERO_ADDRESS, "Oracle", 61, true),
    collateralAsset: validateAddress(ZERO_ADDRESS, "CollateralAsset", 61, true),
  },
  // Milkomeda (placeholder addresses - not yet deployed)
  2001: {
    djed: validateAddress(ZERO_ADDRESS, "DJED", 2001, true),
    stableCoin: validateAddress(ZERO_ADDRESS, "StableCoin", 2001, true),
    reserveCoin: validateAddress(ZERO_ADDRESS, "ReserveCoin", 2001, true),
    oracle: validateAddress(ZERO_ADDRESS, "Oracle", 2001, true),
    collateralAsset: validateAddress(ZERO_ADDRESS, "CollateralAsset", 2001, true),
  },
};

// Helper functions to get addresses by chain ID
export const getContractAddresses = (chainId: ChainId): ContractAddresses => {
  const addresses = CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return addresses;
};

export const getDjedAddress = (chainId: ChainId): `0x${string}` => getContractAddresses(chainId).djed;
export const getStableCoinAddress = (chainId: ChainId): `0x${string}` => getContractAddresses(chainId).stableCoin;
export const getReserveCoinAddress = (chainId: ChainId): `0x${string}` => getContractAddresses(chainId).reserveCoin;
export const getOracleAddress = (chainId: ChainId): `0x${string}` => getContractAddresses(chainId).oracle;
export const getCollateralAssetAddress = (chainId: ChainId): `0x${string}` => getContractAddresses(chainId).collateralAsset;

// Legacy exports for backward compatibility (defaulting to Sepolia testnet)
export const DJED_ADDRESS = getDjedAddress(11155111);
export const STABLE_COIN_ADDRESS = getStableCoinAddress(11155111);
export const RESERVE_COIN_ADDRESS = getReserveCoinAddress(11155111);
export const ORACLE_ADDRESS = getOracleAddress(11155111);
export const COLLATERAL_ASSET_ADDRESS = getCollateralAssetAddress(11155111);

// Legacy export for backward compatibility
export const BASE_COIN_ADDRESS = COLLATERAL_ASSET_ADDRESS;

export const StableCoinFactories = {
  1: ZERO_ADDRESS, // Ethereum Mainnet - Update with actual address
  137: ZERO_ADDRESS, // Polygon - Update with actual address
  56: ZERO_ADDRESS, // BSC - Update with actual address
  8453: ZERO_ADDRESS, // Base - Update with actual address
  11155111: ZERO_ADDRESS, // Sepolia Testnet - Updated with deployed address
  61: ZERO_ADDRESS, // Ethereum Classic - Update with actual address
  2001: ZERO_ADDRESS, // Milkomeda - Update with actual address
} as {
  [key: number]: `0x${string}`;
};

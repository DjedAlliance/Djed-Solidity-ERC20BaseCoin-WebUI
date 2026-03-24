import { isAddress } from "viem";
// A commonly used constant for the zero address
export const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000";

// Chain IDs supported
export type ChainId = 1 | 137 | 56 | 8453 | 11155111 | 61 | 2001;

export interface ContractAddresses {
  djed: `0x${string}`;
  stableCoin: `0x${string}`;
  reserveCoin: `0x${string}`;
  oracle: `0x${string}`;
  collateralAsset: `0x${string}`;
}

// --------------------------------------
// Address Validation Helpers
// --------------------------------------

const validateAddress = (
  address: string,
  name: string,
  chainId: ChainId
): `0x${string}` => {
  if (!address || !isAddress(address)) {
    throw new Error(
      `Invalid ${name} address for chain ${chainId}: ${address}`
    );
  }
  return address as `0x${string}`;
};

const ensureDeployed = (
  address: `0x${string}`,
  name: string,
  chainId: ChainId
): `0x${string}` => {
  if (address === ZERO_ADDRESS) {
    throw new Error(`${name} not deployed on chain ${chainId}`);
  }
  return address;
};

// --------------------------------------
// Contract Address Config (EDIT HERE)
// --------------------------------------

export const CONTRACT_ADDRESSES: Record<ChainId, ContractAddresses> = {
  1: {
    djed: ZERO_ADDRESS,
    stableCoin: ZERO_ADDRESS,
    reserveCoin: ZERO_ADDRESS,
    oracle: ZERO_ADDRESS,
    collateralAsset: ZERO_ADDRESS,
  },
  137: {
    djed: ZERO_ADDRESS,
    stableCoin: ZERO_ADDRESS,
    reserveCoin: ZERO_ADDRESS,
    oracle: ZERO_ADDRESS,
    collateralAsset: ZERO_ADDRESS,
  },
  56: {
    djed: ZERO_ADDRESS,
    stableCoin: ZERO_ADDRESS,
    reserveCoin: ZERO_ADDRESS,
    oracle: ZERO_ADDRESS,
    collateralAsset: ZERO_ADDRESS,
  },
  8453: {
    djed: ZERO_ADDRESS,
    stableCoin: ZERO_ADDRESS,
    reserveCoin: ZERO_ADDRESS,
    oracle: ZERO_ADDRESS,
    collateralAsset: ZERO_ADDRESS,
  },
  11155111: {
    djed: ZERO_ADDRESS, // 👉 replace when deployed
    stableCoin: ZERO_ADDRESS,
    reserveCoin: ZERO_ADDRESS,
    oracle: ZERO_ADDRESS,
    collateralAsset: ZERO_ADDRESS,
  },
  61: {
    djed: ZERO_ADDRESS,
    stableCoin: ZERO_ADDRESS,
    reserveCoin: ZERO_ADDRESS,
    oracle: ZERO_ADDRESS,
    collateralAsset: ZERO_ADDRESS,
  },
  2001: {
    djed: ZERO_ADDRESS,
    stableCoin: ZERO_ADDRESS,
    reserveCoin: ZERO_ADDRESS,
    oracle: ZERO_ADDRESS,
    collateralAsset: ZERO_ADDRESS,
  },
};

// --------------------------------------
// Core Getter
// --------------------------------------

export const getContractAddresses = (
  chainId: ChainId
): ContractAddresses => {
  const addresses = CONTRACT_ADDRESSES[chainId];

  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  return addresses;
};

// --------------------------------------
// Safe Getters (NO ZERO ADDRESS LEAK)
// --------------------------------------

export const getDjedAddress = (chainId: ChainId) =>
  ensureDeployed(
    validateAddress(
      getContractAddresses(chainId).djed,
      "DJED",
      chainId
    ),
    "DJED",
    chainId
  );

export const getStableCoinAddress = (chainId: ChainId) =>
  ensureDeployed(
    validateAddress(
      getContractAddresses(chainId).stableCoin,
      "StableCoin",
      chainId
    ),
    "StableCoin",
    chainId
  );

export const getReserveCoinAddress = (chainId: ChainId) =>
  ensureDeployed(
    validateAddress(
      getContractAddresses(chainId).reserveCoin,
      "ReserveCoin",
      chainId
    ),
    "ReserveCoin",
    chainId
  );

export const getOracleAddress = (chainId: ChainId) =>
  ensureDeployed(
    validateAddress(
      getContractAddresses(chainId).oracle,
      "Oracle",
      chainId
    ),
    "Oracle",
    chainId
  );

export const getCollateralAssetAddress = (chainId: ChainId) =>
  ensureDeployed(
    validateAddress(
      getContractAddresses(chainId).collateralAsset,
      "CollateralAsset",
      chainId
    ),
    "CollateralAsset",
    chainId
  );

// --------------------------------------
// Environment-based DJED (SAFE)
// --------------------------------------

const DJED_ENV = process.env.NEXT_PUBLIC_DJED_CONTRACT ?? "";

export const DJED_ADDRESS: `0x${string}` | undefined =
  DJED_ENV && isAddress(DJED_ENV)
    ? (DJED_ENV as `0x${string}`)
    : undefined;

// --------------------------------------
// Factory Addresses (Optional)
// --------------------------------------

export const StableCoinFactories: Record<number, `0x${string}`> = {
  1: ZERO_ADDRESS,
  137: ZERO_ADDRESS,
  56: ZERO_ADDRESS,
  8453: ZERO_ADDRESS,
  11155111: ZERO_ADDRESS,
  61: ZERO_ADDRESS,
  2001: ZERO_ADDRESS,
};
// --------------------------------------
// Chain Support Helper
// --------------------------------------

export const isSupportedChain = (id: number): id is ChainId => {
  return [1, 137, 56, 8453, 11155111, 61, 2001].includes(id);
};
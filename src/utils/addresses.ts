// Contract addresses from deployment
export const DJED_ADDRESS = "0xb3e92c1ce831cd8be26ebb8d5b783321011c3f22" as const;
export const STABLE_COIN_ADDRESS = "0x5d2939fa42af9e90adf6a18fc3f84d9ad19bda84" as const;
export const RESERVE_COIN_ADDRESS = "0x5d2939fa42af9e90adf6a18fc3f84d9ad19bda84" as const;
export const ORACLE_ADDRESS = "0x3ef9eeb71405392cdee8b2d5c1247f0be1a33380" as const;
export const BASE_COIN_ADDRESS = "0x5d2939fa42af9e90adf6a18fc3f84d9ad19bda84" as const;

export const StableCoinFactories = {
  1: "0x0000000000000000000000000000000000000000", // Ethereum Mainnet - Update with actual address
  137: "0x0000000000000000000000000000000000000000", // Polygon - Update with actual address
  56: "0x0000000000000000000000000000000000000000", // BSC - Update with actual address
  8453: "0x0000000000000000000000000000000000000000", // Base - Update with actual address
  11155111: "0x0000000000000000000000000000000000000000", // Sepolia Testnet - Updated with deployed address
  61: "0x0000000000000000000000000000000000000000", // Ethereum Classic - Update with actual address
} as {
  [key: number]: `0x${string}`;
};

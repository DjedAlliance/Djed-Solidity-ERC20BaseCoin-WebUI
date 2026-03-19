"use client";

import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";

import {
  getCollateralAssetAddress,
  getStableCoinAddress,
  isSupportedChain,
  ChainId,
} from "@/utils/addresses";

export default function TokenBalances() {
  const { chain, address, isConnected } = useAccount();

  // -----------------------------
  // Chain Handling (SAFE)
  // -----------------------------
  const chainId = chain?.id;
  const isValidChain = !!chainId && isSupportedChain(chainId);

  const chainIdTyped = (chainId ?? 11155111) as ChainId;

  let baseCoinAddress: `0x${string}` | undefined;
  let stableCoinAddress: `0x${string}` | undefined;

  try {
    baseCoinAddress = getCollateralAssetAddress(chainIdTyped);
    stableCoinAddress = getStableCoinAddress(chainIdTyped);
  } catch {
    // prevent crash
  }

  // -----------------------------
  // CONTRACT READS
  // -----------------------------
  const { data: baseBalance } = useReadContract({
    address: baseCoinAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!baseCoinAddress && isValidChain,
    },
  });

  const { data: stableBalance } = useReadContract({
    address: stableCoinAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!stableCoinAddress && isValidChain,
    },
  });

  // -----------------------------
  // UI SAFETY (AFTER HOOKS)
  // -----------------------------
  if (!isConnected || !address) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-secondary">Connect wallet to view balances</p>
      </div>
    );
  }

  if (!isValidChain) {
    return (
      <div className="p-4 border rounded-lg text-red-500">
        Unsupported network
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Token Balances</h2>

      <p>
        BaseCoin Balance:{" "}
        {baseBalance ? formatUnits(baseBalance, 18) : "0"}
      </p>

      <p>
        StableCoin Balance:{" "}
        {stableBalance ? formatUnits(stableBalance, 18) : "0"}
      </p>
    </div>
  );
}
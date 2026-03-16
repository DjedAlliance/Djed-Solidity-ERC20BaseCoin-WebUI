"use client";

import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
const BASE_TOKEN = "0xYourBaseTokenAddress" as `0x${string}`;
const STABLE_TOKEN = "0xYourStableCoinAddress" as `0x${string}`;

export default function TokenBalances() {
  const { address, isConnected } = useAccount();

  const { data: baseBalance } = useReadContract({
    address: BASE_TOKEN,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const { data: stableBalance } = useReadContract({
    address: STABLE_TOKEN,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  if (!isConnected || !address) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-secondary">Connect wallet to view balances</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Token Balances</h2>

      <p>
        BaseCoin Balance: {baseBalance ? formatUnits(baseBalance, 18) : "0"}
      </p>
      <p>
        StableCoin Balance:{" "}
        {stableBalance ? formatUnits(stableBalance, 18) : "0"}
      </p>
    </div>
  );
}

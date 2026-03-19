"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { RefreshCw } from "lucide-react";
import { useCallback } from "react";
import {
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  GlowCard,
} from "@/components/ui";

import DJED_ABI from "@/utils/abi/Djed.json";
import COIN_ABI from "@/utils/abi/Coin.json";
import ORACLE_ABI from "@/utils/abi/IOracle.json";

import {
  getDjedAddress,
  getStableCoinAddress,
  getReserveCoinAddress,
  getOracleAddress,
  isSupportedChain,
  ChainId,
} from "@/utils/addresses";

export default function Dashboard() {
  const { chain } = useAccount();
  const [, setRefreshKey] = useState(0);

  // -----------------------------
  // Chain Handling
  // -----------------------------
  const chainId = chain?.id;
  const isValidChain = !!chainId && isSupportedChain(chainId);
  const chainIdTyped = (chainId ?? 11155111) as ChainId;

  // -----------------------------
  // Address Resolution
  // -----------------------------
  let djedAddress: `0x${string}` | undefined;
  let stableCoinAddress: `0x${string}` | undefined;
  let reserveCoinAddress: `0x${string}` | undefined;
  let oracleAddress: `0x${string}` | undefined;

  try {
    if (isValidChain && chainId) {
      djedAddress = getDjedAddress(chainIdTyped);
      stableCoinAddress = getStableCoinAddress(chainIdTyped);
      reserveCoinAddress = getReserveCoinAddress(chainIdTyped);
      oracleAddress = getOracleAddress(chainIdTyped);
    }
  } catch (e) {
    console.warn("Address error:", e);
  }

  // -----------------------------
  // CONTRACT READS
  // -----------------------------
  const { data: ratio, refetch: refetchRatio } = useReadContract({
    address: djedAddress ?? undefined,
    abi: DJED_ABI,
    functionName: "ratio",
    query: { enabled: !!djedAddress && isValidChain },
  });

  const { data: reserveAmount, refetch: refetchReserveAmount } =
    useReadContract({
      address: djedAddress ?? undefined,
      abi: DJED_ABI,
      functionName: "R",
      args: [0n],
      query: { enabled: !!djedAddress && isValidChain },
    });

  const { data: scPrice, refetch: refetchScPrice } = useReadContract({
    address: djedAddress ?? undefined,
    abi: DJED_ABI,
    functionName: "scPrice",
    args: [0n],
    query: { enabled: !!djedAddress && isValidChain },
  });

  const {  refetch: refetchOraclePrice } =
    useReadContract({
      address: stableCoinAddress ?? undefined,
      abi: ORACLE_ABI,
      functionName: "readData",
      query: { enabled: !!oracleAddress && isValidChain },
    });

  const {
  
  refetch: refetchStableSupply,
} = useReadContract({
    address: stableCoinAddress!,
    abi: COIN_ABI,
    functionName: "totalSupply",
    query: { enabled: !!stableCoinAddress && isValidChain },
  });

  useReadContract({
    address: reserveCoinAddress ?? undefined,
    abi: COIN_ABI,
    functionName: "totalSupply",
    query: { enabled: !!reserveCoinAddress && isValidChain },
  });

  // -----------------------------
  // REFRESH
  // -----------------------------
  const handleRefresh = useCallback(() => {
  setRefreshKey((prev) => prev + 1);
  refetchRatio();
  refetchReserveAmount();
  refetchScPrice();
  refetchOraclePrice();
  refetchStableSupply();
}, [
  refetchRatio,
  refetchReserveAmount,
  refetchScPrice,
  refetchOraclePrice,
  refetchStableSupply,
]);

  useEffect(() => {
    handleRefresh();
  }, [chainId, handleRefresh]);

  // -----------------------------
  // HELPERS
  // -----------------------------
  const formatNumber = (v?: bigint) =>
    v ? parseFloat(formatUnits(v, 18)).toFixed(4) : "0";

  const formatPrice = (v?: bigint) =>
    v ? `$${parseFloat(formatUnits(v, 18)).toFixed(2)}` : "$0.00";

  const formatPercentage = (v?: bigint) =>
    v ? `${parseFloat(formatUnits(v, 2))}%` : "0%";

  const calculateLeverageRatio = (r?: bigint) => {
    if (!r) return "—";
    const val = parseFloat(formatUnits(r, 2));
    return val > 1 ? (1 / (val - 1)).toFixed(2) : "—";
  };

  if (!isValidChain) {
    return (
      <div className="p-6 text-red-500">
        Unsupported or no network selected
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowCard>
          <CardHeader>
            <CardTitle>Stable Price</CardTitle>
          </CardHeader>
          <CardContent>{formatPrice(scPrice as bigint)}</CardContent>
        </GlowCard>

        <GlowCard>
          <CardHeader>
            <CardTitle>Reserve Ratio</CardTitle>
          </CardHeader>
          <CardContent>{formatPercentage(ratio as bigint)}</CardContent>
        </GlowCard>

        <GlowCard>
          <CardHeader>
            <CardTitle>Total Reserves</CardTitle>
          </CardHeader>
          <CardContent>
            {formatNumber(reserveAmount as bigint)}
          </CardContent>
        </GlowCard>

        <GlowCard>
          <CardHeader>
            <CardTitle>Leverage</CardTitle>
          </CardHeader>
          <CardContent>
            {calculateLeverageRatio(ratio as bigint)}
          </CardContent>
        </GlowCard>
      </div>
    </div>
  );
}
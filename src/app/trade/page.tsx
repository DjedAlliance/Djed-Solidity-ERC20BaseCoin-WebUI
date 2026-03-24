/* eslint-disable */
// @ts-nocheck
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useChainId,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";

import {
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Separator,
  Alert,
  AlertDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import DJED_ABI from "@/utils/abi/Djed.json";
import COIN_ABI from "@/utils/abi/Coin.json";
import {
  getStableCoinAddress,
  getReserveCoinAddress,
  DJED_ADDRESS,
} from "@/utils/addresses";

type TradeType =
  | "buy-stable"
  | "sell-stable"
  | "buy-reserve"
  | "sell-reserve"
  | "sell-both";

function TradePage() {
  const chainId = useChainId();
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();

  const contractAddress = (searchParams.get("address") ??
    DJED_ADDRESS) as `0x${string}` | undefined;

  const [tradeType, setTradeType] = useState<TradeType>("buy-stable");
  const [amount, setAmount] = useState("");
  const [amountRC, setAmountRC] = useState("");
  const [receiver, setReceiver] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("0");
  const [isCalculating, setIsCalculating] = useState(false);
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const { isLoading: isApprovalConfirming } =
    useWaitForTransactionReceipt({ hash: approvalHash });

  let stableCoinAddress: `0x${string}` | undefined;
  let reserveCoinAddress: `0x${string}` | undefined;

  try {
    if (chainId) {
      stableCoinAddress = getStableCoinAddress(chainId);
      reserveCoinAddress = getReserveCoinAddress(chainId);
    }
  } catch (e) {
    console.warn("Address error:", e);
  }

  const { data: baseCoinAddress } = useReadContract({
    address: contractAddress!,
    abi: DJED_ABI,
    functionName: "baseCoin",
    query: { enabled: !!contractAddress },
  });

  const { data: baseCoinAllowance } = useReadContract({
    address: baseCoinAddress as `0x${string}`,
    abi: COIN_ABI,
    functionName: "allowance",
    args: address && contractAddress ? [address, contractAddress] : undefined,
    query: { enabled: !!baseCoinAddress && !!address },
  });

  const { data: scPrice } = useReadContract({
    address: contractAddress!,
    abi: DJED_ABI,
    functionName: "scPrice",
    args: [0n],
    query: { enabled: !!contractAddress },
  });

  // ---------------- CALC ----------------

  useEffect(() => {
    if (amount && scPrice) {
      try {
        setIsCalculating(true);
        const amt = parseUnits(amount, 18);
        const result = (amt * 10n ** 18n) / (scPrice as bigint);
        setEstimatedAmount(formatUnits(result, 18));
      } catch {
        setEstimatedAmount("0");
      } finally {
        setIsCalculating(false);
      }
    }
  }, [amount, scPrice]);

  useEffect(() => {
    if (address && !receiver) {
      setReceiver(address);
    }
  }, [address]);

  // ---------------- TRADE ----------------

  const handleTrade = async () => {
    if (!amount || !receiver || !address || !contractAddress) return;

    const amountBN = parseUnits(amount, 18);

    // approval
    if (baseCoinAddress && (baseCoinAllowance ?? 0n) < amountBN) {
      const tx = await writeContractAsync({
        address: baseCoinAddress,
        abi: COIN_ABI,
        functionName: "approve",
        args: [contractAddress, amountBN],
      });
      setApprovalHash(tx);
      return;
    }

    await writeContractAsync({
      address: contractAddress,
      abi: DJED_ABI,
      functionName:
        tradeType === "buy-stable"
          ? "buyStablecoins"
          : tradeType === "sell-stable"
          ? "sellStablecoins"
          : tradeType === "buy-reserve"
          ? "buyReserveCoins"
          : tradeType === "sell-reserve"
          ? "sellReserveCoins"
          : "sellBothCoins",
      args:
        tradeType === "sell-both"
          ? [amountBN, parseUnits(amountRC || "0", 18), receiver, 0n, address]
          : tradeType === "sell-stable"
          ? [amountBN, receiver, 0n, address]
          : [receiver, 0n, address, amountBN],
    });
  };

  if (!chainId) return <div className="p-6">Connect wallet</div>;
  if (!contractAddress) return <div className="p-6">Invalid contract</div>;
  if (!isConnected) return <div className="p-6">Connect wallet</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Trade</h1>

      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />

      <Button
        onClick={handleTrade}
        disabled={isPending || isConfirming || isApprovalConfirming}
      >
        {isPending ? "Processing..." : "Execute Trade"}
      </Button>

      {error && <div className="text-red-500">{error.message}</div>}
      {isConfirmed && <div className="text-green-500">Success</div>}
    </div>
  );
}

export default function Trade() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TradePage />
    </Suspense>
  );
}
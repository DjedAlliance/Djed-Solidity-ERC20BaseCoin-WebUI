/* eslint-disable */
// @ts-nocheck
"use client";
import { useSwitchChain } from "wagmi";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
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
  getContractAddresses,
  ALLOWED_DJED_CONTRACTS,
  isDeployedAddress,
} from "@/utils/addresses";

import DJED_ABI from "@/utils/abi/Djed.json";
import COIN_ABI from "@/utils/abi/Coin.json";
import UnsupportedNetwork from "@/components/UnsupportedNetwork";

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
  const { switchChainAsync } = useSwitchChain();

  /* ================= CONTRACTS ================= */

  const contracts = getContractAddresses(chainId);

  if (!contracts) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p>Unsupported Network</p>
      <button
        onClick={async () => {
          try {
            await switchChainAsync({ chainId: 1 }); // replace with your default chain
          } catch (err) {
            console.error("Switch failed:", err);
          }
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Switch Network
      </button>
    </div>
  );
}

  const { djed, stableCoin, reserveCoin } = contracts;

  const rawAddress = searchParams.get("address") as `0x${string}` | null;

  const contractAddress =
    rawAddress && ALLOWED_DJED_CONTRACTS.has(rawAddress) ? rawAddress : djed;

  /* ================= STATE ================= */

  const [tradeType, setTradeType] = useState<TradeType>("buy-stable");
  const [amount, setAmount] = useState("");
  const [amountRC, setAmountRC] = useState("");
  const [receiver, setReceiver] = useState("");
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();

  /* ================= SAFE PARSE ================= */

  const parsedAmount = useMemo(() => {
    try {
      return amount ? parseUnits(amount, 18) : 0n;
    } catch {
      return 0n;
    }
  }, [amount]);

  const parsedAmountRC = useMemo(() => {
    try {
      return amountRC ? parseUnits(amountRC, 18) : 0n;
    } catch {
      return 0n;
    }
  }, [amountRC]);

  /* ================= WRITE ================= */

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const { isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  /* ================= READS ================= */

  const { data: baseCoinAddress } = useReadContract({
    address: contractAddress,
    abi: DJED_ABI,
    functionName: "baseCoin",
    chainId,
    enabled: isDeployedAddress(contractAddress),
  });

  const { data: baseCoinAllowance } = useReadContract({
    address: baseCoinAddress as `0x${string}`,
    abi: COIN_ABI,
    functionName: "allowance",
    args: address && contractAddress ? [address, contractAddress] : undefined,
    chainId,
    enabled: isDeployedAddress(baseCoinAddress) && Boolean(address),
  });

  const { data: stableCoinAllowance } = useReadContract({
    address: stableCoin,
    abi: COIN_ABI,
    functionName: "allowance",
    args: address && contractAddress ? [address, contractAddress] : undefined,
    chainId,
    enabled: isDeployedAddress(stableCoin) && Boolean(address),
  });

  const { data: reserveCoinAllowance } = useReadContract({
    address: reserveCoin,
    abi: COIN_ABI,
    functionName: "allowance",
    args: address && contractAddress ? [address, contractAddress] : undefined,
    chainId,
    enabled: isDeployedAddress(reserveCoin) && Boolean(address),
  });

  /* ================= EXECUTE TRADE ================= */

  const executeTrade = useCallback(async () => {
    if (!address || !receiver) return;

    switch (tradeType) {
      case "buy-stable":
        await writeContractAsync({
          address: contractAddress,
          abi: DJED_ABI,
          functionName: "buyStablecoins",
          args: [receiver, 0n, address, parsedAmount],
        });
        break;

      case "sell-stable":
        await writeContractAsync({
          address: contractAddress,
          abi: DJED_ABI,
          functionName: "sellStablecoins",
          args: [parsedAmount, receiver, 0n, address],
        });
        break;

      case "sell-both":
        await writeContractAsync({
          address: contractAddress,
          abi: DJED_ABI,
          functionName: "sellBothCoins",
          args: [parsedAmount, parsedAmountRC, receiver, 0n, address],
        });
        break;
    }
  }, [
    tradeType,
    parsedAmount,
    parsedAmountRC,
    receiver,
    address,
    writeContractAsync,
    contractAddress,
  ]);

  /* ================= HANDLE TRADE ================= */

  const handleTrade = useCallback(async () => {
    if (!address) return;

    // BaseCoin approval
    if (
      tradeType === "buy-stable" &&
      baseCoinAddress &&
      (baseCoinAllowance ?? 0n) < parsedAmount
    ) {
      const tx = await writeContractAsync({
        address: baseCoinAddress,
        abi: COIN_ABI,
        functionName: "approve",
        args: [contractAddress, parsedAmount],
      });
      setApprovalHash(tx);
      return;
    }

    // Stable approval
    if (
      tradeType === "sell-stable" &&
      (stableCoinAllowance ?? 0n) < parsedAmount
    ) {
      const tx = await writeContractAsync({
        address: stableCoin,
        abi: COIN_ABI,
        functionName: "approve",
        args: [contractAddress, parsedAmount],
      });
      setApprovalHash(tx);
      return;
    }

    // Sell both approvals
    if (tradeType === "sell-both") {
      if ((stableCoinAllowance ?? 0n) < parsedAmount) {
        const tx = await writeContractAsync({
          address: stableCoin,
          abi: COIN_ABI,
          functionName: "approve",
          args: [contractAddress, parsedAmount],
        });
        setApprovalHash(tx);
        return;
      }

      if ((reserveCoinAllowance ?? 0n) < parsedAmountRC) {
        const tx = await writeContractAsync({
          address: reserveCoin,
          abi: COIN_ABI,
          functionName: "approve",
          args: [contractAddress, parsedAmountRC],
        });
        setApprovalHash(tx);
        return;
      }
    }

    await executeTrade();
  }, [
    tradeType,
    parsedAmount,
    parsedAmountRC,
    baseCoinAddress,
    baseCoinAllowance,
    stableCoinAllowance,
    reserveCoinAllowance,
    writeContractAsync,
    contractAddress,
    address,
    executeTrade,
  ]);

  /* ================= SAFE APPROVAL RETRY ================= */

  useEffect(() => {
  // Reset state when wallet or network changes
  setApprovalHash(undefined);
  setAmount("");
  setAmountRC("");
  setReceiver(address ?? "");
}, [chainId, address]);

  /* ================= CONNECT CHECK ================= */

  if (!isConnected) {
    return <div>Connect Wallet</div>;
  }

  /* ================= UI ================= */

  return (
    <div>
      <button onClick={handleTrade} disabled={!parsedAmount || isPending}>
        Execute Trade
      </button>

      {error && <div>{error.message}</div>}
      {isConfirmed && <div>Trade Confirmed</div>}
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

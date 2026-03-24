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

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowDownUp, CheckCircle2, AlertCircle, Info, Wallet } from "lucide-react";

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

  const { data: baseCoinBalance } = useReadContract({
    address: baseCoinAddress as `0x${string}`,
    abi: COIN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId,
    enabled: isDeployedAddress(baseCoinAddress) && Boolean(address),
  });

  const { data: stableCoinBalance } = useReadContract({
    address: stableCoin,
    abi: COIN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId,
    enabled: isDeployedAddress(stableCoin) && Boolean(address),
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

  /* ================= UI / FEE / STATE CALCS ================= */

  const isBuy = tradeType === "buy-stable";
  
  // Balances
  const dBaseBalance = baseCoinBalance ? Number(formatUnits(baseCoinBalance as bigint, 18)).toFixed(2) : "0.00";
  const dStableBalance = stableCoinBalance ? Number(formatUnits(stableCoinBalance as bigint, 18)).toFixed(2) : "0.00";

  // Complex fee calculation (Mocked 2% platform fee for demonstration)
  const numericAmount = parseFloat(amount || "0");
  const feePercentage = 0.02;
  const feeAmount = numericAmount * feePercentage;
  const finalAmount = numericAmount > 0 ? numericAmount - feeAmount : 0;

  // Deriving transaction stages
  const needsApproval = isBuy 
    ? (baseCoinAllowance ?? 0n) < parsedAmount
    : (stableCoinAllowance ?? 0n) < parsedAmount;

  const isInsufficientBalance = isBuy 
    ? (baseCoinBalance !== undefined && parsedAmount > (baseCoinBalance as bigint))
    : (stableCoinBalance !== undefined && parsedAmount > (stableCoinBalance as bigint));

  const isApproving = isPending && isApprovalConfirmed === false && approvalHash !== undefined;
  const isExecuting = isPending && !isApproving;

  const getButtonState = () => {
    if (isPending) {
      if (needsApproval) return { text: "Processing Approval...", icon: <Loader2 className="w-5 h-5 animate-spin" />, disabled: true };
      return { text: "Processing Trade...", icon: <Loader2 className="w-5 h-5 animate-spin" />, disabled: true };
    }
    if (isConfirmed && !error && numericAmount > 0) return { text: "Confirmed! ✅", icon: null, disabled: false };
    
    if (numericAmount === 0) return { text: "Enter an amount", icon: null, disabled: true };
    if (isInsufficientBalance) return { text: "Insufficient Balance", icon: null, disabled: true };
    if (needsApproval) return { text: `Step 1: Approve ${isBuy ? 'BaseCoin' : 'StableCoin'}`, icon: null, disabled: false };
    
    return { text: `Step 2: ${isBuy ? 'Buy StableCoin' : 'Sell StableCoin'}`, icon: null, disabled: false };
  };

  const btnState = getButtonState();

  return (
    <div className="w-full max-w-lg mx-auto mt-12 p-1">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-slate-800/50"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Swap StableCoins
          </h2>
          <div className="flex bg-slate-200/50 dark:bg-slate-800/50 rounded-full p-1 border border-slate-300/30 dark:border-slate-700/50">
            <button
              onClick={() => { setTradeType("buy-stable"); setAmount(""); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${isBuy ? 'bg-white dark:bg-slate-700 shadow-md text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Buy
            </button>
            <button
              onClick={() => { setTradeType("sell-stable"); setAmount(""); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!isBuy ? 'bg-white dark:bg-slate-700 shadow-md text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Input Box */}
        <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl p-4 mb-2 border border-slate-200/50 dark:border-slate-700/50 transition-all focus-within:ring-2 focus-within:ring-orange-500/50">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
              You {isBuy ? 'Pay' : 'Convert'}
            </label>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white/50 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg">
              <Wallet className="w-3.5 h-3.5 text-orange-500" />
              {isBuy ? `${dBaseBalance} BaseCoin` : `${dStableBalance} DJED`}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-4xl font-black text-slate-800 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
            <div className="shrink-0 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 flex items-center gap-2 font-bold text-base md:text-lg">
              {isBuy ? '🪙 Base' : '🌟 DJED'}
            </div>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
          <div className="bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 p-2 rounded-full shadow-lg">
            <ArrowDownUp className="w-5 h-5 text-orange-500" />
          </div>
        </div>

        {/* Output Box */}
        <div className="bg-white/60 dark:bg-slate-800/30 rounded-2xl p-4 mt-2 border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
              You Receive (Estimated)
            </label>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white/50 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg">
              <Wallet className="w-3.5 h-3.5 text-orange-500" />
              {!isBuy ? `${dBaseBalance} BaseCoin` : `${dStableBalance} DJED`}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={finalAmount > 0 ? finalAmount.toFixed(4) : ""}
              placeholder="0.00"
              className="w-full bg-transparent text-3xl font-bold text-slate-600 dark:text-slate-200 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
            <div className="shrink-0 bg-slate-100 dark:bg-slate-900 shadow-inner rounded-xl px-4 py-2 flex items-center gap-2 font-bold text-base md:text-lg text-slate-500">
              {!isBuy ? '🪙 Base' : '🌟 DJED'}
            </div>
          </div>
        </div>

        {/* Complex Fee Details */}
        <AnimatePresence>
          {numericAmount > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-2 border border-slate-200/50 dark:border-slate-800">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-1"><Info className="w-4 h-4"/> Input Amount</span>
                  <span className="font-semibold">{numericAmount.toFixed(2)} {isBuy ? 'BaseCoin' : 'DJED'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-1">Platform Fee (2%)</span>
                  <span className="font-semibold text-red-500">- {feeAmount.toFixed(4)} {isBuy ? 'BaseCoin' : 'DJED'}</span>
                </div>
                <div className="h-px w-full bg-slate-200 dark:bg-slate-700 my-2" />
                <div className="flex justify-between items-center font-bold text-orange-600 dark:text-orange-400">
                  <span>Final Output</span>
                  <span>{finalAmount.toFixed(4)} {!isBuy ? 'BaseCoin' : 'DJED'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction Status Area */}
        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-200 dark:border-red-800/30">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-medium pr-2 break-all overflow-hidden overflow-ellipsis line-clamp-2">
              Transaction Failed: {error?.message?.split('\n')[0] || "Unknown error"}
            </div>
          </div>
        )}

        <button 
          onClick={handleTrade} 
          disabled={!parsedAmount || btnState.disabled}
          className="w-full mt-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {btnState.text} {btnState.icon}
        </button>
      </motion.div>
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

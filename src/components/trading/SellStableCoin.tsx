"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";

import {
  getStableCoinAddress,
  isSupportedChain,
  ChainId,
} from "@/utils/addresses";

export default function SellStableCoin() {
  const { chain } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const chainId = chain?.id;
  const isValidChain = !!chainId && isSupportedChain(chainId);

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Config
  // -----------------------------
  const FEE_PERCENT = 3;

  // -----------------------------
  // Validate Amount
  // -----------------------------
  const getValidAmount = () => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return null;
    }
    return numericAmount;
  };

  const numericAmount = getValidAmount();

  // -----------------------------
  // Fee Calculation
  // -----------------------------
  const fee = numericAmount ? (numericAmount * FEE_PERCENT) / 100 : 0;
  const netReturn = numericAmount ? numericAmount - fee : 0;

  // -----------------------------
  // Handle Sell
  // -----------------------------
  const handleSell = async () => {
    setError(null);

    if (!isValidChain) {
      setError("Unsupported or no network selected");
      return;
    }

    if (!numericAmount) {
      setError("Enter a valid amount greater than 0");
      return;
    }

    const chainIdTyped = chainId as ChainId;

    let stableCoinAddress: `0x${string}`;

    try {
      stableCoinAddress = getStableCoinAddress(chainIdTyped);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Contracts not deployed on this network";

      setError(message);
      return;
    }

    try {
      setLoading(true);

      const amountWei = parseUnits(amount, 18);

      await writeContractAsync({
        address: stableCoinAddress,
        abi: [
          {
            name: "sell",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [{ name: "amount", type: "uint256" }],
            outputs: [],
          },
        ],
        functionName: "sell",
        args: [amountWei],
      });

      setAmount("");
    } catch (err: unknown) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : "Transaction failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI State
  // -----------------------------
  const isDisabled =
    loading || !isValidChain || !numericAmount;

  return (
    <div className="p-4 border rounded-xl space-y-4">
      <h2 className="text-lg font-semibold">Sell StableCoin</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {numericAmount && (
        <div className="text-sm text-gray-600 space-y-1">
          <div>Fee ({FEE_PERCENT}%): {fee}</div>
          <div>You receive (Collateral): {netReturn}</div>
        </div>
      )}

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        onClick={handleSell}
        disabled={isDisabled}
        className={`w-full p-2 rounded text-white ${
          isDisabled ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading ? "Processing..." : "Sell"}
      </button>

      {!chain && (
        <div className="text-yellow-500 text-sm">
          Connect your wallet
        </div>
      )}

      {chain && !isSupportedChain(chain.id) && (
        <div className="text-yellow-500 text-sm">
          Unsupported network
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";

import {
  getStableCoinAddress,
  getCollateralAssetAddress,
  isSupportedChain,
  ChainId,
} from "@/utils/addresses";

export default function BuyStableCoin() {
  const { chain } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Config (Adjust as needed)
  // -----------------------------
  const FEE_PERCENT = 3; // 3% fee

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
  const netAmount = numericAmount ? numericAmount - fee : 0;

  // -----------------------------
  // Handle Buy
  // -----------------------------
  const handleBuy = async () => {
    setError(null);

    // 1. Validate network
    if (!chain || !chain?.id || !isSupportedChain(chain.id)) {
      setError("Unsupported or no network selected");
      return;
    }

    const chainId = chain.id as ChainId;

    // 2. Validate amount
    if (!numericAmount) {
      setError("Enter a valid amount greater than 0");
      return;
    }

    // 3. Get addresses safely
    let stableCoinAddress: `0x${string}` | undefined;
    let collateralAddress: `0x${string}` | undefined;

    try {
      stableCoinAddress = getStableCoinAddress(chainId);
      collateralAddress = getCollateralAssetAddress(chainId);
    } catch (err: unknown) {
      console.error(err);

      let message = "Transaction failed";

      if (err instanceof Error) {
        message = err.message;
      }

      if (typeof err === "object" && err !== null && "shortMessage" in err) {
        message = (err as { shortMessage?: string }).shortMessage || message;
      }

      setError(message);
    }

    // 4. Extra safety check
    if (!stableCoinAddress || !collateralAddress) {
      setError("Invalid contract configuration");
      return;
    }

    try {
      setLoading(true);

      const amountWei = parseUnits(amount, 18);

      // 👉 Replace ABI + function with your actual contract
      await writeContractAsync({
        address: stableCoinAddress,
        abi: [
          {
            name: "buy",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [{ name: "amount", type: "uint256" }],
            outputs: [],
          },
        ],
        functionName: "buy",
        args: [amountWei],
      });

      setAmount("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Transaction failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI State
  // -----------------------------
  const isDisabled =
    loading ||
    !chain ||
    !chain?.id ||
    !isSupportedChain(chain.id) ||
    !numericAmount;

  return (
    <div className="p-4 border rounded-xl space-y-4">
      <h2 className="text-lg font-semibold">Buy StableCoin</h2>

      {/* Input */}
      <input
        type="text"
        inputMode="decimal"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* Fee + Output */}
      {numericAmount !== null && (
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            Fee ({FEE_PERCENT}%): {fee.toFixed(4)}
          </div>
          <div>You receive: {netAmount.toFixed(4)}</div>
        </div>
      )}

      {/* Error */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Button */}
      <button
        onClick={handleBuy}
        disabled={isDisabled}
        className={`w-full p-2 rounded text-white ${
          isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Buy"}
      </button>

      {/* Network Messages */}
      {!chain && (
        <div className="text-yellow-500 text-sm">Connect your wallet</div>
      )}

      {chain && chain.id && !isSupportedChain(chain.id) && (
        <div className="text-yellow-500 text-sm">Unsupported network</div>
      )}
    </div>
  );
}

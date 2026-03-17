"use client";

import { useState } from "react";
import { BASE_COIN_ADDRESS } from "@/utils/addresses";
import { useDjedTransactions, getDjedContract } from "@/hooks/useDjedTransactions";
import { useAccount, usePublicClient } from "wagmi";
import { parseUnits } from "viem";

export default function BuyStableCoin() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const feeRate = 0.003;
  const fee = amount ? Number(amount) * feeRate : 0;
  const receiveAmount = amount ? Number(amount) - fee : 0;

  const { approveBaseToken, buyStableCoin } = useDjedTransactions();

  const handleBuy = async () => {
    if (!amount) {
      alert("Enter an amount");
      return;
    }

    try {
      if (!isConnected || !address) {
        alert("Connect your wallet first");
        return;
      }

      if (!publicClient) {
        throw new Error("Public client not available");
      }

      setLoading(true);

      const parsedAmount = parseUnits(amount, 18);

      // 🔥 FIX: get contract safely
      const djedContract = getDjedContract();

      // Step 1: Approve
      setStatus("Approving BaseCoin...");
      const approveTx = await approveBaseToken(
        BASE_COIN_ADDRESS,
        djedContract,
        parsedAmount,
      );

      await publicClient.waitForTransactionReceipt({
        hash: approveTx,
      });

      // Step 2: Buy
      setStatus("Executing buy transaction...");
      const buyTx = await buyStableCoin(parsedAmount, address);

      await publicClient.waitForTransactionReceipt({
        hash: buyTx,
      });

      // Step 3: Done
      setStatus("Transaction confirmed!");
      setAmount("");

    } catch (error) {
      console.error("Transaction failed:", error);
      setStatus("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-surface">
      <h2 className="text-xl font-bold mb-4">Buy StableCoin</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      />

      {amount && (
        <div className="text-sm text-secondary mb-4 space-y-1">
          <p>Protocol Fee: {fee.toFixed(4)}</p>
          <p>You Receive: {receiveAmount.toFixed(4)} StableCoin</p>
        </div>
      )}

      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        {loading ? "Processing..." : "Buy StableCoin"}
      </button>

      {status && <p className="text-sm mt-3 text-secondary">{status}</p>}
    </div>
  );
}
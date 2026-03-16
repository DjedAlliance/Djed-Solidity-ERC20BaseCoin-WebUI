"use client";

import { useState } from "react";
import { useDjedTransactions } from "@/hooks/useDjedTransactions";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
export default function SellStableCoin() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { address, isConnected } = useAccount();

  const feeRate = 0.003;
  const fee = amount ? Number(amount) * feeRate : 0;
  const receiveAmount = amount ? Number(amount) - fee : 0;

  const { sellStableCoin } = useDjedTransactions();

  const handleSell = async () => {
    if (!amount) {
      alert("Enter an amount");
      return;
    }
    if (!isConnected || !address) {
      alert("Connect your wallet first");
      return;
    }
    try {
      setLoading(true);
      setStatus("Executing sell transaction...");

      const parsedAmount = parseUnits(amount, 18);

      await sellStableCoin(parsedAmount, address);

      setStatus("Transaction confirmed!");

      setAmount("");
    } catch (error) {
      console.error("Sell transaction failed:", error);
      setStatus("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-surface">
      <h2 className="text-xl font-bold mb-4">Sell StableCoin</h2>

      {/* Amount Input */}
      <input
        type="number"
        placeholder="Enter StableCoin amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      />

      {/* Fee Estimate */}
      {amount && (
        <div className="text-sm text-secondary mb-4 space-y-1">
          <p>Protocol Fee: {fee.toFixed(4)}</p>
          <p>You Receive: {receiveAmount.toFixed(4)} BaseCoin</p>
        </div>
      )}

      {/* Sell Button */}
      <button
        onClick={handleSell}
        disabled={loading}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        {loading ? "Processing..." : "Sell StableCoin"}
      </button>
      {status && <p className="text-sm mt-3 text-secondary">{status}</p>}
    </div>
  );
}

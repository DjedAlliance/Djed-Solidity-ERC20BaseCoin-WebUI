"use client";

import { useState } from "react";
import { useDjedTransactions } from "@/hooks/useDjedTransactions";

export default function BuyStableCoin() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

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

    setLoading(true);

    const parsedAmount = BigInt(amount);

    // Step 1
    setStatus(" Approving BaseCoin...");
    await approveBaseToken(parsedAmount);

    // Step 2
    setStatus(" Executing buy transaction...");
    await buyStableCoin(parsedAmount);

    // Step 3
    setStatus(" Transaction confirmed!");

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

      {/* Amount Input */}
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      />

      {/* Fee Calculation */}
      {amount && (
        <div className="text-sm text-secondary mb-4 space-y-1">
          <p>Protocol Fee: {fee.toFixed(4)}</p>
          <p>You Receive: {receiveAmount.toFixed(4)} StableCoin</p>
        </div>
      )}

      {/* Buy Button */}
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

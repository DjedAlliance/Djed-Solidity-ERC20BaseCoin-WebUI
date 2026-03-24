"use client";

import { useWriteContract } from "wagmi";
import djedAbi from "@/utils/abi/Djed.json";

// 🔐 Safe env access (no crash at build time)
const DJED_CONTRACT_RAW = process.env.NEXT_PUBLIC_DJED_CONTRACT;

// ✅ Safe getter (runtime validation only)
export const getDjedContract = (): `0x${string}` => {
  if (!DJED_CONTRACT_RAW || !DJED_CONTRACT_RAW.startsWith("0x")) {
    throw new Error(
      "NEXT_PUBLIC_DJED_CONTRACT is not set or invalid. Please check your .env"
    );
  }

  return DJED_CONTRACT_RAW as `0x${string}`;
};

export function useDjedTransactions() {
  const { writeContractAsync } = useWriteContract();

  // ✅ Approve BaseCoin
  const approveBaseToken = async (
    tokenAddress: `0x${string}`,
    spender: `0x${string}`,
    amount: bigint,
  ) => {
    return writeContractAsync({
      address: tokenAddress,
      abi: [
        {
          type: "function",
          name: "approve",
          stateMutability: "nonpayable",
          inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          outputs: [{ name: "", type: "bool" }],
        },
      ],
      functionName: "approve",
      args: [spender, amount],
    });
  };

  // ✅ Buy StableCoins
  const buyStableCoin = async (
    amount: bigint,
    receiver: `0x${string}`,
    feeUI: bigint = 0n,
    ui: `0x${string}` = "0x0000000000000000000000000000000000000000",
  ) => {
    const djedContract = getDjedContract(); // 🔥 FIXED

    return writeContractAsync({
      address: djedContract,
      abi: djedAbi,
      functionName: "buyStableCoins",
      args: [receiver, feeUI, ui, amount],
    });
  };

  // ✅ Sell StableCoins
  const sellStableCoin = async (
    amount: bigint,
    receiver: `0x${string}`,
    feeUI: bigint = 0n,
    ui: `0x${string}` = "0x0000000000000000000000000000000000000000",
  ) => {
    const djedContract = getDjedContract(); // 🔥 FIXED

    return writeContractAsync({
      address: djedContract,
      abi: djedAbi,
      functionName: "sellStableCoins",
      args: [amount, receiver, feeUI, ui],
    });
  };

  return {
    approveBaseToken,
    buyStableCoin,
    sellStableCoin,
  };
}
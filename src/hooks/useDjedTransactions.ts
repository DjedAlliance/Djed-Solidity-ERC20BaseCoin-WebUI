"use client";

import { useWriteContract } from "wagmi";
import djedAbi from "@/utils/abi/Djed.json";
import { DJED_ADDRESS } from "@/utils/addresses";

export function useDjedTransactions() {

  const { writeContractAsync } = useWriteContract();

  const DJED_CONTRACT = DJED_ADDRESS as `0x${string}`;

  // Approve BaseCoin (used before buying stablecoins)
  const approveBaseToken = async (
    tokenAddress: `0x${string}`,
    spender: `0x${string}`,
    amount: bigint
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
            { name: "amount", type: "uint256" }
          ],
          outputs: [{ name: "", type: "bool" }]
        }
      ],
      functionName: "approve",
      args: [spender, amount],
    });
  };

  // Buy StableCoins
  const buyStableCoin = async (
    amount: bigint,
    receiver: `0x${string}`,
    feeUI: bigint = 0n,
    ui: `0x${string}` = "0x0000000000000000000000000000000000000000"
  ) => {

    return writeContractAsync({
      address: DJED_CONTRACT,
      abi: djedAbi,
      functionName: "buyStableCoins",
      args: [receiver, feeUI, ui, amount],
    });

  };

  // Sell StableCoins
  const sellStableCoin = async (
    amount: bigint,
    receiver: `0x${string}`,
    feeUI: bigint = 0n,
    ui: `0x${string}` = "0x0000000000000000000000000000000000000000"
  ) => {

    return writeContractAsync({
      address: DJED_CONTRACT,
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
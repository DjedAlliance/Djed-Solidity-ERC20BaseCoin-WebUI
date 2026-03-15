"use client";

import { useWriteContract } from "wagmi";
import { erc20Abi } from "viem";
import djedAbi from "@/utils/abi/Djed.json";

const DJED_CONTRACT = "0xYourDjedContractAddress";
const BASE_TOKEN = "0xYourBaseTokenAddress";

export function useDjedTransactions() {

  const { writeContract } = useWriteContract();

  // Step 1: Approve ERC20 token
  const approveBaseToken = async (amount: bigint) => {
    return writeContract({
      address: BASE_TOKEN as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [DJED_CONTRACT, amount],
    });
  };

  // Step 2: Buy StableCoin
  const buyStableCoin = async (amount: bigint) => {
    return writeContract({
      address: DJED_CONTRACT as `0x${string}`,
      abi: djedAbi,
      functionName: "buyStableCoin",
      args: [amount],
    });
  };

  // Step 3: Sell StableCoin
  const sellStableCoin = async (amount: bigint) => {
    return writeContract({
      address: DJED_CONTRACT as `0x${string}`,
      abi: djedAbi,
      functionName: "sellStableCoin",
      args: [amount],
    });
  };

  return {
    approveBaseToken,
    buyStableCoin,
    sellStableCoin,
  };
}
import { useChainId } from "wagmi";
import { getContractAddresses, type ChainId } from "@/utils/addresses";

export function useDjedContracts() {
  const chainId = useChainId();

  try {
    return getContractAddresses(chainId as ChainId);
  } catch {
    return null;
  }
}
import { useChainId } from 'wagmi';
import { getContractAddresses } from '@/utils/addresses';

export function useDjedContracts() {
  const chainId = useChainId();
  return getContractAddresses(chainId);
}
const contracts = useDjedContracts();
if (!contracts) return <UnsupportedNetwork />;
import { NetworkConfig } from '@snapshot-labs/sx';
import { RpcProvider } from 'starknet';

export const NETWORKS = new Map<string, NetworkConfig>();

const clientsMap = new Map<
  string,
  {
    provider: RpcProvider;
  }
>();

export function getClient(chainId: string) {
  const cached = clientsMap.get(chainId);
  if (cached) return cached;

  throw new Error('No networks configured');
}

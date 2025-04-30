import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import { ChainId } from '@/types';
import { getProvider } from './provider';

export function getGenericExplorerUrl(
  chainId: ChainId,
  address: string,
  type: 'address' | 'token' | 'transaction'
) {
  const isEvmNetwork = typeof chainId === 'number';

    let mappedType = 'tx';
    if (type === 'address') {
      mappedType = 'address';
    } else if (type === 'token') {
      mappedType = 'token';
    }

    return `${networks[chainId].explorer.url}/${mappedType}/${address}`;
}

export function waitForTransaction(txId: string, chainId: ChainId) {
    const provider = getProvider(Number(chainId));
    return provider.waitForTransaction(txId);

}

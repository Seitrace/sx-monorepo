import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import { UNIFIED_API_TESTNET_URL, UNIFIED_API_URL } from '@/helpers/constants';
import { pinGraph, pinPineapple } from '@/helpers/pin';
import { getProvider } from '@/helpers/provider';
import { Network } from '@/networks/types';
import { NetworkID, Space } from '@/types';
import { createActions } from './actions';
import { createConstants } from './constants';
import { EVM_CONNECTORS } from '../common/constants';
import { createApi } from '../common/graphqlApi';

type Metadata = {
  name: string;
  ticker?: string;
  chainId: number;
  currentChainId?: number;
  apiUrl: string;
  avatar: string;
  blockTime: number;
};

// shared for both ETH mainnet and ARB1
const ETH_MAINNET_BLOCK_TIME = 12.09;

export const METADATA: Record<string, Metadata> = {
  sei: {
    name: 'Sei',
    ticker: 'SEI',
    chainId: 1329,
    apiUrl: UNIFIED_API_URL,
    avatar:
      'ipfs://bafkreihcx4zkpfjfcs6fazjp6lcyes4pdhqx3uvnjuo5uj2dlsjopxv5am',
    blockTime: 2.15812
  }
};

export function createEvmNetwork(networkId: NetworkID): Network {
  const { name, chainId, currentChainId, apiUrl, avatar } = METADATA[networkId];

  const pin = pinGraph;

  const provider = getProvider(chainId);
  const constants = createConstants(networkId, { pin });
  const api = createApi(apiUrl, networkId, constants, {
    // NOTE: Highlight is currently disabled
    // highlightApiUrl: import.meta.env.VITE_HIGHLIGHT_URL
  });

  const helpers = {
    isAuthenticatorSupported: (authenticator: string) =>
      constants.SUPPORTED_AUTHENTICATORS[authenticator],
    isAuthenticatorContractSupported: (authenticator: string) =>
      constants.CONTRACT_SUPPORTED_AUTHENTICATORS[authenticator],
    getRelayerAuthenticatorType: (authenticator: string) =>
      constants.RELAYER_AUTHENTICATORS[authenticator],
    isStrategySupported: (strategy: string) =>
      constants.SUPPORTED_STRATEGIES[strategy],
    isExecutorSupported: (executorType: string) =>
      executorType !== 'ReadOnlyExecution',
    isExecutorActionsSupported: (executorType: string) =>
      constants.SUPPORTED_EXECUTORS[executorType],
    pin,
    getSpaceController: async (space: Space) => space.controller,
    getTransaction: (txId: string) => provider.getTransaction(txId),
    waitForTransaction: (txId: string) => provider.waitForTransaction(txId),
    waitForSpace: (spaceAddress: string, interval = 5000): Promise<Space> =>
      new Promise(resolve => {
        const timer = setInterval(async () => {
          const space = await api.loadSpace(spaceAddress);
          if (space) {
            clearInterval(timer);
            resolve(space);
          }
        }, interval);
      }),
    getExplorerUrl: (id, type) => {
      let dataType: 'tx' | 'address' | 'token' = 'tx';
      if (type === 'token') dataType = 'token';
      else if (['address', 'contract', 'strategy'].includes(type))
        dataType = 'address';

      return `${networks[chainId].explorer.url}/${dataType}/${id}`;
    }
  };

  return {
    name,
    avatar,
    currentUnit: 'block',
    chainId,
    baseChainId: chainId,
    currentChainId: currentChainId ?? chainId,
    supportsSimulation: [
      'eth',
      'sep',
      'oeth',
      'matic',
      'base',
      'mnt',
      'arb1',
      'ape',
      'curtis'
    ].includes(networkId),
    managerConnectors: EVM_CONNECTORS,
    actions: createActions(provider, helpers, chainId),
    api,
    constants,
    helpers
  };
}

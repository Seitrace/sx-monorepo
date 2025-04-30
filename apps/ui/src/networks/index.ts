import { NetworkID } from '@/types';
import { createEvmNetwork } from './evm';
import { ExplorePageProtocol, ProtocolConfig, ReadWriteNetwork } from './types';

const seiNetwork = createEvmNetwork('sei');

export const enabledNetworks: NetworkID[] = import.meta.env
  .VITE_ENABLED_NETWORKS
  ? (import.meta.env.VITE_ENABLED_NETWORKS.split(',') as NetworkID[])
  : [
      'sei'
    ];

export const evmNetworks: NetworkID[] = [
  'sei',
];
export const offchainNetworks: NetworkID[] = ['sei'];
// This network is used for aliases/follows/profiles/explore page.
export const metadataNetwork: NetworkID =
  import.meta.env.VITE_METADATA_NETWORK || 'sei';

export const getNetwork = (id: NetworkID) => {
  if (!enabledNetworks.includes(id))
    throw new Error(`Network ${id} is not enabled`);

  if (id === 'sei') return seiNetwork;
  throw new Error(`Unknown network ${id}`);
};

export const getReadWriteNetwork = (id: NetworkID): ReadWriteNetwork => {
  const network = getNetwork(id);
  if (network.readOnly) throw new Error(`Network ${id} is read-only`);

  return network;
};

export const enabledReadWriteNetworks: NetworkID[] = enabledNetworks.filter(
  id => !getNetwork(id).readOnly
);

/**
 * supportsNullCurrent return true if the network supports null current to be used for computing current voting power
 * @param networkId Network ID
 * @returns boolean true if the network supports null current
 */
export const supportsNullCurrent = (networkID: NetworkID) => {
  return !evmNetworks.includes(networkID);
};

export const explorePageProtocols: Record<ExplorePageProtocol, ProtocolConfig> =
  {
    snapshot: {
      key: 'snapshot',
      label: 'Snapshot',
      apiNetwork: metadataNetwork,
      networks: [metadataNetwork],
      limit: 18
    },
    'snapshot-x': {
      key: 'snapshot-x',
      label: 'Snapshot X',
      apiNetwork:
        enabledNetworks.find(network => !offchainNetworks.includes(network)) ||
        'sei',
      networks: enabledNetworks.filter(
        network => !offchainNetworks.includes(network)
      ),
      limit: 18
    }
  };

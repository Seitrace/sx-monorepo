import { CheckpointConfig } from '@snapshot-labs/checkpoint';
import { evmNetworks } from '@snapshot-labs/sx';
import AxiomExecutionStrategy from './abis/AxiomExecutionStrategy.json';
import ProxyFactory from './abis/ProxyFactory.json';
import SimpleQuorumTimelockExecutionStrategy from './abis/SimpleQuorumTimelockExecutionStrategy.json';
import Space from './abis/Space.json';

type NetworkID = 'sei';

const START_BLOCKS: Record<NetworkID, number> = {
  sei: 1329
};

const RPC_URLS: Record<NetworkID, string> = {
  sei: 'https://snowy-solitary-patron.sei-pacific.quiknode.pro/b85f33628bfb46d8a184419284f47270a24b4488/'
};

export type FullConfig = {
  indexerName: NetworkID;
  chainId: number;
  overrides: {
    masterSpace: string;
    masterSimpleQuorumAvatar: string;
    masterSimpleQuorumTimelock: string;
    masterAxiom: string | null;
    propositionPowerValidationStrategyAddress: string;
  };
} & CheckpointConfig;

export function createConfig(indexerName: NetworkID): FullConfig {
  const network = evmNetworks[indexerName];

  const sources = [
    {
      contract: network.Meta.proxyFactory,
      start: START_BLOCKS[indexerName],
      abi: 'ProxyFactory',
      events: [
        {
          name: 'ProxyDeployed(address,address)',
          fn: 'handleProxyDeployed'
        }
      ]
    }
  ];

  return {
    indexerName,
    chainId: network.Meta.eip712ChainId,
    overrides: {
      masterSpace: network.Meta.masterSpace,
      masterSimpleQuorumAvatar: network.ExecutionStrategies.SimpleQuorumAvatar,
      masterSimpleQuorumTimelock:
        network.ExecutionStrategies.SimpleQuorumTimelock,
      masterAxiom: network.ExecutionStrategies.Axiom,
      propositionPowerValidationStrategyAddress:
        network.ProposalValidations.VotingPower
    },
    network_node_url: RPC_URLS[indexerName],
    sources,
    templates: {
      Space: {
        abi: 'Space',
        events: [
          {
            name: 'SpaceCreated(address,(address,uint32,uint32,uint32,(address,bytes),string,string,string,(address,bytes)[],string[],address[]))',
            fn: 'handleSpaceCreated'
          },
          {
            name: 'MetadataURIUpdated(string)',
            fn: 'handleMetadataUriUpdated'
          },
          {
            name: 'MinVotingDurationUpdated(uint32)',
            fn: 'handleMinVotingDurationUpdated'
          },
          {
            name: 'MaxVotingDurationUpdated(uint32)',
            fn: 'handleMaxVotingDurationUpdated'
          },
          {
            name: 'VotingDelayUpdated(uint32)',
            fn: 'handleVotingDelayUpdated'
          },
          {
            name: 'OwnershipTransferred(address,address)',
            fn: 'handleOwnershipTransferred'
          },
          {
            name: 'AuthenticatorsAdded(address[])',
            fn: 'handleAuthenticatorsAdded'
          },
          {
            name: 'AuthenticatorsRemoved(address[])',
            fn: 'handleAuthenticatorsRemoved'
          },
          {
            name: 'VotingStrategiesAdded((address,bytes)[],string[])',
            fn: 'handleVotingStrategiesAdded'
          },
          {
            name: 'VotingStrategiesRemoved(uint8[])',
            fn: 'handleVotingStrategiesRemoved'
          },
          {
            name: 'ProposalValidationStrategyUpdated((address,bytes),string)',
            fn: 'handleProposalValidationStrategyUpdated'
          },
          {
            name: 'ProposalCreated(uint256,address,(address,uint32,address,uint32,uint32,uint8,bytes32,uint256),string,bytes)',
            fn: 'handleProposalCreated'
          },
          {
            name: 'ProposalCancelled(uint256)',
            fn: 'handleProposalCancelled'
          },
          {
            name: 'ProposalUpdated(uint256,(address,bytes),string)',
            fn: 'handleProposalUpdated'
          },
          {
            name: 'ProposalExecuted(uint256)',
            fn: 'handleProposalExecuted'
          },
          {
            name: 'VoteCast(uint256,address,uint8,uint256)',
            fn: 'handleVoteCast'
          },
          {
            name: 'VoteCastWithMetadata(uint256,address,uint8,uint256,string)',
            fn: 'handleVoteCast'
          }
        ]
      },
      SimpleQuorumTimelockExecutionStrategy: {
        abi: 'SimpleQuorumTimelockExecutionStrategy',
        events: [
          {
            name: 'ProposalExecuted(bytes32)',
            fn: 'handleTimelockProposalExecuted'
          },
          {
            name: 'ProposalVetoed(bytes32)',
            fn: 'handleTimelockProposalVetoed'
          }
        ]
      },
      AxiomExecutionStrategy: {
        abi: 'AxiomExecutionStrategy',
        events: [
          {
            name: 'WriteOffchainVotes(uint256,uint256,uint256,uint256,uint256)',
            fn: 'handleAxiomWriteOffchainVotes'
          }
        ]
      }
    },
    abis: {
      ProxyFactory,
      Space,
      SimpleQuorumTimelockExecutionStrategy,
      AxiomExecutionStrategy
    }
  };
}

import { CheckpointConfig } from '@snapshot-labs/checkpoint';

export type FullConfig = {
  indexerName: string;
  overrides: Record<string, any>;
} & CheckpointConfig;

export function createConfig(_indexerName: string): FullConfig {
  return {
    indexerName: '',
    overrides: {},
    network_node_url: '',
    optimistic_indexing: true,
    sources: [],
    templates: {},
    abis: {}
  };
}

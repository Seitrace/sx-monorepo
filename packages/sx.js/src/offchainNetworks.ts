import { OffchainNetworkConfig } from './types';

function createStandardConfig(
  eip712ChainId: OffchainNetworkConfig['eip712ChainId']
) {
  return {
    eip712ChainId
  };
}

export const offchainSei : OffchainNetworkConfig = createStandardConfig(1317);
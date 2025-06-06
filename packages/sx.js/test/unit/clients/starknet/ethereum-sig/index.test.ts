import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { EthereumSig } from '../../../../../src/clients/starknet/ethereum-sig';
import { starknetNetworks, starknetSepolia } from '../../../../../src/networks';
import { starkProvider } from '../../../helpers';

describe('EthereumSig', () => {
  const provider = new JsonRpcProvider('https://rpc.brovider.xyz/5');
  const signer = new Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    provider
  );

  const client = new EthereumSig({
    starkProvider,
    networkConfig: starknetSepolia,
    ethUrl: 'https://rpc.brovider.xyz/5',
    whitelistServerUrl: 'https://wls.snapshot.box'
  });

  beforeAll(() => {
    vi.spyOn(client, 'generateSalt').mockImplementation(() => '0x0');
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const { EthSig } = starknetNetworks['sn-sep'].Authenticators;
  const { MerkleWhitelist } = starknetNetworks['sn-sep'].Strategies;

  it('should create propose envelope', async () => {
    const envelope = await client.propose({
      signer,
      data: {
        space:
          '0x06330d3e48f59f5411c201ee2e9e9ccdc738fb3bb192b0e77e4eda26fa1a22f8',
        authenticator: EthSig,
        strategies: [
          {
            address: MerkleWhitelist,
            index: 0,
            params: '0x'
          }
        ],
        executionStrategy: {
          addr: '0x040de235a2b53e921d37c2ea2b160750ca2e94f01d709f78f870963559de8fbe',
          params: ['0x101']
        },
        metadataUri: 'ipfs://QmNrm6xKuib1THtWkiN5CKtBEerQCDpUtmgDqiaU2xDmca'
      }
    });

    expect(envelope).toMatchSnapshot();
  });

  it('should create update proposal envelope', async () => {
    const envelope = await client.updateProposal({
      signer,
      data: {
        space:
          '0x06330d3e48f59f5411c201ee2e9e9ccdc738fb3bb192b0e77e4eda26fa1a22f8',
        authenticator: EthSig,
        executionStrategy: {
          addr: '0x040de235a2b53e921d37c2ea2b160750ca2e94f01d709f78f870963559de8fbe',
          params: ['0x101']
        },
        proposal: 1,
        metadataUri: 'ipfs://QmNrm6xKuib1THtWkiN5CKtBEerQCDpUtmgDqiaU2xDmca'
      }
    });

    expect(envelope).toMatchSnapshot();
  });

  it('should create vote envelope', async () => {
    const envelope = await client.vote({
      signer,
      data: {
        space:
          '0x06330d3e48f59f5411c201ee2e9e9ccdc738fb3bb192b0e77e4eda26fa1a22f8',
        authenticator: EthSig,
        strategies: [
          {
            address: MerkleWhitelist,
            index: 0,
            params: '0x'
          }
        ],
        metadataUri: 'ipfs://QmNrm6xKuib1THtWkiN5CKtBEerQCDpUtmgDqiaU2xDmca',
        proposal: 1,
        choice: 1
      }
    });

    expect(envelope).toMatchSnapshot();
  });
});

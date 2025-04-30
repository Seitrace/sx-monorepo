import Checkpoint, { evm } from '@snapshot-labs/checkpoint';
import { createConfig } from './config';
import { createWriters } from './writers';
import { registerIndexer } from '../register';

const seiConfig = createConfig('sei');
const seiIndexer = new evm.EvmIndexer(createWriters(seiConfig));

export function addEvmIndexers(checkpoint: Checkpoint) {
  registerIndexer(checkpoint, seiConfig.indexerName, seiConfig, seiIndexer);
}

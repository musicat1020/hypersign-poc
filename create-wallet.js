import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import pkg from '@cosmjs/crypto';
const { HdPath, Slip10RawIndex } = pkg;

export const mnemonic = 'ill region diamond defy put toss common grant adjust vote appear mesh double scale question ability eight crucial flash treat filter alone guide peanut';//pyramid

export const hidNodeEp = {
  rpc: 'https://rpc.jagrat.hypersign.id',
  rest: 'https://api.jagrat.hypersign.id',
  namespace: 'testnet',
};

export function makeCosmoshubPath(a) {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(118),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(a),
  ];
}

export const createWallet = async (mnemonic) => {
  let options;
  if (!mnemonic) {
    return await DirectSecp256k1HdWallet.generate(
      24,
      (options = {
        prefix: 'hid',
        hdPaths: [makeCosmoshubPath(0)],
      })
    );
  } else {
    return await DirectSecp256k1HdWallet.fromMnemonic(
      mnemonic,
      (options = {
        prefix: 'hid',
        hdPaths: [makeCosmoshubPath(0)],
      })
    );
  }
};

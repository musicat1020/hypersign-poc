import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    nodeRpcEndpoint: "https://rpc.jagrat.hypersign.id",
    nodeRestEndpoint: "https://api.jagrat.hypersign.id",
    namespace: 'testnet'
};

export const MNEMONIC = process.env.MNEMONIC
export const API_SECRET_KEY = process.env.API_SECRET_KEY

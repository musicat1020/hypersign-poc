// Import SSI SDK
import { HypersignSSISdk } from "hs-ssi-sdk";
import { ENV } from "../config.js";
import axios from "axios";
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import pkg from '@cosmjs/crypto';
const { HdPath, Slip10RawIndex } = pkg;
const MNEMONIC = process.env.MNEMONIC

const initializeHypersignSDK = async () => {
    const offlineSigner = await createWallet(MNEMONIC);
    const account = await offlineSigner.getAccounts()
    const walletAddress = account[0]['address']
    // Instantiate SSI SDK
    const hsSdk = new HypersignSSISdk(
        {
            ...ENV,
            offlineSigner: offlineSigner,
        }
    );
    // Mandatory method call to initialize offlineSigner
    await hsSdk.init();

    return { hsSdk, walletAddress };
}


const getBalance = async (address) => {
    const url = `${ENV.nodeRestEndpoint}/cosmos/bank/v1beta1/balances/${address}`;

    try {
        const response = await axios.get(url);
        const balances = response.data.balances;

        // Find the balance object with 'denom' equal to 'uhid'
        const uhidBalance = balances.find(balance => balance.denom === 'uhid');

        if (uhidBalance) {
            // Return the 'uhid' balance amount
            return uhidBalance.amount;
        } else {
            return "0"; // Return 0 if 'uhid' balance not found
        }
    } catch (error) {
        console.log("error", error);
        return "0"; // Return 0 on error
    }
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

const createWallet = async (mnemonic) => {
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


export { initializeHypersignSDK, getBalance, createWallet }

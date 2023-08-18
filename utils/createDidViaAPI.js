import { HypersignSSISdk } from "hs-ssi-sdk";
import { createWallet } from "./account.js";
import { Bip39 } from "@cosmjs/crypto";
import axios from "axios";
import { getAccessToken } from "./getAccessToken.js";
import dotenv from 'dotenv';
dotenv.config()

const MNEMONIC = process.env.MNEMONIC || "napkin delay purchase easily camp mimic share wait stereo reflect allow soccer believe exhibit laptop upset tired talent transfer talk surface solution omit crack"
const token = await getAccessToken();

const initializeHypersignSDK = async () => {
    const offlineSigner = await createWallet(MNEMONIC);
    console.log("offlineSigner>>>", await offlineSigner.getAccounts());

    // Instantiate SSI SDK
    const hsSdk = new HypersignSSISdk(
        {
            offlineSigner: offlineSigner,
            namespace: 'testnet',
            nodeRpcEndpoint: "https://rpc.jagrat.hypersign.id",  // RPC
            nodeRestEndpoint: "https://api.jagrat.hypersign.id"   // REST Endpoint
        }
    );
    // Mandatory method call to initialize offlineSigner
    await hsSdk.init();

    return hsSdk;
}


const generateDID = async (hsSdk) => {
    const hypersignDID = hsSdk.did;
    const seed = Bip39.decode(MNEMONIC);
    const kp = await hypersignDID.generateKeys({ seed });
    const publicKeyMultibase = kp.publicKeyMultibase;
    const url = 'https://api.entity.hypersign.id/api/v1/did/create';
    const headers = {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const data = {

        namespace: "testnet",
        options: {
            keyType: "Ed25519VerificationKey2020",
            chainId: "0x1",
            publicKey: publicKeyMultibase,
            verificationRelationships: [
                "assertionMethod",
                "authentication",
                "capabilityInvocation",
                "capabilityDelegation"
            ]
        }
    };

    try {
        const response = await axios.post(url, data, { headers });
        // console.log('API response:', JSON.stringify(response.data, null, 2));
        // return response.data;
        return { kp, didDocument: response.data.metaData.didDocument };
    } catch (error) {
        console.error('API error:', error);
        throw error;
    }

};

const preRegisterDID = async (hsSdk, kp, didDocument) => {
    const hypersignDID = hsSdk.did;
    const privateKeyMultibase = kp.privateKeyMultibase;
    const verificationMethodId = didDocument.verificationMethod[0].id;
    const signature = await hypersignDID.register({ didDocument: didDocument, privateKeyMultibase, verificationMethodId })

    console.log("registerDID sign", signature)

    return signature;
}


const registerDID = async (didDocument, signature) => {
    const url = 'https://api.entity.hypersign.id/api/v1/did/register';

    const headers = {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const requestBody = {
        didDocument: didDocument,
        verificationMethodId: didDocument.verificationMethod[0].id,
        signInfos: [
            {
                verification_method_id: didDocument.verificationMethod[0].id,
                signature: signature,
                clientSpec: {
                    type: 'eth-personalSign',
                },
            },
        ],
    }

    return await axios.post(url, requestBody, { headers })
        .then(response => {
            console.log("registerDid response:", JSON.stringify(response.data));
            return response.data;
        }).catch(error => {
            console.error("did register error：", JSON.stringify(error, null, 2));
            return error;
        });
}




export const createDidViaAPI = async () => {
    const hsSdk = await initializeHypersignSDK();
    let { kp, didDocument } = await generateDID(hsSdk);

    // console.log("\n\nregisterDID did >>>")
    const signature = await preRegisterDID(hsSdk, kp, didDocument);
    const registerResult = await registerDID(didDocument, signature)
    return registerResult;
}


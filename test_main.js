// Import SSI SDK
import { HypersignSSISdk } from "hs-ssi-sdk";
import { createWallet, mnemonic } from "./create-wallet.js";
import { Bip39 } from "@cosmjs/crypto";
import axios from "axios";
import { ENV } from "./config.js";


const initializeHypersignSDK = async () => {
    const offlineSigner = await createWallet(mnemonic);
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
    const seed = Bip39.decode(mnemonic);
    const kp = await hypersignDID.generateKeys({ seed, controller: 'did:hid:testnet:controller' });
    const publicKeyMultibase = kp.publicKeyMultibase;

    const didDocument = await hypersignDID.generate({ publicKeyMultibase });

    return { kp, didDocument };
}


const registerDID = async (hsSdk, kp, didDocument) => {
    const hypersignDID = hsSdk.did;
    const privateKeyMultibase = kp.privateKeyMultibase;
    console.log("privateKeyMultibase", privateKeyMultibase)
    const verificationMethodId = didDocument.verificationMethod[0].id;
    console.log("verificationMethodId", verificationMethodId)

    console.log("didDocument", didDocument.toString())
    const result = await hypersignDID.register({ didDocument, privateKeyMultibase, verificationMethodId });

    return result;
}

const deactivateDid = async (hsSdk, kp, didDocument) => {
    const hypersignDID = hsSdk.did;
    const privateKeyMultibase = kp.privateKeyMultibase;
    const verificationMethodId = didDocument.verificationMethod[0].id;
    const versionId = "7F36D0A3364601ADB795B2FAD2A6B8B26F04E6AF74FD6B4DA7FA26A8C60EDF42";

    const result = await hypersignDID.deactivate({
        didDocument,
        privateKeyMultibase,
        verificationMethodId,
        versionId,  // VersionId when DID is registered on chain. See the didDocumentMetadata when DID resolves
    });
    return result;
}

const signDID = async (hsSdk, kp, didDocument) => {
    const hypersignDID = hsSdk.did;
    const params = {
        publicKeyMultibase: kp.publicKeyMultibase,
        privateKeyMultibase: kp.privateKeyMultibase,
        challenge: '1231231231',
        domain: 'www.hypersign.id',
        did: '',
        didDocument: didDocument,
        verificationMethodId: didDocument.verificationMethod[0].id,
    };

    const signedDocument = await hypersignDID.sign(params);

    return signedDocument;
}

const resolveDID = async (hsSdk, did) => {
    const hypersignDID = hsSdk.did;
    const result = await hypersignDID.resolve({ did });
    return result;
}

const verifyDID = async (hsSdk, signedDocument) => {
    const hypersignDID = hsSdk.did;
    const result = await hypersignDID.verify({
        didDocument: signedDocument,
        verificationMethodId: signedDocument.verificationMethod[0].id,
        challenge: '1231231231',
        domain: 'www.hypersign.id',
    });

    return result;
}


const getBalance = async (address) => {
    const url = `${ENV.nodeRestEndpoint}/cosmos/bank/v1beta1/balances/${address}`;
    const response = await axios.get(url);
    return response.data;
}

const verifyCredential = async (hsSdk, credentialDocument) => {
    const hypersignVC = hsSdk.vc;
    const params = {
        credential: credentialDocument,
        issuerDid: credentialDocument.issuer,
        verificationMethodId: credentialDocument.proof.verificationMethod,
    };
    const verificationResult = await hypersignVC.verify(params);
    return verificationResult;
}

const main = async () => {
    const hsSdk = await initializeHypersignSDK(mnemonic);

    console.log("create did >>>")
    const { kp, didDocument } = await generateDID(hsSdk);
    console.log("didDocument>>", didDocument);

    // const address = "hid1fp77w46udgj7e40mv7m2vpk0wh4ry8gk0cmcjv"
    // console.log("balance", await getBalance(address))

    // const deactivateResult = await deactivateDid(hsSdk, kp, didDocument);
    // console.log("deactivateResult>>", deactivateResult);


    // const resolveResult = await resolveDID(hsSdk, didDocument.id);
    // console.log("resolveResult>>", resolveResult);


    console.log("\n\n registerDID did >>>")
    const registerResult = await registerDID(hsSdk, kp, didDocument);
    console.log("Register result>>", registerResult);

    // const verifyResult = await verifyDID(hsSdk, signedDocument);
    // console.log("verify result>>", verifyResult);
    // const res = await verifyCredential(hsSdk, testCred.credentialDocument)
    // console.log("verify vc result>>", JSON.stringify(res, null, 2));
}

main();

// Import SSI SDK
import { MNEMONIC } from "../config.js";
import { Bip39 } from "@cosmjs/crypto";

const generateDID = async (hsSdk) => {
    const hypersignDID = hsSdk.did;

    //--random generate--
    // const kp = await hypersignDID.generateKeys();

    //--specific generate--
    const seed = Bip39.decode(MNEMONIC);
    const kp = await hypersignDID.generateKeys({ seed });

    const publicKeyMultibase = kp.publicKeyMultibase;

    const didDocument = await hypersignDID.generate({ publicKeyMultibase });
    // console.log("didDocument", JSON.stringify(didDocument, null, 2))

    return { kp, didDocument };
}


const registerDID = async (hsSdk, kp, didDocument) => {
    const hypersignDID = hsSdk.did;
    const privateKeyMultibase = kp.privateKeyMultibase;
    const verificationMethodId = didDocument.verificationMethod[0].id;
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

export { generateDID, registerDID, deactivateDid, signDID, resolveDID, verifyDID }


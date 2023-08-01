import { HypersignDID } from "hs-ssi-sdk";
import { createWallet, mnemonic } from "./create-wallet";

// const namespace = 'testnet';
// const hypersignDID = new HypersignDID({ namespace });

const hypersignDID = new HypersignDID({
    // offlineSigner: await createWallet(mnemonic),                    // OPTIONAL signer of type OfflineSigner
    nodeRestEndpoint: 'https://api.jagrat.hypersign.id', // OPTIONAL RPC endpoint of the Hypersign blockchain, Default 'TEST'
    nodeRpcEndpoint: 'https://rpc.jagrat.hypersign.id',   // OPTIONAL REST endpoint of the Hypersign blockchain
    namespace: 'testnet',   // OPTIONAL namespace of did, Default ''
});


const generateDid = async (pubkey) => {
    const didDocument = await hypersignDID.generate({ publicKeyMultibase: pubkey });
    return didDocument;
}

const register = async (kp, didDocument) => {
    const privateKeyMultibase = kp.privateKeyMultibase;
    const verificationMethodId = didDocument.verificationMethod[0].id;

    const result = await hypersignDID.register({ didDocument, privateKeyMultibase, verificationMethodId });
    return result;
}

const sign = async (kp, didDocument) => {
    const params = {
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

const verify = async (signedDocument) => {
    const result = await hypersignDID.verify({
        didDocument: signedDocument,
        verificationMethodId: signedDocument.verificationMethod[0].id,
        challenge: '1231231231',
        domain: 'www.hypersign.id',
    });
    return result;
}

const resolve = async (did) => {
    const result = await hypersignDID.resolve({ did });
    return result;
}

const main = async () => {
    const offlineSigner = await createWallet(mnemonic);
    // console.log("offlineSigner>>>", offlineSigner);
    const pubkey = offlineSigner.getAccounts().then((result) => {
        console.log("\n\ngetAccounts>>>", result[0].pubkey);
        return result[0].pubkey;
    }).then((result) => {
        const didDocument = generateDid(pubkey);
    });
    console.log("pubkey>>>", pubkey);
    // console.log("\naccount>>>", account)
    const didDocument = await generateDid(pubkey);
    // console.log("\n\ndidDocument>>>", didDocument);
    register(offlineSigner, didDocument)
    const signedDocument = await sign(offlineSigner, didDocument);
    // console.log("\n\nsignedDocument>>>", signedDocument);

    //     verify(signedDocument).then((result) => { console.log("\n\nverify>>>", result) });
    //     resolve((didDocument as any).id).then((result) => { console.log("\n\nresolve>>>", result) });
    // 
}


main()




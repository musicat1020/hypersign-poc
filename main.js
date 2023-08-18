
import { initializeHypersignSDK, getBalance } from "./utils/account.js";
import { generateDID, registerDID, deactivateDid, signDID, resolveDID, verifyDID } from "./utils/did.js";
import { verifyCredential, createCredential, issueCredential } from "./utils/vc.js";
import { MNEMONIC } from "./config.js";
import { createDidViaAPI } from "./utils/createDidViaAPI.js";
import { generateSchema, registerSchema } from "./utils/schema.js";
import { generateVp, signVp, verifyVp } from "./utils/vp.js";

const main = async () => {
    const { hsSdk, walletAddress } = await initializeHypersignSDK(MNEMONIC);
    console.log("check balance:", await getBalance(walletAddress))

    //-----DID-----
    const { kp, didDocument } = await generateDID(hsSdk);
    const issuerDid = didDocument.id;
    const holderDid = "did:hid:testnet:zDtnQgxvoqNT2MPWnfRQSBRmys5fJAHRM8bZwN8adhoXS"
    const registerResult = await registerDID(hsSdk, kp, didDocument);
    console.log("\ndid register result:\n", registerResult);

    const signedDocument = await signDID(hsSdk, kp, didDocument);
    const verifyResult = await verifyDID(hsSdk, signedDocument);
    console.log("\nverify did result:\n", verifyResult);

    //-----Schema-----
    const schema = await generateSchema(hsSdk, issuerDid);
    const registerSchemaResult = await registerSchema(hsSdk, issuerDid, kp, schema);
    console.log("\nregister schema result\n", registerSchemaResult);


    //-----VC-----
    const schemaId = schema.id //"sch:hid:testnet:z6WAgd13gAsam2f5YzXDkQB5L2BzK9JJHcWM6N6Q6abL3:1.0"
    const credential = await createCredential(hsSdk, holderDid, issuerDid, schemaId);
    const credentialDetail = await issueCredential(hsSdk, credential, issuerDid, kp.privateKeyMultibase);
    const verifyVcRes = await verifyCredential(hsSdk, credentialDetail.signedCredential)
    console.log("\nverify vc result\n", JSON.stringify(verifyVcRes, null, 2));

    //-----VP-----
    const presentation = await generateVp(hsSdk, credential);
    const signedPresentation = await signVp(hsSdk, presentation, holderDid, issuerDid, kp);
    const verifyVpRes = await verifyVp(hsSdk, signedPresentation, holderDid, issuerDid);
    console.log("\nverify vp result\n", JSON.stringify(verifyVpRes, null, 2))
}

main();

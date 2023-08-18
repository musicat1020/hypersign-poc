
const createCredential = async (hsSdk, subjectDid, issuerDid, schemaId) => {
    const hypersignVC = hsSdk.vc;
    const params = {
        schemaId: schemaId,
        subjectDid: subjectDid,
        issuerDid: issuerDid,
        expirationDate: "2027-12-10T18:30:00.000Z",
        fields: {
            name: "test name",
            email: "test email"
        }

    };
    const createResult = await hypersignVC.generate(params);
    return createResult;
}


const issueCredential = async (hsSdk, vc, issuerDid, pk) => {
    const hypersignVC = hsSdk.vc;
    const params = {
        credential: vc,
        issuerDid: issuerDid,
        verificationMethodId: issuerDid + "#key-1",
        privateKeyMultibase: pk
    };
    const issueResult = await hypersignVC.issue(params);
    return issueResult;
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


export { createCredential, issueCredential, verifyCredential };
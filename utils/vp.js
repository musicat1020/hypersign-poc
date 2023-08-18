export const generateVp = async (hsSdk, vc) => {
    const hypersignVP = hsSdk.vp;
    return await hypersignVP.generate(vc);
}

export const signVp = async (hsSdk, vp, holderDid, issuerDid, kp) => {

    const hypersignVP = hsSdk.vp;
    const params = {
        presentation: vp,
        holderDid: holderDid,
        verificationMethodId: holderDid + "#key-1",
        privateKeyMultibase: kp.privateKeyMultibase,
        challenge: "i am challenge"
    }
    return await hypersignVP.sign(params);
}

export const verifyVp = async (hsSdk, signedVp, holderDid, issuerDid) => {
    const hypersignVP = hsSdk.vp;
    const params = {
        signedPresentation: signedVp,
        challenge: "todo...",
        issuerDid: issuerDid,
        holderDid: holderDid,
        holderVerificationMethodId: holderDid + "#key-1",
        issuerVerificationMethodId: issuerDid + "#key-1",

    }

    return await hypersignVP.verify(params);
}
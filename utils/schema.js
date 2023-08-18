export const generateSchema = (hsSdk, did) => {
    const hypersignSchema = hsSdk.schema;
    const params = {
        name: "test schema",
        description: "test schema description",
        author: did,
        fields: [{
            type: "string",
            name: "name",
            isRequired: true
        },
        {
            type: "string",
            name: "email",
            isRequired: true
        }

        ]
    }

    return hypersignSchema.generate(params);
}


export const registerSchema = async (hsSdk, did, kp, schema) => {
    const hypersignSchema = hsSdk.schema;
    const params = {
        privateKeyMultibase: kp.privateKeyMultibase,
        schema: schema,
        verificationMethodId: `${did}#key-1`
    }

    const signedSchema = await hypersignSchema.sign(params);

    return hypersignSchema.register({ schema: signedSchema });
}
import axios from "axios";

export const getAccessToken = async () => {
    const url = 'https://api.entity.hypersign.id/api/v1/app/oauth';
    const headers = {
        'accept': 'application/json',
        'X-Api-Secret-Key': "1fae14d6e06b702c5b825e469fc2b.7e218298064c0cc5c00aedcfe73cb2c501b60cea1209245a471e4c53334c6dca457635a7884658350fe602aa21de03fbb"
    };

    try {
        const response = await axios.post(url, {}, { headers });
        return response.data.access_token;
    } catch (error) {
        console.error('Error occurred:', error.message);
    }
}
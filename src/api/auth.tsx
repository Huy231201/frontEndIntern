import axios from "axios";

const APILOGIN_URL = "https://api-dev.gotrust.vn/edupay/v1/accounts/login";

export const loginApi = async (account: string, password: string) => {
        const response = await axios.post(APILOGIN_URL, 
            {account, password},
            {
                headers: {
                    "accept": "text/plain",
                    "Content-Type": "application/json-patch+json",
                    "x-api-version": "1.0"
                }
            }
        );

        return response.data;
}


 
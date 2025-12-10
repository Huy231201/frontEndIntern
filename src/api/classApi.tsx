import axios from "axios"

const APICLASS_URL = "https://api-dev.gotrust.vn/edupay/v1/classes"

// Hàm lấy danh sách niên khóa 
export const getSchoolYearApi = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${APICLASS_URL}/schoolYears`,
            {
                headers: {
                    "accept": "text/plain",
                    "x-api-version": "1.0",
                    "Authorization": `Bearer ${token}`
                }     
            }

        );
        return response;
    } catch(err) {
        throw err
    }
}

// Hàm lấy danh sách lớp
export const getClassApi = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(APICLASS_URL,
            {
                headers: {
                    "accept": "text/plain",
                    "x-api-version": "1.0",
                    "Authorization": `Bearer ${token}`
                }     
            }

        );
        return response.data;
    } catch(err) {
        throw err
    }
}


 

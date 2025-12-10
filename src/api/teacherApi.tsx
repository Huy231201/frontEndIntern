import axios from "axios"

const APITEACHER_URL = "https://api-dev.gotrust.vn/edupay/v1/accounts/homeroomTeacherList"

// Hàm lấy danh sách giáo viên
export const getTeacherApi = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(APITEACHER_URL,
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


 

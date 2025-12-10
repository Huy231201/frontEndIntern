
import axios from "axios";

const APIGRADE_URL = "https://api-dev.gotrust.vn/edupay/v1/grades";

export const getGradeApi = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(APIGRADE_URL,
            {
                headers: {
                    "accept": "text/plain",
                    "x-api-version": "1.0",
                    "Authorization": `Bearer ${token}` // Dùng token động
                }
            }
        );

        return response.data;
    }

    catch (error) {
        throw error
    }
}


// Gọi API thêm khối
export const createGradeApi = async (name: string, code: string) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(APIGRADE_URL, {
            name, code
        },
            {
                headers: {
                    "accept": "text/plain",
                    "Content-Type": "application/json-patch+json",
                    "x-api-version": "1.0",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (err) {
        throw err
    }
}

// Gọi API xóa khối
export const deleteGradeApi = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.delete(
            `${APIGRADE_URL}/${id}`,
            {
                headers: {
                    "accept": "text/plain",
                    "x-api-version": "1.0",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (err) {
        throw err
    }
}

// Gọi API chỉnh sửa thông tin khối
export const updateGradeApi = async (id: string, name: string, code: string) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.put(
            `${APIGRADE_URL}/${id}`, {
            name, code
        }, {
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json-patch+json",
                "x-api-version": "1.0",
                "Authorization": `Bearer ${token}`
            }
        }
        );
        return response.data;
    } catch (err) {
        throw err
    }
}


import axiosClient from "../api/axiosClient"



export const getGradeApi = async () => {
    const response = await axiosClient.get("/grades");
    return response.data;
};


// Gọi API thêm khối
export const createGradeApi = async (name: string, code: string) => {


    const response = await axiosClient.post("/grades", {
        name, code
    });
    return response.data;
}

// Gọi API xóa khối
export const deleteGradeApi = async (id: string) => {
    const response = await axiosClient.delete(`/grades/${id}`);
    return response.data;
}

// Gọi API chỉnh sửa thông tin khối
export const updateGradeApi = async (id: string, name: string, code: string) => {
    const response = await axiosClient.put(`/grades/${id}`, {
        name, code
    });
    return response.data;

}

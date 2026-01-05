import axiosClient from "./axiosClient";

// Lấy danh sách học sinh
export const getStudentApi = async () => {
  const response = await axiosClient.get("/students");
  return response.data;
};

// Tạo học sinh
export const createStudentApi = async (
  code: string,
  name: string,
  parentName: string,
  parentPhoneNumber: string,
  dateOfBirth: string,
  feeReductionTypes: string[],
  classId: string
) => {
  const response = await axiosClient.post("/students", {
    code,
    name,
    parentName,
    parentPhoneNumber,
    dateOfBirth,
    feeReductionTypes,
    classId,
  });
  return response.data;
};


// Xóa từng học sinh
export const deleteOneStudentApi = async (id: string) => {
    const response = await axiosClient.delete(`/students/${id}`);
    return response.data;
}

// Xóa nhiều học sinh
export const deleteMultipleStudentsApi = async (studentIds: string[]) => {
    const response = await axiosClient.delete("/students/multiple",
        {
            data: {
                studentIds
            }
        }
    );
    return response.data;
}


// Chỉnh sửa thông tin học sinh
export const updateStudentApi = async (
    id: string,
    code: string,
    name: string,
    parentName: string,
    parentPhoneNumber: string,
    dateOfBirth: string,
    feeReductionTypes: string[],
    classId: string
) => {
    const response = await axiosClient.put(`/students/${id}`,
        {
            code,
            name,
            parentName,
            parentPhoneNumber,
            dateOfBirth,
            feeReductionTypes, 
            classId
        }
    );
    return response.data;
}

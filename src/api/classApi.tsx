import axiosClient from "./axiosClient";

// Lấy danh sách lớp
export const getClassApi = async () => {
  const response = await axiosClient.get("/classes");
  return response.data;
};

// Tạo lớp
export const createClassApi = async (
  code: string,
  name: string,
  schoolYear: string,
  homeroomTeacherId: string,
  gradeId: string
) => {
  const response = await axiosClient.post("/classes", {
    code,
    name,
    schoolYear,
    homeroomTeacherId,
    gradeId,
  });
  return response.data;
};

// Xóa lớp
export const deleteClassApi = async (id: string) => {
  const response = await axiosClient.delete(`/classes/${id}`);
  return response.data;
};

// Cập nhật lớp
export const updateClassApi = async (
  id: string,
  code: string,
  name: string,
  schoolYear: string,
  homeroomTeacherId: string,
  gradeId: string
) => {
  const response = await axiosClient.put(`/classes/${id}`, {
    code,
    name,
    schoolYear,
    homeroomTeacherId,
    gradeId,
  });
  return response.data;
};

import axiosClient from "./axiosClient";

// Lấy danh sách niên khóa
export const getSchoolYearApi = async () => {
  const response = await axiosClient.get("/classes/schoolYears");
  return response.data;
};

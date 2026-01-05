import { createContext, useContext, useState, useEffect } from "react";
import { getSchoolYearApi } from "../api/schoolYearApi";
import {useAuth} from "../context/authContext"

interface SchoolYearContextType {
  schoolYear: string[];
  setSchoolYear: React.Dispatch<React.SetStateAction<string[]>>;
  fetchSchoolYear: () => Promise<void>;
}

export const SchoolYearContext = createContext<SchoolYearContextType | null>(null);

export function SchoolYearProvider({ children }: { children: React.ReactNode }) {

  // State lưu danh sách niên khóa
  const [schoolYear, setSchoolYear] = useState<string[]>([]);
  
  const {token} = useAuth();

  // Hàm gọi API lấy niên khóa
  const fetchSchoolYear = async () => {
    try {
      const response = await getSchoolYearApi();

      // API trả về mảng string
      const yearList = response.data;

      console.log("Dữ liệu niên khóa: ", yearList);

      setSchoolYear(yearList);

    } catch (err) {
      console.error(err);
    }
  };

  // Gọi API khi mở website
  useEffect(() => {
    if (token) {
    fetchSchoolYear();
    }
  }, [token]);

  // Sync vào localStorage
  useEffect(() => {
    localStorage.setItem("schoolYear", JSON.stringify(schoolYear));
  }, [schoolYear]);

  return (
    <SchoolYearContext.Provider value={{ schoolYear, setSchoolYear, fetchSchoolYear }}>
      {children}
    </SchoolYearContext.Provider>
  );
}

export function useSchoolYear() {
  const ctx = useContext(SchoolYearContext);
  if (!ctx) throw new Error("useSchoolYear must be used inside <SchoolYearProvider>");
  return ctx;
}

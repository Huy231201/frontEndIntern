import { createContext, useContext, useState, useEffect } from "react";
import { getGradeApi } from "../api/gradeApi";

export interface GradeLevel {
  id: string;
  code: string;
  name: string;
  classCount: number;
  schoolId: string;
}

interface GradeContextType {
  grade: GradeLevel[];
  setGrade: React.Dispatch<React.SetStateAction<GradeLevel[]>>;
  fetchGrades: () => Promise<void>;   // <-- thêm hàm để load API
}

export const GradeContext = createContext<GradeContextType | null>(null);

export function GradeProvider({ children }: { children: React.ReactNode }) {

  // Load từ LocalStorage khi khởi tạo
  const [grade, setGrade] = useState<GradeLevel[]>([]);

  // Hàm gọi API load danh sách khối
  const fetchGrades = async () => {
    try {
      const response = await getGradeApi();
      const gradeList = response.data;

      console.log("Dữ liệu khối: ", gradeList);

      // Hiển thị bằng API
      setGrade(gradeList);

      // localStorage.setItem("grades", JSON.stringify(gradeList));
    } catch (err) {
      throw err
    }
  }

  // Gọi API ngay khi mở trang
  useEffect(() => {
    fetchGrades();
  }, []);


  // Nếu grade thay đổi do update thủ công => sync lại LocalStorage
  useEffect(() => {
    localStorage.setItem("grades", JSON.stringify(grade));
  }, [grade]);

  return (
    <GradeContext.Provider value={{ grade, setGrade, fetchGrades }}>
      {children}
    </GradeContext.Provider>
  );
}

export function useGrade() {
  const ctx = useContext(GradeContext);
  if (!ctx) throw new Error("useGrade must be used inside <GradeProvider>");
  return ctx;
}


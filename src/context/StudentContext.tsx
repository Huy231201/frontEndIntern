import {createContext, useContext, useEffect, useState} from "react";
import {getStudentApi} from "../api/studentApi"
import {useAuth} from "../context/authContext"

export interface Student {
  id: string;
  code: string;
  name: string;
  dateOfBirth: string;
  feeReductionTypes: string[];
  parentName: string;
  parentPhoneNumber: string;

  class: StudentClass;
}

export interface StudentClass {
  id: string;
  schoolYear: string;
  name: string;
  gradeId: string;
  school: StudentSchool
}

export interface StudentSchool {
  id: string;
  name: string;
}



interface StudentContextType {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    fetchStudents: () => Promise<void>;
}

export const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  
  const [students, setStudents] = useState<Student[]>([]);
  const {token} = useAuth();

  // Hàm gọi danh sách học sinh
    const fetchStudents = async () => {
      try {
      const response = await getStudentApi();
      const studentList = response.data
  
      setStudents(studentList)
    } catch(err) {
      throw err
    }
    }

  
    // Gọi API khi mở trang
    useEffect(() => {
      if (token) {
      fetchStudents();
      }
    },[token]);
  
    // Ghi lại danh sách học sinh vào localStorage mỗi khi state students thay đổi
    useEffect(() => {
      localStorage.setItem("students", JSON.stringify(students));
    }, [students]);

  return (
    <StudentContext.Provider value={{ students, setStudents, fetchStudents }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used inside <StudentProvider>");
  return ctx;
}
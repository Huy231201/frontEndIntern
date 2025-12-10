import {createContext, useContext, useEffect, useState} from "react";

export interface Student {
    id: number;
    fullName: string;
    studentCode: string;
    discounts: string[];
    school: string;
    schoolYearID: number | null;
    gradeID: number | null;
    classID: number | null;
    parent: Parent
}

export interface Parent {
    fullName: string;
    email: string;
    phone: string;
}

interface StudentContextType {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("students");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            fullName: "Nguyễn Duy Minh",
            studentCode: "KH0X91021020",
            discounts: ["Vùng sâu vùng xa", "Con thương binh", "Miễn học phí"],

            school: "TPHP TP. Hồ Chí Minh",
            schoolYearID: 1,
            gradeID: 1,
            classID: 1,
            parent: {
              fullName: "Nguyễn Hoàng Ánh",
              email: "hoangkimquoc97@gmail.com",
              phone: "0977 212 242"
            }
          },

          {
            id: 2,
            fullName: "Nguyễn Quốc Anh",
            studentCode: "KH0X91021021",
            discounts: ["Vùng sâu vùng xa", "Con thương binh"],

            school: "TPHP TP. Hồ Chí Minh",
            schoolYearID: 1,
            gradeID: 1,
            classID: 1,

            parent: {
              fullName: "Nguyễn Quốc Huy",
              email: "nguyenquochuy97@gmail.com",
              phone: "0978 210 242"
            }
          },

          {
            id: 3,
            fullName: "Nguyễn Hữu Thành",
            studentCode: "KH0X91021022",
            discounts: [],

            school: "TPHP TP. Hồ Chí Minh",
            schoolYearID: 1,
            gradeID: 2,
            classID: 2,

            parent: {
              fullName: "Nguyễn Hữu Thành",
              email: "nguyenhuuthanh97@gmail.com",
              phone: "0978 210 243"
            }
          }

        ];
  });

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  return (
    <StudentContext.Provider value={{ students, setStudents }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used inside <StudentProvider>");
  return ctx;
}
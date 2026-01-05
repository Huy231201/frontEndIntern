import { createContext, useContext, useState, useEffect} from "react";
import {getClassApi} from "../api/classApi";
import {useAuth} from "../context/authContext"

interface Class {
    id: number;
    code: string;
    name: string;
    schoolYear: string;
    homeroomTeacherId: string;
    gradeId: string;
    studentCount: string;
}


interface ClassContextType {
    classes: Class[];
    setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
    fetchClasses: () => Promise<void>;
}


export const ClassContext = createContext<ClassContextType | null>(null);


export function ClassProvider({ children }: { children: React.ReactNode }) {
  
  const [classes, setClasses] = useState<Class[]>([]);
  const {token} = useAuth();

  // Hàm gọi danh sách lớp
  const fetchClasses = async () => {
    try {
    const response = await getClassApi();
    const classList = response.data

    setClasses(classList)
  } catch(err) {
    throw err
  }
  }

  // Gọi API khi mở trang
  useEffect(() => {
    if (token) {
    fetchClasses();
    }
  },[token])

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  return (
    <ClassContext.Provider value={{ classes, setClasses, fetchClasses }}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClass() {
  const ctx = useContext(ClassContext);
  if (!ctx) throw new Error("useClass must be used inside <ClassProvider>");
  return ctx;
}
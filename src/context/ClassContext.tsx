import { createContext, useContext, useState, useEffect} from "react";

interface Class {
    id: number;
    name: string;
    gradeID: number | null; // liên kết đến Grade Context
    // studentCount: number;
    schoolYearID: number | null; // liên kết đến School Year Context
    teacherID: number | null;
}


interface ClassContextType {
    classes: Class[];
    setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
}


export const ClassContext = createContext<ClassContextType | null>(null);


export function ClassProvider({ children }: { children: React.ReactNode }) {
  
  const [classes, setClasses] = useState<Class[]>(() => {
    const saved = localStorage.getItem("classes");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "06A",
            gradeID: 1,       // Khối 06
            // studentCount: 44,
            schoolYearID: 1,
            teacherID: 1
          },
          {
            id: 2,
            name: "07A",
            gradeID: 2,       // Khối 07
            // studentCount: 41,
            schoolYearID: 2,
            teacherID: 2
          },
          {
            id: 3,
            name: "07B",
            gradeID: 2,
            // studentCount: 47,
            schoolYearID: 1,
            teacherID: 1
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  return (
    <ClassContext.Provider value={{ classes, setClasses }}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClass() {
  const ctx = useContext(ClassContext);
  if (!ctx) throw new Error("useClass must be used inside <ClassProvider>");
  return ctx;
}
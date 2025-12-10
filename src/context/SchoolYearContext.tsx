import {createContext, useContext, useState, useEffect} from "react"

export interface SchoolYear {
    id: number,
    year: string;
}

interface SchoolYearContextType {
    schoolYears: SchoolYear[];
   setSchoolYears: React.Dispatch<React.SetStateAction<SchoolYear[]>>;
}

const SchoolYearContext = createContext<SchoolYearContextType | null>(null);

export function SchoolYearProvider({ children }: { children: React.ReactNode }) {
  
  // Load từ localStorage khi khởi tạo
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>(() => {
    const saved = localStorage.getItem("schoolYears");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, year: "2023 - 2024"},
          { id: 2, year: "2024 - 2025"},
          { id: 3, year: "2025 - 2026"}
        ];
  });

  // Lưu vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem("schoolYears", JSON.stringify(schoolYears));
  }, [schoolYears]);

  return (
    <SchoolYearContext.Provider value={{ schoolYears, setSchoolYears }}>
      {children}
    </SchoolYearContext.Provider>
  );
}

export function useSchoolYear() {
  const ctx = useContext(SchoolYearContext);
  if (!ctx) throw new Error("useSchoolYear must be used inside <SchoolYearProvider>");
  return ctx;
} 

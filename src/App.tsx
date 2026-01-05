import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SchoolYearManagement from "./pages/SchoolYearManagement";
import GradeLevelManagement from "./pages/GradeLevelManagement"
import ClassManagement from "./pages/ClassManagement";
import StudentManagement from "./pages/StudentManagement";
import MainLayout from "./components/MainLayout";
import { GradeProvider } from "./context/GradeContext";
import { SchoolYearProvider } from "./context/SchoolYearContext";
import { ClassProvider } from "./context/ClassContext";
import { StudentProvider } from "./context/StudentContext";
import { AuthProvider } from "./context/authContext";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <SchoolYearProvider>
        <GradeProvider>
          <ClassProvider>
            <StudentProvider>
              <Routes>
                {/* Trang đăng nhập */}
                <Route path="/login" element={<Login />} />

                {/* các trang sử dụng layout */}
                <Route element={<MainLayout />}>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/schoolYear" element={<SchoolYearManagement />} />
                    <Route path="/gradeLevel" element={<GradeLevelManagement />} />
                    <Route path="/class" element={<ClassManagement />} />
                    <Route path="/student" element={<StudentManagement />} />
                  </Route>
                </Route>
              </Routes>
            </StudentProvider>
          </ClassProvider>
        </GradeProvider>
      </SchoolYearProvider>
      </AuthProvider>
      
    </BrowserRouter>
  );
}

export default App;

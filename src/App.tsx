import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SchoolYearManagement from "./pages/SchoolYearManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/" element={<Login />} />
        <Route path="/schoolYear" element={<SchoolYearManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

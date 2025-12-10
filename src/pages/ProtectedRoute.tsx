import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import {useAuth} from "../context/authContext"

const ProtectedRoute = () => {
  const {token} = useAuth();
  const outletContext = useOutletContext<{ setPageTitle?: (title: string) => void }>();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={outletContext} />;
};

export default ProtectedRoute;

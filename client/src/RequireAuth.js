import useAuth from "./components/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

function RequireAuth({ children }) {
  const { auth } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("token");

  console.log(auth);

  return auth?.token || token ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}

export default RequireAuth;

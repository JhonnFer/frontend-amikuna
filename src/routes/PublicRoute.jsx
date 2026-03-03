import { Navigate, Outlet } from "react-router-dom";
import storeAuth from "../context/storeAuth";

const PublicRoute = () => {
  const token = storeAuth((state) => state.token);
  const user = storeAuth((state) => state.user);

  if (token && user) {
    // Redirige según rol
    if (user.rol === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.rol === "estudiante") {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;

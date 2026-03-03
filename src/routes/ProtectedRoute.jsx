// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = storeAuth((state) => state.token);
  const rol = storeAuth((state) => state.user?.rol);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && rol !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;

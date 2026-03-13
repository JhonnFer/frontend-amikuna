import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import storeProfile from "../context/storeProfile";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = storeAuth((state) => state.token);
  const profile = storeProfile((state) => state.profile);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Cargando perfil...</p>
      </div>
    );
  }

  if (requiredRole && profile.rol !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }

  const perfilCompleto =
    !!profile.imagenPerfil &&
    profile.genero !== "otro" &&
    !!profile.biografia?.trim() &&
    Array.isArray(profile.intereses) &&
    profile.intereses.length > 0 &&
    !!profile.ubicacion?.ciudad &&
    !!profile.ubicacion?.pais;

  if (!perfilCompleto && window.location.pathname !== "/user/completar-perfil") {
    return <Navigate to="/user/completar-perfil" replace />;
  }

  return children;
};

export default ProtectedRoute;
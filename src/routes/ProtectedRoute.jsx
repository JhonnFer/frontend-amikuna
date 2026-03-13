import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import storeProfile from "../context/storeProfile";
import { isPerfilCompleto } from "../hooks/usePerfilUsuarioAutenticado";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = storeAuth((state) => state.token);
  const profile = storeProfile((state) => state.profile);

  // 1️⃣ Sin token → login
  if (!token) return <Navigate to="/login" replace />;

  // 2️⃣ Esperar a cargar perfil
  if (!profile) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Cargando perfil...</p>
    </div>
  );

  // 3️⃣ Validar rol
  if (requiredRole && profile.rol !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }

  // 4️⃣ Redirigir si perfil incompleto
  const perfilOk = isPerfilCompleto(profile);
  if (!perfilOk && window.location.pathname !== "/user/completar-perfil") {
    return <Navigate to="/user/completar-perfil" replace />;
  }

  return children;
};

export default ProtectedRoute;
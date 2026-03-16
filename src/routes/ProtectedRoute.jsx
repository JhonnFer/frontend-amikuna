import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import storeProfile from "../context/storeProfile";
import { isPerfilCompleto } from "../hooks/usePerfilUsuarioAutenticado";

const ProtectedRoute = ({ children, requiredRole }) => {

  const token = storeAuth((state) => state.token);
  const logout = storeAuth((state) => state.logout);
  const profile = storeProfile((state) => state.profile);

  // 1️⃣ Sin token
  if (!token) return <Navigate to="/login" replace />;

  // 2️⃣ Verificar expiración del token
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp * 1000 < Date.now()) {
      logout();
      return <Navigate to="/login" replace />;
    }

  } catch (error) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Esperar perfil
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Cargando perfil...</p>
      </div>
    );
  }

  // 4️⃣ Validar rol
  if (requiredRole && profile.rol !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }

  // 5️⃣ Perfil completo
  const perfilOk = isPerfilCompleto(profile);

  if (!perfilOk && window.location.pathname !== "/user/completar-perfil") {
    return <Navigate to="/user/completar-perfil" replace />;
  }

  return children;
};

export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import storeProfile from "../context/storeProfile";
import { isPerfilCompleto } from "../hooks/usePerfilUsuarioAutenticado";

const ProtectedRoute = ({ children, requiredRole }) => {

  const token = storeAuth((state) => state.token);
  const logout = storeAuth((state) => state.logout);
  const user = storeAuth((state) => state.user);
  const profile = storeProfile((state) => state.profile);

  //  Sin token
  if (!token) return <Navigate to="/login" replace />;

  //  Verificar expiración del token
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

  //  Esperar perfil
if (requiredRole === "estudiante" && !profile) {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Cargando perfil...</p>
    </div>
  );
}
  //  Validar rol
  if (requiredRole && user?.rol !== requiredRole) {
  return <Navigate to="/forbidden" replace />;
}

  //  Perfil completo
  if (requiredRole === "estudiante") {
  const perfilOk = isPerfilCompleto(profile);

  if (!perfilOk && window.location.pathname !== "/user/completar-perfil") {
    return <Navigate to="/user/completar-perfil" replace />;
  }
}

  return children;
};

export default ProtectedRoute;
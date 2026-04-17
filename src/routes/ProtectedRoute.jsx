import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import storeAuth from "../context/storeAuth";
import storeProfile from "../context/storeProfile";
import { isPerfilCompleto } from "../hooks/usePerfilUsuarioAutenticado";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = storeAuth((state) => state.token);
  const logout = storeAuth((state) => state.logout);
  const user = storeAuth((state) => state.user);
  const profile = storeProfile((state) => state.profile);

   // Sin token en store O en localStorage → login directo sin pasar por perfil
  if (!token || !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  // Sin user → esperar
  if (!user) return null;


  // Verificar expiración
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      logout();
      return <Navigate to="/login" replace />;
    }
  } catch {
    logout();
    return <Navigate to="/login" replace />;
  }

  // Validar rol
  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }

  // Perfil completo
  if (requiredRole === "estudiante") {
    const loaded = storeProfile.getState().loaded;
    const loading = storeProfile.getState().loading;
    const authError = storeProfile.getState().authError;

    // 401 detectado → no redirigir, fetchDataBackend ya va a /login
    if (authError)
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <p className="text-gray-400 text-sm">Cerrando sesión...</p>
        </div>
      );

    // Token en store pero no en localStorage → sesión inválida, no renderizar
    if (!localStorage.getItem("token")) return null;

    if (loading || !loaded) return null;

    const perfilOk = isPerfilCompleto(profile);
    if (!perfilOk && window.location.pathname !== "/user/completar-perfil") {
      return <Navigate to="/user/completar-perfil" replace />;
    }
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from "prop-types";
import storeAuth from "../context/storeAuth";
import storeProfile from "../context/storeProfile";
import tokenManager from "../helpers/tokenManager";
import { isPerfilCompleto } from "../context/storeProfile";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = storeAuth((state) => state.token);
  const logout = storeAuth((state) => state.logout);
  const user = storeAuth((state) => state.user);

  const profile = storeProfile((state) => state.profile);
  const loading = storeProfile((state) => state.loading);
  const loaded = storeProfile((state) => state.loaded); // ← una sola declaración
  const authError = storeProfile((state) => state.authError);
  const loadProfile = storeProfile((state) => state.loadProfile);

  useEffect(() => {
    if (requiredRole === "estudiante") {
      loadProfile();
    }
  }, [requiredRole]);

  // Sin token válido → login directo sin pasar por perfil
  if (!tokenManager.isAuthenticated()) {
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
    // 401 detectado → no redirigir, fetchDataBackend ya va a /login
    if (authError)
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <p className="text-gray-400 text-sm">Cerrando sesión...</p>
        </div>
      );

    // Token inválido → sesión inválida, no renderizar
    if (!tokenManager.isAuthenticated()) return null;

    if (loading || !loaded) return null;

    if (
      !isPerfilCompleto(profile) &&
      window.location.pathname !== "/user/completar-perfil"
    ) {
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

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

  // control de espera en el renderizado
  if (!user) return null;

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

  
  //  Validar rol
  if (requiredRole && user?.rol !== requiredRole) {
  return <Navigate to="/forbidden" replace />;
}

  //  Perfil completo
  if (requiredRole === "estudiante") {
  const loaded = storeProfile.getState().loaded;
  const loading = storeProfile.getState().loading;

  // Esperar a que termine de cargar antes de redirigir
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
  requiredRole: PropTypes.string, // opcional, si se quiere controlar por rol
};

export default ProtectedRoute;
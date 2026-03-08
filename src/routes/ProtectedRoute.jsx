import { Navigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import storeProfile from "../context/storeProfile";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = storeAuth((state) => state.token);
  const profile = storeProfile((state) => state.profile);

  // 1️⃣ si no hay token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ esperar a que cargue el perfil
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Cargando perfil...</p>
      </div>
    );
  }

  // 3️⃣ validar rol si se requiere
  if (requiredRole && profile.rol !== requiredRole) {
    return <Navigate to="/forbidden" replace />;
  }
  const perfilCompleto =
  profile.imagenPerfil &&
  profile.genero &&
  profile.biografia &&
  profile.intereses?.length &&
  profile.ubicacion?.ciudad;

if (!perfilCompleto && window.location.pathname !== "/user/completar-perfil") {
  return <Navigate to="/user/completar-perfil" replace />;
}

  return children;
};

export default ProtectedRoute;
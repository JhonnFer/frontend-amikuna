import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";

const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api").replace(/\/api\/?$/, "");

// Función para validar si el perfil está completo
const isPerfilCompleto = (user) => {
  if (!user) return false;
  if (!user.intereses || user.intereses.length === 0) return false;
  if (!user.ubicacion?.ciudad || !user.ubicacion?.pais) return false;
  if (!user.genero || !user.orientacion) return false;
  return true;
};

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const setUser = storeAuth((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${backendUrl}/auth/success`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al autenticar con Google");

        const data = await response.json();
        if (data.user && data.token) {
          setUser({ ...data.user, token: data.token });

          // Validar perfil completo
          if (!isPerfilCompleto(data.user)) {
            alert(
              "Debes completar tu perfil primero para utilizar las demás funciones"
            );
            navigate("/user/completar-perfil");
            return; // Para que no siga con el resto de la lógica
          }

          if (data.user.rol === "admin") {
            navigate("/admin/dashboard");
          } else if (data.user.rol === "estudiante") {
            navigate("/user/dashboard");
          } else {
            navigate("/forbidden");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, setUser]);

  return <div>Cargando...</div>;
};

export default GoogleSuccess;

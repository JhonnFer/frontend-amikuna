// src/components/Dashboard_User/Perfil/FormularioCompletarPerfil.jsx
import { useNavigate } from "react-router-dom";
import PerfilFormBase from "./PerfilFormBase";
import usePerfilUsuarioAutenticado from "../../../hooks/usePerfilUsuarioAutenticado";

const buildProfileFormData = (data) => {
  const form = new FormData();
  form.append("nombre", data.nombre);
  form.append("apellido", data.apellido);
  form.append("biografia", data.biografia);
  form.append("genero", data.genero);
  form.append("orientacion", data.orientacion);
  form.append("fechaNacimiento", data.fechaNacimiento);
  form.append("ubicacion[ciudad]", data.ciudad);
  form.append("ubicacion[pais]", data.pais);

  // Convertir intereses de string a array
  if (data.intereses) {
    const interesArray = data.intereses
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    form.append("intereses", JSON.stringify(interesArray));
  }

  if (data.imagenArchivo) {
    form.append("imagenPerfil", data.imagenArchivo);
  }
  return form;
};

const FormularioCompletarPerfil = () => {
  const navigate = useNavigate();

  const { completarPerfil } = usePerfilUsuarioAutenticado();

  const handleSubmit = async (data) => {
    const form = buildProfileFormData(data);

    const success = await completarPerfil(form);

    if (success) {
      navigate("/user/dashboard");
    }

    return !!success;
  };

  return <PerfilFormBase onSubmit={handleSubmit} />;
};

export default FormularioCompletarPerfil;

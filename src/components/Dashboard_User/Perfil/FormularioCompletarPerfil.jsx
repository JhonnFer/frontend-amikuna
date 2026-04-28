// src/components/Dashboard_User/Perfil/FormularioCompletarPerfil.jsx
import { useNavigate } from "react-router-dom";
import PerfilFormBase from "./PerfilFormBase";
import storeProfile from "../../../context/storeProfile";
import { formatInteresesForBackend } from "../../../helpers/interesesFormatter";


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

  // Convertir intereses a formato que acepta el backend
  if (data.intereses) {
    form.append("intereses", formatInteresesForBackend(data.intereses));
  }

  if (data.imagenArchivo) {
    form.append("imagenPerfil", data.imagenArchivo);
  }
  return form;
};

const FormularioCompletarPerfil = () => {
  const navigate = useNavigate();

  const updateProfile = storeProfile((state)=> state.updateProfile);

  
  const handleSubmit = async (data) => {
    const form = buildProfileFormData(data);
    const updated = await updateProfile(form); // ← una sola llamada, store se actualiza solo
    if (updated) navigate("/user/dashboard");
    return !!updated;
  };

  return <PerfilFormBase onSubmit={handleSubmit} />;
};

export default FormularioCompletarPerfil;

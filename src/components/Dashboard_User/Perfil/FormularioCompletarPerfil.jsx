// src/components/Dashboard_User/Perfil/FormularioCompletarPerfil.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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

  if (data.intereses) {
    form.append("intereses", formatInteresesForBackend(data.intereses));
  }

  if (data.imagenArchivo) {
    form.append("imagenPerfil", data.imagenArchivo);
  }
  return form;
};

const FormularioCompletarPerfil = () => {
  const navigate  = useNavigate();
  const updateProfile = storeProfile((state) => state.updateProfile);
  const loadProfile   = storeProfile((state) => state.loadProfile);
  const profile       = storeProfile((state) => state.profile);

  useEffect(() => {
    if (!profile) loadProfile();
  }, []);

  const handleSubmit = async (data) => {
    const form = buildProfileFormData(data);
    const updated = await updateProfile(form);
    if (updated) navigate("/user/dashboard");
    return !!updated;
  };

  // Solo nombre y apellido — el resto lo completa el usuario en el form
  const initialData = {
    nombre:   profile?.nombre   ?? "",
    apellido: profile?.apellido ?? "",
  };

  return <PerfilFormBase onSubmit={handleSubmit} initialData={initialData} />;
};

export default FormularioCompletarPerfil;
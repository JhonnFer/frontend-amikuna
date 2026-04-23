// src/components/Dashboard_User/Perfil/FormularioEditarPerfil.jsx
import PerfilFormBase from "./PerfilFormBase";
import PropTypes from "prop-types";
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

const FormularioEditarPerfil = ({ perfil, onClose }) => {
  const { editarPerfil, loadProfile } = usePerfilUsuarioAutenticado();

  const handleSubmit = async (data) => {
    const form = buildProfileFormData(data);

    const success = await editarPerfil(form);

    if (success) {
      await loadProfile();
      onClose?.();
    }

    return !!success;
  };

  return (
    <PerfilFormBase
      initialData={perfil}
      onSubmit={handleSubmit}
      isEdit={true}
    />
  );
};

FormularioEditarPerfil.propTypes = {
  perfil: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default FormularioEditarPerfil;

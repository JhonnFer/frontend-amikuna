// src/components/Dashboard_User/Perfil/FormularioEditarPerfil.jsx
import PerfilFormBase from "./PerfilFormBase";
import PropTypes from "prop-types";
import usePerfilUsuarioAutenticado from "../../../hooks/usePerfilUsuarioAutenticado";
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

const FormularioEditarPerfil = ({ perfil, onClose }) => {
  const { editarPerfil, cargarPerfil } = usePerfilUsuarioAutenticado();

  const handleSubmit = async (data) => {
    const form = buildProfileFormData(data);

    const success = await editarPerfil(form);

    if (success) {
      await cargarPerfil();
      onClose?.();
    }

    return !!success;
  };

  return (
    <PerfilFormBase
      initialData={perfil}
      onSubmit={handleSubmit}
      isEdit={true}
      isModal={true}
    />
  );
};

FormularioEditarPerfil.propTypes = {
  perfil: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default FormularioEditarPerfil;

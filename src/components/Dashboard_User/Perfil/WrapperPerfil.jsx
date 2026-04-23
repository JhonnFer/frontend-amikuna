import { useNavigate } from "react-router-dom";
import usePerfilUsuarioAutenticado from "../../../hooks/usePerfilUsuarioAutenticado";
import PerfilFormBase from "./PerfilFormBase";
import PropTypes from "prop-types";

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

const WrapperPerfil = ({ isEdit = false }) => {
  const navigate = useNavigate();

  const { perfil, loadingPerfil, completarPerfil, editarPerfil } =
    usePerfilUsuarioAutenticado();

  const handleSave = async (data) => {
    const form = buildProfileFormData(data);

    const response = isEdit
      ? await editarPerfil(form)
      : await completarPerfil(form);

    if (response) {
      navigate("/user/dashboard");
    }

    return response;
  };

  if (loadingPerfil) return <div>Cargando...</div>;

  return (
    <PerfilFormBase
      initialData={perfil}
      onSubmit={handleSave}
      isEdit={isEdit}
    />
  );
};

WrapperPerfil.propTypes = {
  isEdit: PropTypes.bool,
};

export default WrapperPerfil;

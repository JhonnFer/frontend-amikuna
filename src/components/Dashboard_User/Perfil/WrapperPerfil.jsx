import { useNavigate } from "react-router-dom";
import usePerfilUsuarioAutenticado from "../../../hooks/usePerfilUsuarioAutenticado";
import PerfilFormBase from "./PerfilFormBase";
import { buildProfileFormData } from "../../../helpers/buildProfileFormData";
import PropTypes from "prop-types";

const WrapperPerfil = ({ isEdit = false }) => {
  const navigate = useNavigate();

  const {
    perfil,
    loadingPerfil,
    completarPerfil,
    editarPerfil,
  } = usePerfilUsuarioAutenticado();

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
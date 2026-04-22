// src/components/Dashboard_User/Perfil/FormularioEditarPerfil.jsx
import PerfilFormBase from "./PerfilFormBase";
import PropTypes from "prop-types";
import usePerfilUsuarioAutenticado from "../../../hooks/usePerfilUsuarioAutenticado";
import { buildProfileFormData } from "../../../helpers/buildProfileFormData";

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
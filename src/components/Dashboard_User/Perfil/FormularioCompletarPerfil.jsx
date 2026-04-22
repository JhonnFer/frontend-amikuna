// src/components/Dashboard_User/Perfil/FormularioCompletarPerfil.jsx
import { useNavigate } from "react-router-dom";
import PerfilFormBase from "./PerfilFormBase";
import usePerfilUsuarioAutenticado from "../../../hooks/usePerfilUsuarioAutenticado";
import { buildProfileFormData } from "../../../helpers/buildProfileFormData";

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
import React from "react";
import { useNavigate } from "react-router-dom";
import usePerfilUsuarioAutenticado from "../../hooks/usePerfilUsuarioAutenticado";
import FormularioCompletarPerfil from "../Dashboard_User/FormularioCompletarPerfil";

const WrapperCompletarPerfil = () => {
  const navigate = useNavigate();
  const { perfil, loadingPerfil, actualizarPerfil } = usePerfilUsuarioAutenticado();

  const handleSave = async (formData) => {
    try {
      const response = await actualizarPerfil(formData);
      return !!response; // true si la respuesta es válida
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      return false;
    }
  };

  const handleCancel = () => {
    navigate("/user/dashboard");
  };

  if (loadingPerfil) return <div>Cargando perfil...</div>;

  return (
    
    <FormularioCompletarPerfil
      initialData={perfil}  
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default WrapperCompletarPerfil;

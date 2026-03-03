import React, { useState, useEffect, useCallback } from "react";
// Usamos el hook que me diste al inicio
import usePerfilUsuarioAutenticado from "../../hooks/usePerfilUsuarioAutenticado"; 
// Importamos el componente de formulario
import FormularioCompletarPerfil from "../Dashboard_User/FormularioCompletarPerfil"; 

const PerfilUsuario = () => {
  const { perfil, loadingPerfil, actualizarPerfil } = usePerfilUsuarioAutenticado();
  const [editMode, setEditMode] = useState(false);

  // La función de guardar del formulario será esta
  const handleSave = useCallback(async (formData) => {
    try {
      // Llamamos a la función de actualizar del hook
      await actualizarPerfil(formData);
      setEditMode(false); // Salimos del modo de edición
      return true; // Indicamos que se guardó con éxito
    } catch (error) {
      console.error("Error al guardar desde PerfilUsuario:", error);
      return false; // Indicamos que hubo un error
    }
  }, [actualizarPerfil]);

  const handleCancel = useCallback(() => {
    setEditMode(false); // Salimos del modo de edición
  }, []);

  if (loadingPerfil) return <p>Cargando perfil...</p>;
  if (!perfil) return <p>No hay perfil disponible</p>;

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      {!editMode ? (
        // MODO VISUALIZACIÓN
        <div className="bg-white rounded-xl shadow-md p-6 text-center space-y-4">
          {perfil.imagenPerfil && (
            <img
              src={perfil.imagenPerfil}
              alt="Perfil"
              className="w-32 h-32 rounded-full mx-auto object-cover"
            />
          )}
          <h2 className="text-2xl font-bold text-gray-800">{perfil.nombre}</h2>
          <p className="text-gray-600 whitespace-pre-line">{perfil.biografia}</p>
          <p className="text-gray-500">Género: {perfil.genero}</p>
          <p className="text-gray-500">
            Intereses: {perfil.intereses?.join(", ") || "No definidos"}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        // MODO EDICIÓN
        <div className="bg-white rounded-xl shadow-md p-6">
          <FormularioCompletarPerfil
            initialData={perfil} // Le pasamos los datos actuales para que los precargue
            onSave={handleSave} // Le pasamos la función que guarda los datos
            onCancel={handleCancel} // Le pasamos la función que cancela la edición
          />
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;
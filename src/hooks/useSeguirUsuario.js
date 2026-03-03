// src/hooks/useSeguirUsuario.js
import { useState } from 'react';
import useFetch from './useFetch'; // <-- Importa tu hook useFetch

const useSeguirUsuario = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  // Usa la función fetchDataBackend de tu hook useFetch
  const { fetchDataBackend } = useFetch();

  const seguirUsuario = async (idUsuarioAseguir) => {
    setCargando(true);
    setError(null);

    try {
      // Llama a fetchDataBackend con el endpoint, el método POST
      const data = await fetchDataBackend(`estudiantes/seguir/${idUsuarioAseguir}`, null, "POST");
      
      // Retorna el resultado para que el componente pueda manejarlo
      return data; 
      
    } catch (err) {
      // useFetch ya maneja el toast, aquí solo actualizamos el estado de error
      setError(err.message);
      return false; // Retorna false para indicar que hubo un error
    } finally {
      setCargando(false);
    }
  };

  return { seguirUsuario, cargando, error };
};

export default useSeguirUsuario;
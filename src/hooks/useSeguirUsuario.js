// src/hooks/useSeguirUsuario.js
import { useState } from 'react';
import useFetch from './useFetch'; 


const useSeguirUsuario = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  const { fetchDataBackend } = useFetch();

  const seguirUsuario = async (idUsuarioAseguir) => {
    setCargando(true);
    setError(null);

    try {
      
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

  const noSeguirUsuario = async (idUsuario) => {
    setCargando(true);
    setError(null);
    try {
      const data = await fetchDataBackend(`estudiantes/no-seguir/${idUsuario}`, null, "POST");
      return data;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setCargando(false);
    }
  };


  return { seguirUsuario, noSeguirUsuario, cargando, error };
};

export default useSeguirUsuario;
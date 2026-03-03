// src/hooks/useAdminProfile.js
import { useState, useEffect } from 'react';
import useFetch from '../useFetch';

const useAdminProfile = () => {
  const { fetchDataBackend } = useFetch();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPerfil = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataBackend('perfil', {}, 'GET');
      setPerfil(data.perfil);
    } catch (err) {
      setError(err.message || 'Error al obtener perfil');
    } finally {
      setLoading(false);
    }
  };

  const actualizarPerfil = async (id, datos) => {
    try {
      const data = await fetchDataBackend(`perfil/${id}`, datos, 'PUT', true);
      setPerfil(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
      return null;
    }
  };

  const cambiarPassword = async (payload) => {
    try {
      const data = await fetchDataBackend('admin/cambiar-password', payload, 'PUT');
      return data;
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña');
      return null;
    }
  };

  const generarNuevaPassword = async (payload) => {
    try {
      const data = await fetchDataBackend('admin/generar-nueva-password', payload, 'POST');
      return data;
    } catch (err) {
      setError(err.message || 'Error al generar nueva contraseña');
      return null;
    }
  };

  useEffect(() => {
    obtenerPerfil();
  }, []);

  return {
    perfil,
    loading,
    error,
    actualizarPerfil,
    cambiarPassword,
    generarNuevaPassword,
  };
};

export default useAdminProfile;

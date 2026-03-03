// src/hooks/useAsistenciaEvento.js
import { useState, useCallback } from 'react';
import useFetch from './useFetch';

const useAsistenciaEvento = (onSuccess) => {
  const { fetchDataBackend } = useFetch();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const confirmarAsistencia = useCallback(
    async (idEvento) => {
      if (!idEvento) {
        setError('ID de evento inválido');
        return;
      }

      setCargando(true);
      setError(null);
      try {
        const response = await fetchDataBackend(
          `estudiantes/asistir/${idEvento}`,
          null,
          'POST'
        );
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
        return response;
      } catch (err) {
        setError(err.message || 'Error al confirmar asistencia');
        throw err;
      } finally {
        setCargando(false);
      }
    },
    [fetchDataBackend, onSuccess]
  );

  const rechazarAsistencia = useCallback(
    async (idEvento) => {
      if (!idEvento) {
        setError('ID de evento inválido');
        return;
      }

      setCargando(true);
      setError(null);
      try {
        const response = await fetchDataBackend(
          `estudiantes/no-asistir/${idEvento}`,
          null,
          'POST'
        );
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
        return response;
      } catch (err) {
        setError(err.message || 'Error al rechazar asistencia');
        throw err;
      } finally {
        setCargando(false);
      }
    },
    [fetchDataBackend, onSuccess]
  );

  return { confirmarAsistencia, rechazarAsistencia, cargando, error };
};

export default useAsistenciaEvento;
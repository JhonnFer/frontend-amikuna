//src\hooks\Admin\useAdminUpdatePassword.js
// src/hooks/Admin/useAdminUpdatePassword.js
import { useState } from 'react';
import fetchDataBackend from '../../helpers/fetchDataBackend';

const useAdminUpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cambiarPassword = async ({ newPassword, confirmPassword }) => {
    if (!newPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return null;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDataBackend(
        'admin/cambiar-password',
        { newPassword, confirmPassword },
        'PUT'
      );
      return data;
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { cambiarPassword, loading, error };
};

export default useAdminUpdatePassword;
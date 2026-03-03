// src/Dashboard_Admin/UserProfile.jsx
import React from 'react';
import storeAuth from '../../context/storeAuth';

const UserProfile = () => {
  const user = storeAuth(state => state.user);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Perfil del Administrador</h2>
      <p><strong>Nombre:</strong> {user?.nombre}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Rol:</strong> {user?.rol}</p>
    </div>
  );
};

export default UserProfile;

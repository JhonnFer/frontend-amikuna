import React from 'react';
import useAdminProfile from '../../hooks/Admin/useAdminProfile';

const PerfilAdmin = () => {
  const { perfil, loading, error } = useAdminProfile();

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!perfil) return <p>No se encontró perfil</p>;

return (
  <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
    <div className="flex items-center space-x-6">
      
      {/* Columna 1: Avatar */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Columna 2: Nombre y Rol */}
      <div className="flex flex-col flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">Patricio</h2>
        <p className="text-xs text-gray-500">admin</p>
      </div>

      {/* Columna 3: Información de Contacto (crece para llenar el espacio) */}
      <div className="flex-grow flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <p className="font-medium text-base">admin@epn.edu.ec</p>
        </div>

        <div className="flex items-center space-x-2 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.972 5.972 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <p className="font-medium text-base">admin</p>
        </div>
      </div>
      
    </div>
  </div>
);
};
export default PerfilAdmin;

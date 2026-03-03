// src/components/Dashboard_Admin/UserList.jsx
import React from "react";
import useAdminUsers from "../../hooks/Admin/useAdminUsers";

const UserList = () => {
  const { usuarios, loading, error, eliminarUsuario } = useAdminUsers();

  if (loading) return <p>Cargando estudiantes...</p>;
  if (error) return <p>{error}</p>;
  if (usuarios.length === 0) return <p>No hay estudiantes registrados.</p>;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Lista de Estudiantes</h2>
      </div>

      {/* TABLE - SCROLLABLE */}
      <div className="flex-grow overflow-y-auto max-h-96">
        {usuarios.length === 0 ? (
          <p className="text-center text-gray-500">No hay estudiantes registrados.</p>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3 hidden sm:table-cell">Apellido</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3 hidden md:table-cell">Fecha Nac.</th>
                  <th scope="col" className="px-6 py-3 hidden lg:table-cell">Registrado</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {user.nombre}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">{user.apellido}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {new Date(user.fechaNacimiento).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => eliminarUsuario(user._id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;

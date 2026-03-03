// src/components/Dashboard_Admin/MisStrikes.jsx
import React, { useEffect, useState } from "react";
import useAdminStrikes from "../../hooks/Admin/useAdminStrikes";

const MisStrikes = () => {
  const { obtenerStrikes } = useAdminStrikes();
  const [strikes, setStrikes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStrikes = async () => {
      setLoading(true);
      try {
        const data = await obtenerStrikes();
        setStrikes(data);
      } catch (error) {
        console.error("Error al obtener strikes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStrikes();
  }, []);

  if (loading) return <p>Cargando strikes...</p>;
  if (strikes.length === 0) return <p>No hay strikes para mostrar.</p>;

return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Mis Strikes</h2>
      </div>

      {/* LISTA DE STRIKES - CON SCROLL */}
      <div className="flex-grow overflow-y-auto max-h-96 -m-2 p-2">
        <ul className="space-y-4">
          {strikes.map(({ _id, tipo, razon, fecha, de }, i) => (
            <li key={_id || i} className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">{tipo}</span>
                <span className="text-xs text-gray-500">{new Date(fecha).toLocaleString()}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                <strong>Razón:</strong> {razon}
              </p>
              {de && (
                <p className="text-sm text-gray-600">
                  <strong>De:</strong> {de.nombre} {de.apellido} ({de.correo})
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MisStrikes;

import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';

const ActualizarEvento = ({ eventoId, eventoActual, onActualizado }) => {
  const { fetchDataBackend } = useFetch();

  // Campos que quieres actualizar, inicializados con eventoActual
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [lugar, setLugar] = useState('');
  const [activo, setActivo] = useState(false);

  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (eventoActual) {
      setTitulo(eventoActual.titulo || '');
      setDescripcion(eventoActual.descripcion || '');
      setFecha(eventoActual.fecha ? eventoActual.fecha.slice(0,10) : '');
      setHora(eventoActual.hora || '');
      setLugar(eventoActual.lugar || '');
      setActivo(eventoActual.activo || false);
    }
  }, [eventoActual]);

  const handleActualizar = async () => {
    if (!eventoId) {
      setMensaje('Error: ID de evento no válido');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('fecha', fecha);
    formData.append('hora', hora);
    formData.append('lugar', lugar);
    formData.append('activo', activo.toString());

    try {
      const data = await fetchDataBackend(`eventos/${eventoId}`, formData, 'PUT');
      setMensaje(data.msg || 'Evento actualizado');
      if (onActualizado) onActualizado();
    } catch (error) {
      setMensaje('Error al actualizar evento');
    }
  };

return (
  <div className="bg-white rounded-lg shadow-xl p-6">
    <h4 className="text-2xl font-bold text-gray-800 mb-6">Actualizar Evento</h4>
    
    <div className="space-y-4">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título:</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full">
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">Fecha:</label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full">
          <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">Hora:</label>
          <input
            id="hora"
            type="time"
            value={hora}
            onChange={e => setHora(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="lugar" className="block text-sm font-medium text-gray-700 mb-1">Lugar:</label>
        <input
          id="lugar"
          type="text"
          value={lugar}
          onChange={e => setLugar(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <label htmlFor="activo" className="flex items-center gap-2">
        <input
          id="activo"
          type="checkbox"
          checked={activo}
          onChange={e => setActivo(e.target.checked)}
          className="form-checkbox h-4 w-4 text-blue-600 rounded"
        />
        <span className="text-sm font-medium text-gray-700">Activo</span>
      </label>

      <button
        onClick={handleActualizar}
        className="w-full bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        Actualizar Evento
      </button>
    </div>

    {mensaje && <p className="mt-4 text-sm text-center text-gray-700">{mensaje}</p>}
  </div>
);
};

export default ActualizarEvento;

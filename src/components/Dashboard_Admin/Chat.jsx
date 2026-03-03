// src/Dashboard_Admin/Chat.jsx
import React, { useState } from 'react';

const Chat = () => {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  const enviarMensaje = () => {
    if (nuevoMensaje.trim()) {
      setMensajes([...mensajes, { texto: nuevoMensaje, emisor: 'Admin' }]);
      setNuevoMensaje('');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Chat interno</h2>
      <div className="border p-2 h-40 overflow-y-scroll mb-2">
        {mensajes.map((msg, index) => (
          <div key={index} className="mb-1">
            <strong>{msg.emisor}:</strong> {msg.texto}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={nuevoMensaje}
          onChange={e => setNuevoMensaje(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={enviarMensaje}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;

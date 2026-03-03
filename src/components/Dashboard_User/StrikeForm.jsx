// src/components/StrikeForm.jsx
import React, { useState } from "react";
import useStrike from "../../hooks/useStrike";

const StrikeForm = () => {
  const [tipo, setTipo] = useState("queja");
  const [razon, setRazon] = useState("");
  const { enviarStrike, loading, error, success } = useStrike();

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarStrike({ tipo, razon });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
  <h2 className="text-lg font-semibold mb-4 text-gray-800">
    Enviar Queja o Sugerencia
  </h2>

  <form onSubmit={handleSubmit} className="space-y-4">
    <select
      value={tipo}
      onChange={(e) => setTipo(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
    >
      <option value="queja">Queja</option>
      <option value="sugerencia">Sugerencia</option>
    </select>

    <textarea
      value={razon}
      onChange={(e) => setRazon(e.target.value)}
      placeholder="Escribe tu razón..."
      className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-pink-400"
    />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-900 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default StrikeForm;

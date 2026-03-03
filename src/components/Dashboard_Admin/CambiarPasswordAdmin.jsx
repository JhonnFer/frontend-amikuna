import React, { useState } from 'react';
import useAdminProfile from '../../hooks/Admin/useAdminProfile';

const CambiarPasswordAdmin = () => {
  const { cambiarPassword, generarNuevaPassword } = useAdminProfile();

  const [form, setForm] = useState({
    email: 'admin@epn.edu.ec',
    masterKey: '',
    securityAnswer: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await cambiarPassword(form);
      setMsg(res?.msg || "Contraseña cambiada exitosamente.");
      setForm(prev => ({
        ...prev,
        masterKey: '',
        securityAnswer: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewPassword = async () => {
    setLoading(true);
    setMsg(null);
    setError(null);
    try {
      const res = await generarNuevaPassword({
        email: form.email,
        masterKey: form.masterKey,
        securityAnswer: form.securityAnswer,
      });
      setMsg(res?.msg + (res?.nuevaPassword ? ` Nueva contraseña: ${res.nuevaPassword}` : ''));
    } catch (err) {
      setError(err.message || "Error al generar nueva contraseña.");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Cambiar Contraseña</h2>
    
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Barra Horizontal de Campos */}
      <div className="flex flex-wrap items-end gap-4 md:gap-6">
        
        {/* Campo de Email */}
        <div className="flex-grow min-w-[150px]">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* Clave Maestra */}
        <div className="flex-grow min-w-[150px]">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="masterKey">Clave Maestra</label>
          <input
            type="password"
            id="masterKey"
            name="masterKey"
            value={form.masterKey}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Respuesta de Seguridad */}
        <div className="flex-grow min-w-[150px]">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="securityAnswer">Respuesta de Seguridad</label>
          <input
            type="text"
            id="securityAnswer"
            name="securityAnswer"
            value={form.securityAnswer}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ejemplo: 2025-A"
          />
        </div>

        {/* Nueva Contraseña */}
        <div className="flex-grow min-w-[150px]">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="newPassword">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Confirmar Nueva Contraseña */}
        <div className="flex-grow min-w-[150px]">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Mensajes y Botones */}
      <div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}

        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 w-full md:w-auto px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Cambiar Contraseña'}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerateNewPassword}
            className="flex-1 w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generar Contraseña Automática
          </button>
        </div>
      </div>
    </form>
  </div>
);
};

export default CambiarPasswordAdmin;

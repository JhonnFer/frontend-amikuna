import { useState } from 'react';
import useAdminProfile from '../../hooks/Admin/useAdminProfile';
import useAdminUpdatePassword from '../../hooks/Admin/useAdminUpdatePassword';
import { validate, rules } from '../../helpers/validators';

// ─── Perfil ───────────────────────────────────────────────
const PerfilAdmin = () => {
  const { perfil, loading, error } = useAdminProfile();

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!perfil) return <p>No se encontró perfil</p>;

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
      <div className="flex items-center space-x-6">

        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">{perfil.nombre} {perfil.apellido}</h2>
          <p className="text-xs text-gray-500">{perfil.rol}</p>
        </div>

        <div className="flex-grow flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <p className="font-medium text-base">{perfil.email}</p>
          </div>

          <div className="flex items-center space-x-2 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.972 5.972 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <p className="font-medium text-base">{perfil.rol}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── Cambiar Contraseña ───────────────────────────────────
const CambiarPasswordAdmin = () => {
  const { cambiarPassword, loading, error } = useAdminUpdatePassword();
  const [form, setForm]             = useState({ newPassword: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullSchema = {
      newPassword:     [rules.required, rules.passwordStrong],
      confirmPassword: [rules.required, rules.matchField(form.newPassword, 'Las contraseñas')],
    };

    const { isValid, errors } = validate(form, fullSchema);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    const result = await cambiarPassword(form);
    if (result) {
      setForm({ newPassword: '', confirmPassword: '' });
      setFormErrors({});
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full">
      <h3 className="text-center text-xl font-bold text-gray-800 mb-6">
        Cambiar Contraseña
      </h3>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

        {/* Fila de inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-600">Nueva contraseña</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.newPassword && (
              <p className="text-red-500 text-xs">{formErrors.newPassword}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-600">Confirmar contraseña</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs">{formErrors.confirmPassword}</p>
            )}
          </div>

        </div>

        {/* Checkbox mostrar contraseñas */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPasswords"
            checked={showPasswords}
            onChange={() => setShowPasswords((v) => !v)}
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
          <label htmlFor="showPasswords" className="text-sm text-gray-600 cursor-pointer select-none">
            Mostrar contraseñas
          </label>
        </div>

        {/* Error del servidor */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </div>

      </form>
    </div>
  );
};

// ─── Export ───────────────────────────────────────────────
export { CambiarPasswordAdmin };
export default PerfilAdmin;
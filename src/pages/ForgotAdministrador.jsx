import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logoAmikuna from "../assets/admi.jpg";
import { Link } from 'react-router-dom';

export const ForgotAdministrador = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [masterKey, setMasterKey] = useState('')
const [semestre, setSemestre] = useState('')


 const handleGenerarNueva = async (e) => {
  e.preventDefault();
  if (!email || !masterKey || !semestre) {
    toast.error("Completa todos los campos");
    return;
  }

  setLoading(true);
  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/admin/generar-nueva-password`;
    const response = await axios.post(url, {
      email,
      masterKey,
      securityAnswer: semestre,
    });
    toast.success(response.data.msg);
    toast.info(`Nueva contraseña: ${response.data.nuevaPassword}`);
  } catch (error) {
    toast.error(error.response?.data?.msg || "Error al generar contraseña");
  } finally {
    setLoading(false);
  }
};

const handleCambiarPassword = async (e) => {
  e.preventDefault();
  const newPassword = prompt("Ingresa tu nueva contraseña");
  const confirmPassword = prompt("Confirma la nueva contraseña");

  if (!newPassword || !confirmPassword) {
    toast.error("Debes completar ambas contraseñas");
    return;
  }

  setLoading(true);
  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/admin/cambiar-password`;
    const response = await axios.put(url, {
      email,
      masterKey,
      securityAnswer: semestre,
      newPassword,
      confirmPassword,
    });
    toast.success(response.data.msg);
  } catch (error) {
    toast.error(error.response?.data?.msg || "Error al cambiar contraseña");
  } finally {
    setLoading(false);
  }
};

   return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-10 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${logoAmikuna})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <ToastContainer />
      <main>
        <form className="w-full max-w-sm p-6 rounded-lg">
          <h1 className="text-4xl font-semibold mb-9 text-center text-white">¿Olvidaste tu contraseña (Admin)?</h1>

          <label htmlFor="email" className="block mb-2 font-medium text-center text-white text-xl">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-1 mb-4 border border-gray-300 rounded bg-white bg-opacity-80 text-black"
            required
          />

          <label htmlFor="masterKey" className="block mb-2 font-medium text-center text-white text-xl">
            Escribe el Master-Key
          </label>
          <input
            type="text"
            id="masterKey"
            value={masterKey}
            onChange={e => setMasterKey(e.target.value)}
            className="w-full p-1 mb-4 border border-gray-300 rounded bg-white bg-opacity-80 text-black"
            required
          />

          <label htmlFor="semestre" className="block mb-2 font-medium text-center text-white text-xl">
            ¿En qué semestre fue desarrollado AmiKuna?
          </label>
          <input
            type="text"
            id="semestre"
            value={semestre}
            onChange={e => setSemestre(e.target.value)}
            className="w-full p-1 mb-6 border border-gray-300 rounded bg-white bg-opacity-80 text-black"
            required
          />

          <div className="flex flex-col gap-3">
            <button
              onClick={handleGenerarNueva}
              type="button"
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'Procesando...' : 'Generar nueva contraseña aleatoria'}
            </button>

            <button
              onClick={handleCambiarPassword}
              type="button"
              disabled={loading}
              className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 disabled:opacity-50 transition"
            >
              {loading ? 'Procesando...' : 'Cambiar contraseña manualmente'}
            </button>
          </div>
        </form>
      </main>

      <Link to="/" className="block text-white hover:underline text-2xl text-center mt-6">
        Regresar
      </Link>
    </div>
  )
}
export default ForgotAdministrador

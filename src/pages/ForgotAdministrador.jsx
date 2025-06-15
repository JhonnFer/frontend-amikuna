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

  // Estado para la nueva contraseña temporal y control modal
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleGenerarNueva = async (e) => {
    e.preventDefault()
    if (!email || !masterKey || !semestre) {
      toast.error("Completa todos los campos")
      return
    }

    setLoading(true)
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/admin/generar-nueva-password`
      const response = await axios.post(url, {
        email,
        masterKey,
        securityAnswer: semestre,
      })
      toast.success(response.data.msg)
      setNuevaPassword(response.data.nuevaPassword)
      setShowModal(true) // Mostrar modal con la contraseña
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al generar contraseña")
    } finally {
      setLoading(false)
    }
  }

  const handleCambiarPassword = async (e) => {
    e.preventDefault()
    const newPassword = prompt("Ingresa tu nueva contraseña")
    const confirmPassword = prompt("Confirma la nueva contraseña")

    if (!newPassword || !confirmPassword) {
      toast.error("Debes completar ambas contraseñas")
      return
    }

    setLoading(true)
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/admin/cambiar-password`
      const response = await axios.put(url, {
        email,
        masterKey,
        securityAnswer: semestre,
        newPassword,
        confirmPassword,
      })
      toast.success(response.data.msg)
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error al cambiar contraseña")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(nuevaPassword)
    toast.success("Contraseña copiada al portapapeles")
  }

  const closeModal = () => {
    setShowModal(false)
    setNuevaPassword('')
  }

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

      {/* Modal para mostrar la nueva contraseña */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white text-black rounded-lg p-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()} // evita cerrar modal al click dentro
          >
            <h2 className="text-xl font-bold mb-4 text-center">Nueva contraseña generada</h2>
            <input
              type="text"
              readOnly
              value={nuevaPassword}
              className="w-full p-2 border border-gray-400 rounded mb-4 text-center font-mono select-all"
              onFocus={e => e.target.select()}
            />
            <div className="flex justify-between">
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Copiar
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgotAdministrador

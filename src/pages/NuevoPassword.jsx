import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const NuevoPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Para depurar: muestra los valores con comillas para ver espacios extras
    console.log("password:", `"${password}"`)
    console.log("confirmpassword:", `"${confirmPassword}"`)

    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    if (password.trim().length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }
    setLoading(true)
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/nuevopassword/${token}`
      const respuesta = await axios.post(url, { password, confirmpassword: confirmPassword })

      toast.success(respuesta?.data?.msg || "Contraseña actualizada, ya puedes iniciar sesión")
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Error al actualizar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <h1 className="text-3xl font-semibold mb-6">Crear nueva contraseña</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <label htmlFor="password" className="block mb-2 font-medium">Nueva contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirmar contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirma tu contraseña"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  )
}

export default NuevoPassword

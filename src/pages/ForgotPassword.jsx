import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logoAmikuna from "../assets/forgot.webp";
import { Link } from 'react-router-dom';


export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Por favor ingresa un correo válido')
      return
    }

    setLoading(true)
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/recuperarpassword`
      const response = await axios.post(url, { email })
      toast.success(response?.data?.msg || 'Revisa tu correo para recuperar tu contraseña')
      setEmail('')
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error enviando solicitud')
    } finally {
      setLoading(false)
    }
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
        <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 rounded-lg">
<h1 className="text-4xl font-semibold mb-9 text-center text-white">¿Olvidaste tu contraseña?</h1>

<label htmlFor="email" className="block mb-2 font-medium text-center text-white text-xl">
  Correo electrónico
</label>
          <input
            type="email"
            id="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
className="w-full p-1 mb-4 border border-gray-300 rounded bg-white bg-opacity-80 text-black"            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-1 rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
          
        </form>
      </main>
      <Link to="/login" className="block text-white-600 hover:underline text-sm text-center mt-3">
  Regresar
</Link>

    </div>
  )
}

export default ForgotPassword
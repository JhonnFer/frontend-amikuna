
//src/hooks/useRecuperarPassword.js
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

// ── 1. Solicitar enlace de recuperación ──────────────────────────
export const useSolicitarRecuperacion = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Por favor ingresa un correo válido')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(`${BASE_URL}recuperarpassword`, { email })
      toast.success(data?.msg || 'Revisa tu correo para recuperar tu contraseña')
      setEmail('')
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error enviando solicitud')
    } finally {
      setLoading(false)
    }
  }

  return { email, setEmail, loading, handleSubmit }
}

// ── 2. Verificar token + guardar nueva contraseña ─────────────────
export const useNuevoPassword = (token) => {
  const navigate = useNavigate()
  const ejecutado = useRef(false)

  const [tokenValido, setTokenValido] = useState(false)
  const [tokenVerificando, setTokenVerificando] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // GET — verificar token al montar
  useEffect(() => {
    if (ejecutado.current) return
    ejecutado.current = true

    const verificar = async () => {
      try {
        await axios.get(`${BASE_URL}recuperarpassword/${token}`)
        setTokenValido(true)
      } catch (error) {
        toast.error(error?.response?.data?.msg || 'Token inválido o expirado')
        setTokenValido(false)
      } finally {
        setTokenVerificando(false)
      }
    }

    verificar()
  }, [token])

  // POST — guardar nueva contraseña
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.trim() !== confirmPassword.trim()) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    if (password.trim().length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(`${BASE_URL}nuevopassword/${token}`, {
        password,
        confirmpassword: confirmPassword,
      })
      toast.success(data?.msg || 'Contraseña actualizada, ya puedes iniciar sesión')
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error al actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return {
    tokenValido,
    tokenVerificando,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading,
    handleSubmit,
  }
}
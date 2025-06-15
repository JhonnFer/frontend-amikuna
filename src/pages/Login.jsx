import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetch from '../hooks/useFetch';

import logoAmikuna from '../assets/Logo.png';
import loginImage from '../assets/login.jpg';
import logingogle from '../assets/gogle.png';

const Login = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { fetchDataBackend } = useFetch()

    const loginUser = async(data) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}login`
        const response = await fetchDataBackend(url, data,'POST')
        if(response){
            navigate('/dashboard')
        }
    }
  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <ToastContainer />

      {/* Columna izquierda - Login */}
      <div className="md:w-1/2 w-full flex flex-col justify-start items-center p-6 bg-white">
        <div className="flex items-center mb-4">
          <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px]">
            <img src={logoAmikuna} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold ml-2 font-serif">AMIKUNA</h1>
        </div>

        {/* ✅ handleSubmit recibe la función loginUser */}
        <form onSubmit={handleSubmit(loginUser)} className="flex flex-col justify-center gap-2 w-full max-w-sm">
          <h2 className="text-lg md:text-xl font-bold text-center mb-1 mt-29">Inicia sesión</h2>

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            {...register('email', { required: 'El correo es obligatorio' })}
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5651D] text-sm"
          />
          {errors.email && <p className="text-red-800 text-sm">{errors.email.message}</p>}

          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
            {...register('password', { required: 'La contraseña es obligatoria' })}
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5651D] text-sm"
          />
          {errors.password && <p className="text-red-800 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            className="mt-0 text-sm font-semibold px-4 py-2 rounded-full bg-white text-black border border-gray-400 hover:bg-gray-100 transition-all"
          >
            Ingresar
          </button>

          <div className="flex flex-col  mt-1">
            <button
              type="button"
              className="mt-0 text-sm font-semibold px-6 py-2 rounded-full bg-white text-black border border-gray-400 hover:bg-gray-100 transition-all flex items-center justify-center gap-3 w-full"
            >
              <img src={logingogle} alt="Icono Ingresar" className="w-5 h-5" />
              <span className="text-xs md:text-sm">Ingresar con Google</span>
            </button>

            <Link to="/forgot" className="text-blue-600 hover:underline text-sm text-center mt-14">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link to="/forgot2" className="text-blue-600 hover:underline text-sm text-center mt-8">
              ¿Olvidaste tu contraseña? (Administrador)
            </Link>

            <Link to="/register" className="text-blue-600 hover:underline text-sm text-center mt-8">
              ¿No tienes cuenta? Regístrate aquí
            </Link>

            <Link to="/" className="text-red-600 hover:underline text-sm text-center mt-5">
              Regresar
            </Link>
          </div>
        </form>
      </div>

      {/* Columna derecha - Imagen */}
      <div className="items-stretch w-1/2 md:w-[600px] h-full hidden md:flex  lg-auto ml-auto">
        <img src={loginImage} alt="Decoración" className="object-cover w-full h-full" />
      </div>
    </div>
  );
};

export default Login;
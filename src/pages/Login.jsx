import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetch from "../hooks/useFetch";
import storeAuth from "../context/storeAuth";

import logoAmikuna from "../assets/Logo.png";
import loginImage from "../assets/prueba1.jpg";
import logingogle from "../assets/gogle.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { fetchDataBackend } = useFetch();
  const setUser = storeAuth((state) => state.setUser);

   // Aquí sacamos la base backend sin el /api final
  const backendBase = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api").replace(/\/api\/?$/, '');

  const loginUser = async (data) => {
    try {
      // PASA SOLO LA RUTA RELATIVA
      const response = await fetchDataBackend("login", data, "POST");

      if (response) {
        const { user, token } = response;

        if (user && token) {
          setUser({ ...user, token }); // Guarda en Zustand y localStorage

          if (user.rol === "admin") {
            navigate("/admin/dashboard");
          } else if (user.rol === "estudiante") {
            navigate("/user/dashboard");
          } else {
            navigate("/forbidden");
          }
        } else {
          toast.error("Credenciales incorrectas o cuenta no confirmada");
        }
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <ToastContainer />

      {/* Columna izquierda - Login */}
      <div className="md:w-1/2 h-full flex flex-col justify-self-center items-center p-10 bg-white">
        <div className="flex items-center mb-4">
          <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px]">
            <img
              src={logoAmikuna}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold ml-2 font-serif">AMIKUNA</h1>
        </div>

        <form
          onSubmit={handleSubmit(loginUser)}
          className="flex flex-col justify-center gap-5 w-full max-w-sm"
        >
          <h2 className="text-lg md:text-xl font-bold text-center mb-1 mt-4">
            Inicia sesión
          </h2>

          <input
            type="email"
            placeholder="Correo electrónico"
            {...register("email", { required: "El correo es obligatorio" })}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5651D] text-sm bg-gray-100"
          />
          {errors.email && (
            <p className="text-red-800 text-sm">{errors.email.message}</p>
          )}

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            {...register("password", {
              required: "La contraseña es obligatoria",
            })}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5651D] text-sm bg-gray-100"
          />
          {errors.password && (
            <p className="text-red-800 text-sm">{errors.password.message}</p>
          )}

          <div className="flex items-center mb-2 text-sm">
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            Mostrar contraseña
          </div>

          <button
            type="submit"
            className="text-sm font-semibold px-4 py-2 rounded-full bg-white text-black border border-gray-400 hover:bg-gray-100 transition-all"
          >
            Ingresar
          </button>

          <div className="flex flex-col mt-2">
            <a
              href={`${backendBase}/auth/google`}
              className="text-sm font-semibold px-6 py-2 rounded-full bg-white text-black border border-gray-400 hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
            >
              <img src={logingogle} alt="Icono Ingresar" className="w-5 h-5" />
              <span>Ingresar con Google</span>
            </a>

            <Link
              to="/forgot"
              className="text-blue-600 hover:underline text-sm text-center mt-6"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <Link
              to="/forgot2"
              className="text-blue-600 hover:underline text-sm text-center mt-3"
            >
              ¿Administrador olvidó su contraseña?
            </Link>

            <Link
              to="/register"
              className="text-blue-600 hover:underline text-sm text-center mt-3"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>

            <Link
              to="/"
              className="text-red-600 hover:underline text-sm text-center mt-3"
            >
              Regresar
            </Link>
          </div>
        </form>
      </div>

      {/* Columna derecha - Imagen */}
      <div className="items-stretch w-full h-full md:w-[950px]  hidden md:flex ">
        <img src={loginImage} alt="Decoración" className="object-cover w-full " />
      </div>
    </div>
  );
};

export default Login;

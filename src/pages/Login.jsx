import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft } from "react-icons/fi";

import useFetch from "../hooks/useFetch";
import storeAuth from "../context/storeAuth";
import usePerfilUsuarioAutenticado from "../hooks/usePerfilUsuarioAutenticado";

import Modal from "../components/modal/modal";
import PerfilUsuario from "../components/Dashboard_User/PerfilUsuario";

import logoAmikuna from "../assets/Logo.png";
import loginImage from "../assets/prueba1.jpg";
import logingogle from "../assets/gogle.png";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fetchDataBackend } = useFetch();
  const { cargarPerfil } = usePerfilUsuarioAutenticado();

  const setAuth = storeAuth((state) => state.setAuth);

  const backendBase = (
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api"
  ).replace(/\/api\/?$/, "");

  const loginUser = async (data) => {
    try {
      const response = await fetchDataBackend("login", data, "POST");

      if (!response?.token) {
        toast.error("No se pudo iniciar sesión");
        return;
      }

      const { user, token } = response;

      const userRole = user?.rol?.toLowerCase()?.trim();

      // Guardar en store
      setAuth({
        user,
        token,
      });

      // ADMIN
      if (userRole === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      // ESTUDIANTE
      if (userRole === "estudiante") {
  await cargarPerfil();
  navigate("/user/dashboard");
}

    } catch (error) {
      console.error("Error en loginUser:", error);

      // 👇 MUESTRA MENSAJE DEL BACKEND
      toast.error(error.message || "Error al iniciar sesión");
    }
  };

  const handleProfileCompleted = (success) => {
    if (success) {
      setShowProfileModal(false);
      navigate("/user/dashboard");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen relative">
      <ToastContainer />

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
      >
        <FiArrowLeft className="text-3xl md:text-5xl" />
      </button>

      {/* FORMULARIO */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 bg-white">
        <div className="flex items-center mb-6">
          <img
            src={logoAmikuna}
            alt="Logo"
            className="w-16 h-16 object-contain"
          />

          <h1 className="text-3xl font-bold ml-2 font-serif text-[#FF4E4E]">
            AMIKUNA
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(loginUser)}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <h2 className="text-xl font-bold text-center text-gray-700">
            Inicia Sesión
          </h2>

          <div className="space-y-1">
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("email", { required: "El correo es obligatorio" })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#B5651D] outline-none bg-gray-50"
            />

            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#B5651D] outline-none bg-gray-50"
            />

            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <label className="flex items-center text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => setShowPassword(!showPassword)}
            />
            Mostrar contraseña
          </label>

          <button
            type="submit"
            className="w-full bg-[#c4481b] text-white py-3 rounded-full font-bold hover:bg-[#FF4E4E]"
          >
            Ingresar
          </button>

          <div className="flex flex-col gap-3 mt-4">
            <a
              href={`${backendBase}/auth/google`}
              className="flex items-center justify-center gap-2 border p-2 rounded-full hover:bg-gray-50"
            >
              <img src={logingogle} alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium">
                Ingresar con Google
              </span>
            </a>

            <Link
              to="/forgot"
              className="text-sm text-blue-600 text-center hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>

            <Link
              to="/register"
              className="text-sm text-[#c4481b] text-center font-bold hover:underline"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </form>
      </div>

      {/* IMAGEN */}
      <div className="hidden md:block md:w-1/2 rounded-3xl overflow-hidden md:mr-9">
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* MODAL COMPLETAR PERFIL */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="¡Bienvenido a AmiKuna!"
        showCloseButton={false}
      >
        <PerfilUsuario
          
          onFinished={handleProfileCompleted}
        />
      </Modal>
    </div>
  );
};

export default Login;
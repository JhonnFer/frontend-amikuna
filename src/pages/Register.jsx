import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft } from "react-icons/fi";

import logoAmikuna from "../assets/Logo.png";
import loginImage from "../assets/Registro.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (data) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}registro`;
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      return Promise.reject(
        error?.response?.data?.msg || "Error al registrar usuario.",
      );
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { nombre, apellido, email, password, confirmPassword } = formData;

    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      setLoading(false);
      return toast.error("Completa todos los campos obligatorios.");
    }

    if (password.length < 6) {
      setLoading(false);
      return toast.error("La contraseña debe tener al menos 6 caracteres.");
    }

    if (password !== confirmPassword) {
      setLoading(false);
      return toast.error("Las contraseñas no coinciden.");
    }

    try {
      const res = await registerUser(formData);
      toast.success(
        res.msg || "Registro exitoso. Revisa tu correo para confirmar.",
        { autoClose: 4000 }, // dale 4 segundos para leerlo
      );
      setTimeout(() => navigate("/login"), 4500); // redirige después del toast
    } catch (errorMsg) {
      toast.error(errorMsg);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden relative">
      <ToastContainer />

      {/* Botón regresar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
      >
        <FiArrowLeft className="text-3xl md:text-5xl" />
      </button>

      {/* FORMULARIO */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 bg-white ">
        <div className="flex items-center mb-6">
          <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px]">
            <img
              src={logoAmikuna}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold ml-2 font-serif text-[#FF4E4E]">
            AMIKUNA
          </h1>
        </div>

        <form
          onSubmit={handleSubmitForm}
          className="flex flex-col gap-5 w-full max-w-sm"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-[#c4481b] text-center">
            ¡Únete ahora!
          </h2>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              required
            />

            <label className="text-sm font-medium">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              required
            />

            <label className="text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              required
            />

            <label className="text-sm font-medium">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              required
            />

            <label className="text-sm font-medium">
              Confirma la Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              required
            />

            <label
              className="flex items-center text-sm text-gray-600 cursor-pointer gap-2
                  sm:text-base 
                  md:text-lg 
                  lg:text-xl"
            >
              <input
                type="checkbox"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">
                Mostrar contraseña
              </span>
            </label>
            
          </div>

          <div className="mt-4 flex flex-col sm:flex-row  gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm font-semibold px-8 py-2 md:mx-10 rounded-full bg-white text-black border border-gray-400 hover:bg-black hover:text-white transition-all"
            >
              Regresar
            </button>

            <button
              type="submit"
              className="text-sm font-semibold px-8 py-2 md:mx-10 rounded-full bg-white text-black border border-gray-400 hover:bg-gray-900 hover:text-white transition-all"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>

      {/* IMAGEN */}
      <div className="hidden md:block md:w-1/2 h-full rounded-3xl overflow-hidden md:mr-9">
        <img
          src={loginImage}
          alt="Decoración"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;

import  { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaHome } from "react-icons/fa";

import logoAmikuna from "../assets/Logo.png";
import loginImage from "../assets/Registro.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Esta función solo se encarga de hacer la petición, no muestra mensajes
  const registerUser = async (data) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}registro`;
      const response = await axios.post(url, data);
      return response.data; // solo retorna la respuesta
    } catch (error) {
      return Promise.reject(error?.response?.data?.msg || "Error al registrar usuario.");
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
      toast.success(res.msg || "Registro exitoso. Revisa tu correo para confirmar.");
      setTimeout(() => navigate('/login'), 1000);
    } catch (errorMsg) {
      toast.error(errorMsg);
    }

    setLoading(false);
  };


return (
    <div className="flex w-full h-screen items-stretch relative">

      <ToastContainer />
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
      >
        <FaHome size={50} />
      </button>

      {/* Columna izquierda - Formulario */}
      <div className="md:w-1/2 w-full h-full flex flex-col justify-center items-center p-6 bg-white">
        <div className="flex items-center mb-4">
          <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px]">
            <img src={logoAmikuna} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold ml-2 font-serif text-[#FF4E4E]">AMIKUNA</h1>
        </div>

        <form onSubmit={handleSubmitForm} className="flex flex-col justify-center gap-6 w-full max-w-sm">
          <h2 className="text-3xl md:text-4xl font-bold  text-[#c4481b] text-center mb-1 mt-10">¡Únete ahora!</h2>

          <div className="flex flex-col gap-4">
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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              required
            />

            <label className="text-sm font-medium">Confirma la Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              required
            />
          </div>

          <div className="mt-4 flex justify-around">
            <button
              type="submit"
              className="text-sm font-semibold px-10 py-2 rounded-full bg-white text-black border border-gray-400 hover-bg-tinder-gradient hover:text-white transition-all"
              disabled={loading}
            >
              {loading ? "Registrando..." : " Enviar "}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm font-semibold px-10 py-2 rounded-full bg-white text-black border border-gray-400 hover-bg-color-black_pur hover:text-white  transition-all"
            >
              Regresar
            </button>

            
          </div>
        </form>
      </div>

      {/* Columna derecha - Imagen decorativa */}
      <div className="items-stretch w-full h-full md:w-[950px]  hidden md:flex">

        <img src={loginImage} alt="Decoración" className="object-cover w-full h-full" />
      </div>
      
    </div>
  );
};

export default Register;


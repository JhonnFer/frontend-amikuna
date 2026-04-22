import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";

import useRegister from "../hooks/useRegister";

import logoAmikuna from "../assets/Logo.png";
import loginImage from "../assets/Registro.png";

const Register = () => {
  const navigate = useNavigate();

  // ── Hook ─────────────────────────────────────────
  const {
    isLoading,
    serverError,
    serverSuccess,
    showPassword,
    registerUser,
    togglePassword,
  } = useRegister();

  // ── React Hook Form ─────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  // ── Redirección después de éxito ────────────────
  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [serverSuccess, navigate]);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen relative">
      {/* Botón volver */}
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
          onSubmit={handleSubmit(registerUser)}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <h2 className="text-xl font-bold text-center text-gray-700">
            ¡Únete ahora!
          </h2>

          {/*  Error backend */}
          {serverError && (
            <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-2">
              {serverError}
            </p>
          )}

          {/* Success */}
          {serverSuccess && !serverError && (
            <p className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-lg p-2">
              {serverSuccess}
            </p>
          )}

          {/*  Error formulario */}
          {!serverError && !serverSuccess && Object.keys(errors).length > 0 && (
            <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-2">
              Revisa los campos marcados.
            </p>
          )}

          {/* Nombre */}
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Nombre"
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#B5651D] outline-none bg-gray-50"
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs">{errors.nombre.message}</p>
            )}
          </div>

          {/* Apellido */}
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Apellido"
              {...register("apellido", {
                required: "El apellido es obligatorio",
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#B5651D] outline-none bg-gray-50"
            />
            {errors.apellido && (
              <p className="text-red-500 text-xs">{errors.apellido.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#B5651D] outline-none bg-gray-50"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#B5651D] outline-none bg-gray-50"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              {...register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#B5651D] outline-none bg-gray-50"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Toggle password */}
          <label className="flex items-center text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="mr-2" onChange={togglePassword} />
            Mostrar contraseña
          </label>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c4481b] text-white py-3 rounded-full font-bold hover:bg-[#FF4E4E] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>

          {/* Link login */}
          <div className="flex flex-col gap-3 mt-4">
            <Link
              to="/login"
              className="text-sm text-[#c4481b] text-center font-bold hover:underline"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </div>

      {/* IMAGEN */}
      <div className="hidden md:block md:w-1/2 md:h-screen rounded-3xl overflow-hidden md:mr-9">
        <img
          src={loginImage}
          alt="Registro"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import storeAuth from "../../context/storeAuth";
import { useNavigate } from "react-router-dom";
import storeProfile from "../../context/storeProfile";

const steps = ["Personal", "Identidad", "Ubicación", "Foto"];

const FormularioCompletarPerfil = ({ initialData, onSuccess, onCancel }) => {
  const { updateProfile, loadProfile } = storeProfile();
  const navigate = useNavigate();
  const logout = storeAuth((state) => state.logout);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    biografia: "",
    intereses: "",
    genero: "",
    orientacion: "",
    fechaNacimiento: "",
    ciudad: "",
    pais: "",
  });

  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [showGeneroWarning, setShowGeneroWarning] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      nombre: initialData.nombre || "",
      apellido: initialData.apellido || "",
      biografia: initialData.biografia || "",
      intereses: initialData.intereses?.join(", ") || "",
      genero: initialData.genero || "",
      orientacion: initialData.orientacion || "",
      fechaNacimiento: initialData.fechaNacimiento
        ? initialData.fechaNacimiento.split("T")[0]
        : "",
      ciudad: initialData.ubicacion?.ciudad || "",
      pais: initialData.ubicacion?.pais || "",
    });
    setImagenPreview(initialData.imagenPerfil || "");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "genero") setShowGeneroWarning(value === "otro");
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenArchivo(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleCerrarSesion = () => {
    logout();
    navigate("/login");
  };

  const validarFormulario = () => {
    if (!formData.nombre.trim()) return "El nombre es obligatorio";
    if (!formData.apellido.trim()) return "El apellido es obligatorio";
    if (!formData.genero) return "Seleccione un género";
    if (!formData.orientacion) return "Seleccione una orientación";
    if (!formData.ciudad.trim()) return "Ingrese una ciudad";
    if (!formData.pais.trim()) return "Ingrese un país";
    if (
      formData.genero === "otro" &&
      formData.orientacion.toLowerCase() === "otro"
    )
      return "Género y orientación no pueden ser 'otro' al mismo tiempo";
    return null;
  };

  // ✅ Ya no recibe evento — se llama directamente como función
  const handleSubmit = async () => {
    if (currentStep !== steps.length - 1) return; // 🛡️ guarda extra
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const interesesArray = formData.intereses
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("apellido", formData.apellido);
      data.append("biografia", formData.biografia);
      data.append("genero", formData.genero);
      data.append("orientacion", formData.orientacion);
      data.append("fechaNacimiento", formData.fechaNacimiento);
      data.append("intereses", interesesArray.join(","));
      data.append("ubicacion[ciudad]", formData.ciudad);
      data.append("ubicacion[pais]", formData.pais);
      if (imagenArchivo) data.append("imagenPerfil", imagenArchivo);
      const success = await updateProfile(data);
      if (success) {
        await loadProfile();
        navigate("/user/dashboard");
        if (onSuccess) onSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError("Error inesperado al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const inputClass =
    "w-full bg-white/70 border border-orange-200 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 backdrop-blur-sm";

  const labelClass =
    "block text-[10px] sm:text-xs font-semibold text-orange-700 uppercase tracking-widest mb-1 sm:mb-1.5";

  return (
    <div className="w-full max-w-[95%] md:max-w-[45rem] bg-gradient-to-br from-red-100 via-orange-50 to-orange-100 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-orange-200/60 mx-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-400 to-orange-400 px-5 pt-6 pb-14 sm:px-8 sm:pt-8 sm:pb-14">
        <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-br from-red-100 via-orange-50 to-orange-100 rounded-t-3xl" />
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-red-100 text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-1">
              Paso {currentStep + 1} de {steps.length}
            </p>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Completa tu perfil
            </h1>
          </div>
          {/* Avatar preview pequeño */}
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-white/40 overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
            {imagenPreview ? (
              <img
                src={imagenPreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-5 h-5 sm:w-7 sm:h-7 text-white/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-5 right-5 sm:left-8 sm:right-8">
          <div className="flex gap-1 sm:gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${i <= currentStep ? "bg-white" : "bg-white/30"}`}
                />
                <p
                  className={`text-center text-[9px] sm:text-[10px] mt-1 font-medium transition-colors duration-300 ${i === currentStep ? "text-white" : "text-white/50"}`}
                >
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="px-5 pt-7 pb-5 sm:px-8 sm:pt-8 sm:pb-6">
        {error && (
          <div className="mb-4 sm:mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* ✅ form sin onSubmit — ya no controla la navegación */}
        <form onSubmit={(e) => e.preventDefault()}>
          {/* PASO 0: Personal */}
          <div
            className={`space-y-3 sm:space-y-4 animate-fade-in ${currentStep === 0 ? "block" : "hidden"}`}
          >
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Apellido</label>
              <input
                type="text"
                name="apellido"
                placeholder="Tu apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Biografía</label>
              <textarea
                name="biografia"
                placeholder="Cuéntanos algo sobre ti..."
                value={formData.biografia}
                onChange={handleChange}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className={labelClass}>Intereses</label>
              <input
                type="text"
                name="intereses"
                placeholder="ej: música, tecnología, deporte"
                value={formData.intereses}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-[10px] sm:text-[11px] text-orange-400 mt-1 sm:mt-1.5 pl-1">
                Separa cada interés con una coma
              </p>
            </div>
          </div>

          {/* PASO 1: Identidad */}
          <div
            className={`space-y-3 sm:space-y-4 animate-fade-in ${currentStep === 1 ? "block" : "hidden"}`}
          >
            <div>
              <label className={labelClass}>Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Seleccione género</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="otro">Otro</option>
              </select>
              {showGeneroWarning && (
                <p className="text-xs text-orange-500 mt-1.5 pl-1">
                  Recuerda que orientación no puede ser (otro) también
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Orientación</label>
              <select
                name="orientacion"
                value={formData.orientacion}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Seleccione orientación</option>
                <option value="heterosexual">Heterosexual</option>
                <option value="homosexual">Homosexual</option>
                <option value="bisexual">Bisexual</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Fecha de nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* PASO 2: Ubicación */}
          <div
            className={`space-y-3 sm:space-y-4 animate-fade-in ${currentStep === 2 ? "block" : "hidden"}`}
          >
            <div>
              <label className={labelClass}>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                placeholder="Tu ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>País</label>
              <input
                type="text"
                name="pais"
                placeholder="Tu país"
                value={formData.pais}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* PASO 3: Foto */}
          <div
            className={`animate-fade-in ${currentStep === 3 ? "block" : "hidden"}`}
          >
            <label className={labelClass}>Foto de perfil</label>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-orange-300 rounded-2xl p-4 sm:p-6 text-center hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-200 group">
                {imagenPreview ? (
                  <img
                    src={imagenPreview}
                    alt="preview"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover mx-auto shadow-md"
                  />
                ) : (
                  <>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-orange-200 transition-colors">
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-orange-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm text-orange-600 font-medium">
                      Haz clic para subir tu foto
                    </p>
                    <p className="text-[10px] sm:text-xs text-orange-400 mt-1">
                      PNG, JPG hasta 5MB
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                className="hidden"
              />
            </label>
            {imagenPreview && (
              <button
                type="button"
                onClick={() => {
                  setImagenPreview("");
                  setImagenArchivo(null);
                }}
                className="mt-3 text-xs text-red-400 hover:text-red-600 transition-colors mx-auto block"
              >
                Eliminar foto
              </button>
            )}
          </div>
        </form>{/* ✅ form cierra ANTES de los botones de navegación */}

        {/* ✅ Navegación FUERA del form — nunca dispara submit accidental */}
        <div className="flex items-center justify-between mt-6 sm:mt-8 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="flex-1 py-2.5 sm:py-3 rounded-xl border border-orange-300 text-orange-600 text-xs sm:text-sm font-semibold disabled:opacity-30 hover:bg-orange-50 transition-all duration-200"
          >
            ← Atrás
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-400 to-orange-400 text-white text-xs sm:text-sm font-semibold hover:from-red-500 hover:to-orange-500 shadow-md shadow-orange-200 transition-all duration-200 active:scale-[0.98]"
            >
              Siguiente →
            </button>
          ) : (
            // ✅ type="button" + llama handleSubmit directamente, sin depender del form
            <button
              type="button"
              onClick={handleSubmit}
              disabled={guardando}
              className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-400 to-orange-400 text-white text-xs sm:text-sm font-semibold hover:from-red-500 hover:to-orange-500 shadow-md shadow-orange-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
            >
              {guardando ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Guardando...
                </span>
              ) : (
                "Guardar perfil ✓"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Footer con acciones secundarias */}
      <div className="px-5 pb-5 sm:px-8 sm:pb-7 flex items-center justify-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={handleCerrarSesion}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium flex items-center gap-1.5"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cerrar sesión
        </button>
        {onCancel && (
          <>
            <span className="text-orange-200">·</span>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

FormularioCompletarPerfil.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default FormularioCompletarPerfil;
// src/components/Dashboard_User/Perfil/PerfilFormBase.jsx
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  formatInteresesFromBackend,
  isValidInteresesFormat,
} from "../../../helpers/interesesFormatter";

const steps = ["Personal", "Identidad", "Ubicación", "Foto"];

const DatePicker = ({ value, onChange, onBlur, hasError }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Inicializar desde value externo (formato YYYY-MM-DD)
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-");
      setYear(y || "");
      setMonth(m ? String(parseInt(m)) : "");
      setDay(d ? String(parseInt(d)) : "");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const notify = (d, m, y) => {
    if (d && m && y) {
      const mm = String(m).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      onChange({
        target: { name: "fechaNacimiento", value: `${y}-${mm}-${dd}` },
      });
    }
  };

  const selectCls = (hasErr) =>
    `px-3 py-2.5 text-sm text-stone-800 bg-white border rounded-lg outline-none transition appearance-none cursor-pointer
    ${
      hasErr
        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
    }`;

  return (
    <div className="grid grid-cols-3 gap-2" onBlur={onBlur}>
      {/* DÍA */}
      <div className="relative">
        <select
          value={day}
          onChange={(e) => {
            setDay(e.target.value);
            notify(e.target.value, month, year);
          }}
          className={selectCls(hasError) + " w-full pr-7"}
        >
          <option value="">Día</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
          ▾
        </span>
      </div>

      {/* MES */}
      <div className="relative">
        <select
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            notify(day, e.target.value, year);
          }}
          className={selectCls(hasError) + " w-full pr-7"}
        >
          <option value="">Mes</option>
          {months.map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
          ▾
        </span>
      </div>

      {/* AÑO */}
      <div className="relative">
        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            notify(day, month, e.target.value);
          }}
          className={selectCls(hasError) + " w-full pr-7"}
        >
          <option value="">Año</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
          ▾
        </span>
      </div>
    </div>
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  hasError: PropTypes.bool,
};

// ── VALIDACIONES POR PASO ──────────────────────────────────────────────────
const validateStep = (step, formData, imagenPreview) => {
  const errors = {};

  if (step === 0) {
    if (!formData.nombre.trim()) errors.nombre = "El nombre es requerido";
    else if (formData.nombre.trim().length < 2)
      errors.nombre = "Mínimo 2 caracteres";
    if (!formData.nombre.trim().match(/^[a-zA-Z\s]+$/))
      errors.nombre = "El nombre solo puede contener letras";

    if (!formData.apellido.trim()) errors.apellido = "El apellido es requerido";
    else if (formData.apellido.trim().length < 2)
      errors.apellido = "Mínimo 2 caracteres";
    if (!formData.apellido.trim().match(/^[a-zA-ZñÑ\s]+$/))
      errors.apellido = "El apellido solo puede contener letras";

    if (formData.biografia.trim().length < 5)
      errors.biografia = "La biografía debe tener al menos 5 caracteres";
    if (formData.biografia.trim().length > 300)
      errors.biografia = "La biografía no puede exceder los 300 caracteres";
  }

  if (step === 1) {
    if (!formData.genero) errors.genero = "Selecciona tu género";

    if (!formData.fechaNacimiento) {
      errors.fechaNacimiento = "La fecha de nacimiento es requerida";
    } else {
      const birth = new Date(formData.fechaNacimiento);
      const age = Math.floor(
        (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      );
      if (age < 18) errors.fechaNacimiento = "Debes ser mayor de 18 años";
      else if (age > 120) errors.fechaNacimiento = "Fecha inválida";
    }
  }

  if (step === 2) {
    if (!formData.ciudad.trim()) errors.ciudad = "La ciudad es requerida";
    else if (!formData.ciudad.trim().match(/^[a-zA-ZñÑ\s]+$/))
      errors.ciudad = "La ciudad solo puede contener letras";

    if (!formData.pais.trim()) errors.pais = "El país es requerido";
    else if (!formData.pais.trim().match(/^[a-zA-ZñÑ\s]+$/))
      errors.pais = "El país solo puede contener letras";
  }

  if (step === 3) {
    if (!imagenPreview) errors.imagen = "Sube una foto de perfil";

    const interesesStr = formData.intereses;

    if (!isValidInteresesFormat(interesesStr)) {
      errors.intereses = !interesesStr.trim()
        ? "Agrega al menos un interés"
        : "Despues de una coma no puede estar vacio, sin símbolos ni espacios extra";
    }
  }

  return errors;
};

// ──────────────────────────────────────────────────────────────────────────
const PerfilFormBase = ({
  initialData = {},
  onSubmit,
  isEdit = false,
  isModal = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
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
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── CARGA INICIAL — solo corre UNA vez al montar ─────────────────────────
  // useRef previene que el efecto se repita si el padre re-renderiza y pasa
  // una nueva referencia de objeto con los mismos datos (causa del loop).
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (initialData && Object.keys(initialData).length > 0) {
      // Modo edición: poblar con datos existentes
      setFormData({
        nombre: initialData.nombre || "",
        apellido: initialData.apellido || "",
        biografia: initialData.biografia || "",
        genero: initialData.genero || "",
        orientacion: initialData.orientacion || "",
        fechaNacimiento: initialData.fechaNacimiento?.split("T")[0] || "",
        ciudad: initialData.ubicacion?.ciudad || "",
        pais: initialData.ubicacion?.pais || "",
        intereses: formatInteresesFromBackend(initialData.intereses),
      });
      setImagenPreview(initialData.imagenPerfil || "");

      return;
    }

    // Modo creación: restaurar borrador si existe
    const saved = localStorage.getItem("perfil_draft");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData(data);
        if (data.currentStep !== undefined) setCurrentStep(data.currentStep);
      } catch {
        localStorage.removeItem("perfil_draft");
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── AUTOSAVE DRAFT (solo modo creación) ─────────────────────────────────
  useEffect(() => {
    if (isEdit) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(
        "perfil_draft",
        JSON.stringify({ ...formData, currentStep }),
      );
    }, 1500);
    return () => clearTimeout(timeout);
  }, [formData, currentStep, isEdit]);

  // ── PROGRESO ─────────────────────────────────────────────────────────────
  const calculateProgress = () => {
    const fields = [
      formData.nombre,
      formData.apellido,
      formData.biografia,
      formData.genero,
      formData.orientacion,
      formData.fechaNacimiento,
      formData.ciudad,
      formData.pais,
      imagenPreview,
      formData.intereses,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  // ── HANDLERS ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si es el campo de intereses, limpiar caracteres especiales automáticamente
    let finalValue = value;
    if (name === "intereses") {
      finalValue = value
        .replace(/[[\]"\\]/g, "") 
        .replace(/,\s*,/g, ",") // Comas dobles
        .replace(/,\s+/g, ", ") // Normaliza espacios
        .trim();
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenArchivo(file);
    setImagenPreview(URL.createObjectURL(file));
    setTouched((prev) => ({ ...prev, imagen: true }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData, imagenPreview);
    if (Object.keys(stepErrors).length > 0) {
      const allTouched = Object.keys(stepErrors).reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {},
      );
      setTouched((prev) => ({ ...prev, ...allTouched }));
      setSubmitAttempted(true);
      return;
    }
    setSubmitAttempted(false);
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setSubmitAttempted(false);
    setCurrentStep((s) => s - 1);
  };

  // Solo se puede navegar hacia atrás desde el stepper
  const handleGoStep = (i) => {
    if (i >= currentStep) return;
    setSubmitAttempted(false);
    setCurrentStep(i);
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(currentStep, formData, imagenPreview);
    if (Object.keys(stepErrors).length > 0) {
      const allTouched = Object.keys(stepErrors).reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {},
      );
      setTouched((prev) => ({ ...prev, ...allTouched }));
      setSubmitAttempted(true);
      return;
    }
    setLoading(true);
    try {
      const success = await onSubmit({ ...formData, imagenArchivo });
      if (!success) {
        alert("Error al guardar");
      } else {
        localStorage.removeItem("perfil_draft");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── ERRORES VISIBLES ──────────────────────────────────────────────────────
  // Solo se muestran si el campo fue tocado (onBlur/onChange) o si el usuario
  // intentó avanzar con campos incompletos.
  const stepErrors = validateStep(currentStep, formData, imagenPreview);
  const visibleErrors = Object.fromEntries(
    Object.entries(stepErrors).filter(([k]) => touched[k] || submitAttempted),
  );
  const stepIsValid = Object.keys(stepErrors).length === 0;

  // ── CHECKLIST ─────────────────────────────────────────────────────────────
  const checklist = [
    {
      label: "Nombre",
      ok: !!(
        formData.nombre.trim().length >= 2 &&
        formData.apellido.trim().length >= 2
      ),
    },
    { label: "Identidad", ok: !!(formData.genero && formData.fechaNacimiento) },
    {
      label: "Ubicación",
      ok: !!(formData.ciudad.trim() && formData.pais.trim()),
    },
    { label: "Foto", ok: !!imagenPreview },
    { label: "Intereses", ok: !!formData.intereses.trim() },
  ];

  const progress = calculateProgress();
  const isLast = currentStep === steps.length - 1;

  const stepSubtitles = [
    "Tu nombre y una pequeña biografía",
    "Selecciona tu género y orientación",
    "Ciudad y país donde vives",
    "Una imagen vale más que mil palabras",
  ];

  // ── ESTILOS ───────────────────────────────────────────────────────────────
  const inputBase =
    "w-full px-3.5 py-2.5 text-sm text-stone-800 bg-white border rounded-lg outline-none transition placeholder:text-stone-400";

  const inputCls = (field) =>
    `${inputBase} ${
      visibleErrors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
    }`;

  const labelCls =
    "block text-[11px] font-semibold uppercase tracking-wide text-stone-500 mb-1.5";

  const ErrorMsg = ({ field }) =>
    visibleErrors[field] ? (
      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
        <span>⚠</span> {visibleErrors[field]}
      </p>
    ) : null;

  return (
    <div
      className={
        isModal
          ? ""
          : "w-full h-full absolute bg-gradient-to-br from-red-300 via-orange-100 to-orange-200"
      }
    >
      <div
        className={`${isModal ? "max-w-2xl overflow-y-auto scrollbar-eventos max-h-[60vh]" : "max-w-[80rem]"} mx-auto p-6 bg-gradient-to-t from-gray-100 via-white to-orange-200 rounded-xl shadow-md ${isModal ? "" : "my-9"}`}
      >
        {/* ── HEADER ── */}
        <div className="mb-5">
          <span className="inline-block bg-orange-50 text-orange-700 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
            Paso {currentStep + 1} de {steps.length}
          </span>
          <h2
            className="text-xl font-bold text-stone-800 leading-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {isEdit ? "Editar perfil" : "Completa tu perfil"}
          </h2>
          <p className="text-sm text-stone-400 mt-0.5">
            {stepSubtitles[currentStep]}
          </p>
        </div>

        {/* ── STEPPER ── */}
        <div className="flex items-center mb-5">
          {steps.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div
                key={step}
                className={
                  isModal
                    ? " relative mx-auto xl:max-w-xl lg:max-w-lg md:max-w-md sm:max-w-sm"
                    : "flex items-center flex-1"
                }
              >
                <button
                  onClick={() => handleGoStep(i)}
                  disabled={i >= currentStep}
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all duration-200",
                    isDone
                      ? "bg-orange-400 text-white border-2 border-orange-400 cursor-pointer"
                      : isActive
                        ? "bg-white text-orange-500 border-2 border-orange-400 ring-4 ring-orange-50 cursor-default"
                        : "bg-stone-100 text-stone-400 border-2 border-stone-200 cursor-not-allowed opacity-50",
                  ].join(" ")}
                  title={step}
                >
                  {isDone ? "✓" : i + 1}
                </button>
                <span
                  className={[
                    "text-[11px] font-medium ml-1.5 hidden sm:block",
                    isActive
                      ? "text-orange-700"
                      : isDone
                        ? "text-stone-500"
                        : "text-stone-400",
                  ].join(" ")}
                >
                  {step}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className="flex-1 mx-2 h-px transition-colors duration-300"
                    style={{ background: isDone ? "#fb923c" : "#e7e5e4" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── BARRA DE PROGRESO ── */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-stone-400 mb-1.5 font-medium">
            <span>Completado</span>
            <span className="text-orange-600 font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #fdba74, #f97316)",
              }}
            />
          </div>
        </div>

        {/* ── CHECKLIST ── */}
        <div className="grid grid-cols-2 gap-1.5 mb-5">
          {checklist.map((item) => (
            <div
              key={item.label}
              className={[
                "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200",
                item.ok
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : "bg-stone-50 border-stone-200 text-stone-500",
              ].join(" ")}
            >
              <span
                className={[
                  "w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] flex-shrink-0",
                  item.ok
                    ? "bg-orange-400 text-white"
                    : "bg-stone-200 text-stone-400",
                ].join(" ")}
              >
                {item.ok ? "✓" : ""}
              </span>
              {item.label}
            </div>
          ))}
        </div>

        {/* ── BANNER ERROR AL INTENTAR AVANZAR ── */}
        {submitAttempted && !stepIsValid && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 mb-4 text-sm text-red-600 font-medium">
            <span>⚠</span>
            Completa correctamente los campos antes de continuar
          </div>
        )}

        {/* ── CONTENIDO DEL PASO ── */}
        <div className="min-h-[150px]">
          {/* STEP 1 — Personal */}
          {currentStep === 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nombre</label>
                  <input
                    name="nombre"
                    placeholder="Ana"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputCls("nombre")}
                  />
                  <ErrorMsg field="nombre" />
                </div>
                <div>
                  <label className={labelCls}>Apellido</label>
                  <input
                    name="apellido"
                    placeholder="García"
                    value={formData.apellido}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputCls("apellido")}
                  />
                  <ErrorMsg field="apellido" />
                </div>
              </div>
              <div>
                <label className={labelCls}>
                  Biografía{" "}
                  <span className="normal-case font-normal text-stone-400">
                    (opcional)
                  </span>
                </label>
                <textarea
                  name="biografia"
                  rows={3}
                  placeholder="Cuéntanos sobre ti..."
                  value={formData.biografia}
                  onChange={handleChange}
                  className={`${inputBase} border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none`}
                />
                <ErrorMsg field="biografia" />
              </div>
            </div>
          )}

          {/* STEP 2 — Identidad */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Género</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputCls("genero")}
                  >
                    <option value="">Seleccionar</option>
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="no-binario">No binario</option>
                    <option value="otro">Otro</option>
                  </select>
                  <ErrorMsg field="genero" />
                </div>
                <div>
                  <label className={labelCls}>
                    Orientación{" "}
                    <span className="normal-case font-normal text-stone-400">
                      (opcional)
                    </span>
                  </label>
                  <select
                    name="orientacion"
                    value={formData.orientacion}
                    onChange={handleChange}
                    className={`${inputBase} border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100`}
                  >
                    <option value="">Seleccionar</option>
                    <option value="heterosexual">Heterosexual</option>
                    <option value="homosexual">Homosexual</option>
                    <option value="bisexual">Bisexual</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Fecha de nacimiento</label>
                <DatePicker
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, fechaNacimiento: true }))
                  }
                  hasError={!!visibleErrors.fechaNacimiento}
                />
                <ErrorMsg field="fechaNacimiento" />
              </div>
            </div>
          )}

          {/* STEP 3 — Ubicación */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Ciudad</label>
                <input
                  name="ciudad"
                  placeholder="Bogotá"
                  value={formData.ciudad}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("ciudad")}
                />
                <ErrorMsg field="ciudad" />
              </div>
              <div>
                <label className={labelCls}>País</label>
                <input
                  name="pais"
                  placeholder="Colombia"
                  value={formData.pais}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("pais")}
                />
                <ErrorMsg field="pais" />
              </div>
            </div>
          )}

          {/* STEP 4 — Foto */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="imagen-upload"
                  className={[
                    "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
                    visibleErrors.imagen
                      ? "border-red-300 bg-red-50 p-8"
                      : imagenPreview
                        ? "border-orange-300 bg-orange-50 p-4"
                        : "border-stone-200 bg-stone-50 p-8 hover:border-orange-300 hover:bg-orange-50",
                  ].join(" ")}
                >
                  {imagenPreview ? (
                    <>
                      <img
                        src={imagenPreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-orange-400 mb-2"
                      />
                      <span className="text-xs text-orange-600 font-semibold underline">
                        Cambiar foto
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl mb-2">📷</span>
                      <span className="text-sm font-semibold text-stone-600">
                        Sube tu foto
                      </span>
                      <span className="text-xs text-stone-400 mt-1">
                        JPG, PNG · máx. 5MB
                      </span>
                    </>
                  )}
                </label>
                <ErrorMsg field="imagen" />
                <input
                  id="imagen-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagenChange}
                />
              </div>
              <div>
                <label className={labelCls}>Intereses</label>
                <input
                  name="intereses"
                  placeholder="Ej: lectura, deporte, música"
                  value={formData.intereses}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("intereses")}
                />
                <ErrorMsg field="intereses" />
              </div>
            </div>
          )}
        </div>

        {/* ── BOTONES ── */}
        <div className="flex gap-2.5 mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-5 py-2.5 text-sm font-semibold text-black border border-stone-200 rounded-lg transition hover:bg-gradinet-r from-red-400 to-orange-500 hover:text-black hover:border-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Atrás
          </button>

          {!isLast ? (
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-pink-600  to-orange-400 flex-1 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:-translate-y-px active:translate-y-0"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #fb923c, #f97316)",
              }}
            >
              {loading ? "Guardando..." : "Guardar perfil ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

PerfilFormBase.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  isModal: PropTypes.bool,
  field: PropTypes.string,
};

export default PerfilFormBase;

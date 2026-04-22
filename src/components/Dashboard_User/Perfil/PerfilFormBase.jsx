// src/components/Dashboard_User/Perfil/PerfilFormBase.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const steps = ["Personal", "Identidad", "Ubicación", "Foto"];

const PerfilFormBase = ({
  initialData = {},
  onSubmit,
  isEdit = false,
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

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // cargar datos si es edición
  useEffect(() => {
    if (!initialData) return;

    setFormData({
      nombre: initialData.nombre || "",
      apellido: initialData.apellido || "",
      biografia: initialData.biografia || "",
      intereses: initialData.intereses?.join(", ") || "",
      genero: initialData.genero || "",
      orientacion: initialData.orientacion || "",
      fechaNacimiento: initialData.fechaNacimiento?.split("T")[0] || "",
      ciudad: initialData.ubicacion?.ciudad || "",
      pais: initialData.ubicacion?.pais || "",
    });

    setImagenPreview(initialData.imagenPerfil || "");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setCurrentStep((s) => s + 1);
  const handleBack = () => setCurrentStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const success = await onSubmit({
        ...formData,
        imagenArchivo,
      });

      if (!success) setError("No se pudo guardar");
    } catch (err) {
      console.error(err);
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagenArchivo(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Editar perfil" : "Completar perfil"}
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* PASOS */}
      {currentStep === 0 && (
        <>
          <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
          <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" />
        </>
      )}

      {currentStep === 1 && (
        <select name="genero" value={formData.genero} onChange={handleChange}>
          <option value="">Género</option>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
        </select>
      )}

      {currentStep === 2 && (
        <>
          <input name="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="Ciudad" />
          <input name="pais" value={formData.pais} onChange={handleChange} placeholder="País" />
        </>
      )}

      {currentStep === 3 && (
        <div>
          <label>Foto de perfil</label>

          <input type="file" accept="image/*" onChange={handleImagenChange} />

          {imagenPreview && (
            <img src={imagenPreview} className="w-24 h-24 object-cover mt-2 rounded-xl" />
          )}
        </div>
      )}

      {/* BOTONES */}
      <div className="flex justify-between mt-4">
        <button onClick={handleBack} disabled={currentStep === 0}>
          Atrás
        </button>

        {currentStep < steps.length - 1 ? (
          <button onClick={handleNext}>Siguiente</button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        )}
      </div>
    </div>
  );
};

PerfilFormBase.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
};

export default PerfilFormBase;
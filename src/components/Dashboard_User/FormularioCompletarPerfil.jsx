import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import perfil1 from "../../assets/poli.jpg";

import { useNavigate } from "react-router-dom";
import storeProfile from "../../context/storeProfile";

const FormularioCompletarPerfil = ({ initialData, onSuccess, onCancel }) => {
  const { updateProfile, loadProfile } = storeProfile();
  const navigate = useNavigate();

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
  

  // Cargar datos iniciales solo una vez
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "genero") {
      setShowGeneroWarning(value === "otro");
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImagenArchivo(file);
    setImagenPreview(URL.createObjectURL(file));
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
    ) {
      return "Género y orientación no pueden ser 'otro' al mismo tiempo";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (imagenArchivo) {
        data.append("imagenPerfil", imagenArchivo);
      }

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

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
       style={{ backgroundImage: `url(${perfil1})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Completa tu perfil
        </h2>

        {error && (
          <div className="text-red-600 text-center mb-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <textarea
            name="biografia"
            placeholder="Biografía"
            value={formData.biografia}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="intereses"
            placeholder="Intereses (separados por coma)"
            value={formData.intereses}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Seleccione género</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="otro">Otro</option>
          </select>

          {showGeneroWarning && <p className="text-sm text-red-500"></p>}

          <select
            name="orientacion"
            value={formData.orientacion}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Seleccione orientación</option>
            <option value="heterosexual">Heterosexual</option>
            <option value="homosexual">Homosexual</option>
            <option value="bisexual">Bisexual</option>
            <option value="otro">Otro</option>
          </select>

          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="pais"
            placeholder="País"
            value={formData.pais}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            className="border p-2 rounded"
          />

          {imagenPreview && (
            <img
              src={imagenPreview}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          )}

          <div className="flex gap-4 justify-center mt-4">
            <button
              type="submit"
              disabled={guardando}
              className="bg-sky-500 text-white px-6 py-2 rounded"
            >
              {guardando ? "Guardando..." : "Guardar Perfil"}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-red-500 text-white px-6 py-2 rounded"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
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

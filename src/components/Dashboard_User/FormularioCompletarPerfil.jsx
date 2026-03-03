// src/components/FormularioCompletarPerfil.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import usePerfilUsuarioAutenticado from "../../hooks/usePerfilUsuarioAutenticado"; 
import perfil1 from "../../assets/poli.jpg";
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

// Este es el componente del formulario, que se encarga solo de la UI
const Formulario = ({ initialData, onSave, onCancel, guardar, error }) => {
  const [formData, setFormData] = React.useState({
    nombre: initialData?.nombre || "",
    apellido: initialData?.apellido || "",
    biografia: initialData?.biografia || "",
    intereses: initialData?.intereses ? initialData.intereses.join(", ") : "",
    genero: initialData?.genero || "",
    orientacion: initialData?.orientacion || "",
    fechaNacimiento: initialData?.fechaNacimiento
      ? initialData.fechaNacimiento.split("T")[0]
      : "",
    ciudad: initialData?.ubicacion?.ciudad || "",
    pais: initialData?.ubicacion?.pais || "",
  });

  const [imagenArchivo, setImagenArchivo] = React.useState(null);
  const [imagenPreview, setImagenPreview] = React.useState(initialData?.imagenPerfil || "");
  const [showGeneroWarning, setShowGeneroWarning] = React.useState(false);

  React.useEffect(() => {
    setFormData({
      nombre: initialData?.nombre || "",
      apellido: initialData?.apellido || "",
      biografia: initialData?.biografia || "",
      intereses: initialData?.intereses ? initialData.intereses.join(", ") : "",
      genero: initialData?.genero || "",
      orientacion: initialData?.orientacion || "",
      fechaNacimiento: initialData?.fechaNacimiento
        ? initialData.fechaNacimiento.split("T")[0]
        : "",
      ciudad: initialData?.ubicacion?.ciudad || "",
      pais: initialData?.ubicacion?.pais || "",
    });
    setImagenPreview(initialData?.imagenPerfil || "");
    setImagenArchivo(null);
    setShowGeneroWarning(initialData?.genero === 'otro');
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'genero') {
      setShowGeneroWarning(value === 'otro');
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenArchivo(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const interesesArray = formData.intereses
    .split(",")
    .map(i => i.trim())
    .filter(Boolean);

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("apellido", formData.apellido);
    data.append("biografia", formData.biografia);
    data.append("genero", formData.genero);
    data.append("orientacion", formData.orientacion);
    data.append("fechaNacimiento", formData.fechaNacimiento);
    data.append("intereses", interesesArray.join(','));
    data.append("ubicacion[ciudad]", formData.ciudad);
    data.append("ubicacion[pais]", formData.pais);

    if (imagenArchivo) {
      data.append("imagenPerfil", imagenArchivo);
    }

    onSave(data, formData.genero, formData.orientacion);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <div className="text-red-600 font-semibold mb-2">{error}</div>
      )}
      <label className="block mb-4">
        <span className="block font-semibold mb-1">Nombre:</span>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Apellido:</span>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Biografía:</span>
        <textarea
          name="biografia"
          value={formData.biografia}
          onChange={handleChange}
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
          rows={4}
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Intereses (separados por coma):</span>
        <input
          type="text"
          name="intereses"
          value={formData.intereses}
          onChange={handleChange}
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Género:</span>
        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          required
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
        >
          <option value="" disabled hidden>Seleccione</option>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
          <option value="otro">Otro</option>
        </select>
        {showGeneroWarning && (
          <p className="text-sm text-red-500 mt-1">
            Nota: Seleccionar 'Otro' no te permitirá ver a otros estudiantes.
          </p>
        )}
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Orientación:</span>
        <select
          name="orientacion"
          value={formData.orientacion}
          onChange={handleChange}
          required
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
        >
          <option value="" disabled hidden>Seleccione</option>
          <option value="heterosexual">Heterosexual</option>
          <option value="homosexual">Homosexual</option>
          <option value="bisexual">Bisexual</option>
          <option value="otro">Otro</option>
        </select>
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Fecha de nacimiento:</span>
        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Ciudad:</span>
        <input
          type="text"
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          required
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">País:</span>
        <input
          type="text"
          name="pais"
          value={formData.pais}
          onChange={handleChange}
          required
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
        />
      </label>

      <label className="block mb-4">
        <span className="block font-semibold mb-1">Imagen de perfil:</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
          disabled={guardar}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
        />
      </label>

      {imagenPreview && (
        <img src={imagenPreview} alt="Vista previa" className="w-32 h-32 object-cover rounded-full mx-auto" />
      )}
      <div className="flex justify-between gap-4 mt-4">
        <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={guardar}>
          {guardar ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={guardar}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

// --- EL COMPONENTE PRINCIPAL QUE SE EXPORTARÁ ---
const FormularioCompletarPerfil = () => {
  const navigate = useNavigate();
  const { perfil, loadingPerfil, actualizarPerfil } = usePerfilUsuarioAutenticado();
  const [guardando, setGuardando] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (loadingPerfil) {
    return <p className="text-center p-4">Cargando perfil para editar...</p>;
  }

  if (!perfil) {
    return <p className="text-center text-red-500 p-4">No se pudo cargar el perfil para editar.</p>;
  }

  const handleSave = async (formData, genero, orientacion) => {
    setGuardando(true);
    setError(null);
    
    if (genero === "otro" && orientacion.toLowerCase() === "otro") {
      const errorMsg = "Género y orientación no pueden ser 'otro' al mismo tiempo.";
      setError(errorMsg);
      toast.error(errorMsg);
      setGuardando(false);
      return false;
    }

    try {
      const success = await actualizarPerfil(formData);
      toast.success("Perfil actualizado correctamente!");
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 50);
      return true;
    } catch (err) {
      const errorMsg = "Error al guardar el perfil.";
      setError(errorMsg);
      console.error("Error al guardar el perfil:", err);
      toast.error(errorMsg);
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const handleCancel = () => {
    toast.info("Edición de perfil cancelada.");
    setTimeout(() => {
      navigate("/user/dashboard");
    }, 50);
  };

  return (
  <div
    className="h-screen flex items-center justify-center bg-cover bg-center relative"
    style={{ backgroundImage: `url(${perfil1})` }}
  >
    <div className="absolute inset-0 bg-black opacity-40"></div>

    <div className="relative w-full sm:max-w-lg md:max-w-2xl mx-auto p-2 sm:p-4 bg-white rounded-lg shadow-md max-h-screen overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Editar Perfil</h2>
      <Formulario
        initialData={perfil}
        onSave={handleSave}
        onCancel={handleCancel}
        guardar={guardando}
        error={error}
      />
    </div>
  </div>
);

};
export default FormularioCompletarPerfil;

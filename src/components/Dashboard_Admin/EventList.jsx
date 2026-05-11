import { useState, useEffect } from "react";
import DatePicker from "../../components/Dashboard_Admin/Eventos/DatePicker";
import useAdminEvents from "../../hooks/Admin/useAdminEvents";

const EventList = () => {
  const {
    eventos,
    loading,
    serverError,
    serverSuccess,
    setServerError,
    setServerSuccess,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    obtenerEventos,
  } = useAdminEvents();

  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0); // ← para resetear input file
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    lugar: "",
    hora: "",
    imagen: null,
  });

  // ─── EFECTO: Limpiar formulario después del mensaje de éxito ─────────────────
  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        setServerSuccess("");
        setServerError(""); // ← limpia error también
        setEditId(null);
        setForm({
          titulo: "",
          descripcion: "",
          fecha: "",
          lugar: "",
          hora: "",
          imagen: null,
        });
        setFileInputKey((prev) => prev + 1);
      }, 2000); // Espera 2 segundos antes de limpiar

      return () => clearTimeout(timer);
    }
  }, [serverSuccess]);

  useEffect(() => {
  if (serverError) {
    const timer = setTimeout(() => {
      setServerError("");
    }, 5000); // errores duran un poco más

    return () => clearTimeout(timer);
  }
}, [serverError]);

  // ─── FUNCIONES DE VALIDACIÓN DE FECHA Y HORA ───────────────────────

  /**
   * Verifica si un evento está caducado (fecha y hora ya pasaron)
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @param {string} hora - Hora en formato HH:mm
   * @returns {boolean} true si el evento está caducado
   */
  const isEventExpired = (fecha, hora) => {
    if (!fecha || !hora) return false;
    const eventDateTime = new Date(`${fecha}T${hora}`);
    const now = new Date();
    return eventDateTime < now;
  };

  /**
   * Valida que la fecha y hora del evento no sean anteriores a la actual
   * Considera la combinación correcta de fecha y hora
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @param {string} hora - Hora en formato HH:mm
   * @returns {object} { valid: boolean, message: string }
   */
  const isValidEventDateTime = (fecha, hora) => {
    if (!fecha || !hora) {
      return { valid: false, message: "Fecha y hora son requeridas" };
    }

    const eventDateTime = new Date(`${fecha}T${hora}`);
    const now = new Date();

    // Validar que la combinación de fecha y hora sea válida
    if (isNaN(eventDateTime.getTime())) {
      return { valid: false, message: "Fecha u hora inválida" };
    }

    // Validar que no sea una fecha anterior a la actual
    if (eventDateTime < now) {
      return {
        valid: false,
        message:
          "No se puede crear un evento en una fecha y hora pasada. Selecciona una fecha y hora futura.",
      };
    }

    return { valid: true, message: "" };
  };

  const iniciarEdicion = (evento) => {
    setEditId(evento._id);
    setForm({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha?.slice(0, 10) || "",
      lugar: evento.lugar,
      hora: evento.hora,
      imagen: null,
    });
    setFileInputKey((prev) => prev + 1); // ← resetea visualmente el input
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen") {
      const archivo = files[0];
      /* console.log("📁 Imagen seleccionada:", archivo);  */ // ← DEBUG
      setForm((prev) => ({ ...prev, imagen: archivo }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar fecha y hora antes de procesar
    const validation = isValidEventDateTime(form.fecha, form.hora);
    if (!validation.valid) {
      setServerError(validation.message);
      return;
    }

    // Si estamos editando, validar que el evento no esté caducado
    if (editId) {
      // Buscar el evento original para verificar su fecha actual
      const eventoOriginal = eventos.find((ev) => ev._id === editId);
      if (
        eventoOriginal &&
        isEventExpired(eventoOriginal.fecha?.slice(0, 10), eventoOriginal.hora)
      ) {
        setServerError(
          "No se puede editar un evento que ya ha caducado. El evento ya pasó de fecha.",
        );
        return;
      }
    }

    setSaving(true);

    // ── DEBUG ──────────────────────────────────────────
    //console.log("📋 Estado del form al submit:", form);
    //console.log("🖼️  imagen en estado:", form.imagen);
    // ──────────────────────────────────────────────────

    try {
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("descripcion", form.descripcion);
      formData.append("fecha", form.fecha);
      formData.append("lugar", form.lugar);
      formData.append("hora", form.hora);
      if (form.imagen) {
        formData.append("imagen", form.imagen);
        /* console.log("✅ imagen agregada al FormData:", form.imagen.name, form.imagen.size, "bytes"); */ // ← DEBUG
      } else {
        /* console.warn("⚠️  No hay imagen en el estado, no se agrega al FormData"); */
        // ← DEBUG
      }

      if (editId) {
        await actualizarEvento(editId, formData);
        setServerSuccess("Evento actualizado");
        setEditId(null);
      } else {
        await crearEvento(formData);
        setServerSuccess("Evento creado correctamente");
      }

      obtenerEventos();
    } catch (err) {
      /* console.error("❌ Error al guardar evento:", err); */ // ← DEBUG
      setServerError(err.message || "Error al guardar evento");
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id, fechaEvento, horaEvento) => {
    if (!id) {
      setServerError("ID inválido");
      return;
    }

    // Validar que el evento no esté caducado
    if (isEventExpired(fechaEvento?.slice(0, 10), horaEvento)) {
      setServerError(
        "No se puede eliminar un evento que ya ha caducado. El evento ya pasó de fecha.",
      );
      return;
    }

    if (window.confirm("¿Eliminar evento?")) {
      try {
        await eliminarEvento(id, fechaEvento);
        setServerSuccess("Evento eliminado");
        obtenerEventos();
      } catch (err) {
        setServerError(err.message || "Error al eliminar evento");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* FORMULARIO */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {editId ? "Editar Evento" : "Crear Evento"}
          </h2>

          {serverError && (
            <p className="text-red-600 text-sm text-center mb-2 bg-red-50 border border-red-200 rounded p-2">
              {serverError}
            </p>
          )}

          {serverSuccess && (
            <p className="text-green-600 text-sm text-center mb-2 bg-green-50 border border-green-200 rounded p-2">
              {serverSuccess}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Título del evento"
              required
              disabled={saving}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción detallada"
              required
              disabled={saving}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <DatePicker
                value={form.fecha}
                onChange={handleChange}
                name="fecha"
              />

              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                required
                disabled={saving}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              name="lugar"
              value={form.lugar}
              onChange={handleChange}
              placeholder="Lugar"
              required
              disabled={saving}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* ← key fuerza reset visual del input file */}
            <input
              key={fileInputKey}
              type="file"
              name="imagen"
              onChange={handleChange}
              disabled={saving}
              accept="image/*"
              className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Guardando..."
                  : editId
                    ? "Actualizar Evento"
                    : "Crear Evento"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setFileInputKey((prev) => prev + 1);
                    setForm({
                      titulo: "",
                      descripcion: "",
                      fecha: "",
                      lugar: "",
                      hora: "",
                      imagen: null,
                    });
                  }}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LISTA DE EVENTOS */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Eventos Creados
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Cargando eventos...</p>
          ) : eventos.length === 0 ? (
            <p className="text-center text-gray-500">No hay eventos creados.</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto p-2 -m-2">
              {eventos.map((ev) => {
                const fechaEvento = new Date(
                  `${ev.fecha.split("T")[0]}T${ev.hora}:00`,
                );

                return (
                  <div
                    key={ev._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="mb-4 sm:mb-0">
                      {/* ← DEBUG: muestra si el evento tiene imagen guardada */}
                      {ev.imagen && (
                        <img
                          src={ev.imagen}
                          alt={ev.titulo}
                          className="w-16 h-16 object-cover rounded-lg mb-2"
                          onError={(e) => {
                            console.warn(
                              "❌ Error cargando imagen:",
                              ev.imagen,
                            );
                            e.target.style.display = "none";
                          }}
                          /* onLoad={() => console.log("✅ Imagen cargada:", ev.imagen)} */ // ← DEBUG
                        />
                      )}
                      <h3 className="font-semibold text-lg text-gray-900">
                        {ev.titulo}
                      </h3>
                      <p className="text-sm text-gray-600">{ev.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {fechaEvento.toLocaleString("es-EC", {
                          timeZone: "America/Guayaquil",
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        {ev.lugar}
                      </p>
                      {/* ← DEBUG: muestra la URL de imagen en texto */}
                      {/* <p className="text-[10px] text-gray-400 mt-1 break-all">
                      img: {ev.imagen || "sin imagen"}
                    </p> */}

                      {ev.asistentes && ev.asistentes.length > 0 && (
                        <div className="mt-4">
                          <p className="font-bold text-sm text-gray-700">
                            Asistentes ({ev.asistentes.length}):
                          </p>
                          <ul className="list-disc list-inside text-gray-600 text-sm">
                            {ev.asistentes.map((asistente) => (
                              <li key={asistente._id} className="ml-4">
                                {asistente.nombre} {asistente.apellido}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => iniciarEdicion(ev)}
                        disabled={isEventExpired(
                          ev.fecha?.slice(0, 10),
                          ev.hora,
                        )}
                        className="p-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                        title={
                          isEventExpired(ev.fecha?.slice(0, 10), ev.hora)
                            ? "No se puede editar eventos caducados"
                            : "Editar"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                          <path
                            fillRule="evenodd"
                            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          handleEliminar(ev._id, ev.fecha, ev.hora)
                        }
                        disabled={isEventExpired(
                          ev.fecha?.slice(0, 10),
                          ev.hora,
                        )}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                        title={
                          isEventExpired(ev.fecha?.slice(0, 10), ev.hora)
                            ? "No se puede eliminar eventos caducados"
                            : "Eliminar"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {serverError && (
            <p className="text-red-600 mt-4 text-center">{serverError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;

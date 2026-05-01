import fetchDataBackend from "../../../../helpers/fetchDataBackend";

const notificacionesService = {
  getAll: () =>
    fetchDataBackend("estudiantes/notificaciones", null, "GET"),

  markAsRead: (id) =>
    fetchDataBackend(
      `estudiantes/notificaciones/${id}/leido`,
      {},
      "PUT"
    ),
};

export default notificacionesService;
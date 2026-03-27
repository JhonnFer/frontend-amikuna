// src/hooks/useAdminStrikes.js
import useFetch from "../useFetch";

const useAdminStrikes = () => {
  const { fetchDataBackend } = useFetch();

  // Ver los strikes del usuario autenticado
  const obtenerStrikes = async () => {
    return await fetchDataBackend("mis-strikes", null, "GET");
  };

  // Ver detalle de una denuncia (incluye chat si existe)
  const obtenerDenunciaDetalle = async (strikeId) => {
    return await fetchDataBackend(`denuncias/${strikeId}`, null, "GET");
  };

  // Eliminar match y chat asociado a una denuncia
  const eliminarMatchYChat = async (strikeId) => {
    return await fetchDataBackend(`denuncias/${strikeId}/eliminar-match-chat`, null, "POST");
  };

  // Responder a un strike (crea respuesta y notificación)
  const responderStrike = async (strikeId, datosRespuesta) => {
    return await fetchDataBackend(`responder-strike/${strikeId}`, datosRespuesta, "POST");
  };

  return {
    obtenerStrikes,
    obtenerDenunciaDetalle,
    eliminarMatchYChat,
    responderStrike,
  };
};

export default useAdminStrikes;
import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Modal from "../components/modal/modal";
import ModalTreatments from "../components/treatments/Modal";

import { io } from "socket.io-client";

import SwipeCards from "../components/Dashboard_User/SwipeCards";
import EventosPublicados from "../components/Dashboard_User/EventosPublicados";
import BotonNotificaciones from "../components/Dashboard_User/BotonNotificaciones";
import ChatConversacion from "../components/Dashboard_User/ChatConversacion";
import ModalPayment from "../components/treatments/ModalPayment";
import StrikeForm from "../components/Dashboard_User/StrikeForm";
import ChatbotEstudiante from "../components/Dashboard_User/ChatbotEstudiante";

import useEventosEstudiante from "../hooks/useEventosEstudiante"; // Usamos tu hook
import usePerfilUsuarioAutenticado from "../hooks/usePerfilUsuarioAutenticado";
import useMatches from "../hooks/useMatches";
import useNotificaciones from "../hooks/useNotificaciones";
import useChat from "../hooks/useChat";
import useAsistenciaEvento from "../hooks/useAsistenciaEvento";
import useSeguirUsuario from "../hooks/useSeguirUsuario";
import FormularioCompletarPerfil from "../components/Dashboard_User/FormularioCompletarPerfil";
const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");

const Dashboard_Users = () => {
  const navigate = useNavigate();
  
  // console.log("[Dashboard_Users] perfilCompleto:", perfilCompleto);
  const {
    perfil: profile,
    loadingPerfil,
    cargarPerfil,
  } = usePerfilUsuarioAutenticado();
  const { matches, loading: loadingMatches } = useMatches();
  const usuarios = matches;
  const [mostrarEditarPerfil, setMostrarEditarPerfil] = useState(false);

  // 🔒 GUARDIA: Si no hay usuario autenticado, redirigir al login
  useEffect(() => {
    const user = storeAuth.getState().user;
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Si el perfil está incompleto, mostrar formulario de completar perfil
  // (Ahora manejado en el return principal arriba)
  // useEffect removido porque se maneja en el return

  // Cargar el perfil cuando el Dashboard se monta
  useEffect(() => {
    if (!loadingPerfil && !profile) {
      cargarPerfil();
    }
    // Solo depende de loadingPerfil y cargarPerfil para evitar bucles
  }, [loadingPerfil, profile, cargarPerfil]);

  // Usamos tu hook que obtiene eventos y la función para recargarlos
  const {
    eventos,
    loading: loadingEventos,
    obtenerEventos,
  } = useEventosEstudiante();

  const { solicitudes, loading: loadingSolicitudes } = useNotificaciones();

  // Pasamos 'obtenerEventos' al hook de asistencia para que recargue la lista
  const {
    confirmarAsistencia,
    rechazarAsistencia,
    cargando: cargandoAsistencia,
  } = useAsistenciaEvento(obtenerEventos);

  const {
    abrirChat,
    obtenerMensajes,
    enviarMensaje: enviarMensajeApi,
  } = useChat();

  const { seguirUsuario, cargando: cargandoSeguir } = useSeguirUsuario();

  const [amigoSeleccionado, setAmigoSeleccionado] = useState(null);
  const [mostrarModalTratamiento, setMostrarModalTratamiento] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const [mostrarModalAporte, setMostrarModalAporte] = useState(false);
  const [aporteSeleccionado, setAporteSeleccionado] = useState(null);
  const [chatIdsCache, setChatIdsCache] = useState({});
  const [mensajes, setMensajes] = useState([]);
  const [mostrarChatbot, setMostrarChatbot] = useState(false);

  // Tu estado para controlar la vista de eventos
  const [eventosExpandidos, setEventosExpandidos] = useState(false);

  useEffect(() => {
    console.log("Estado de chatInfo actualizado:", chatInfo);
  }, [chatInfo]);

  useEffect(() => {
    if (!chatInfo?.chatId) {
      setMensajes([]);
      return;
    }

    obtenerMensajes(chatInfo.chatId).then((mensajesCargados) => {
      setMensajes(mensajesCargados);
    });

    socket.emit("chat:join", chatInfo.chatId);

    socket.on("mensaje:nuevo", (data) => {
      if (data.chatId === chatInfo.chatId) {
        setMensajes((prevMensajes) => [...prevMensajes, data.mensaje]);
      }
    });

    return () => {
      socket.off("mensaje:nuevo");
      socket.emit("chat:leave", chatInfo.chatId);
    };
  }, [chatInfo?.chatId, obtenerMensajes]);

  const handleLogout = useCallback(() => {
    storeAuth.getState().logout();
    window.location.href = "/login";
  }, []);

  const handleAbrirChat = useCallback(
    async (match) => {
      if (!profile?._id) return;

      console.log("Clic en match:", match._id);

      const sortedIds = [profile._id, match._id].sort().join("-");
      let chatIdFromCache = chatIdsCache[sortedIds];
      let chatIdToUse = chatIdFromCache;

      if (!chatIdFromCache) {
        console.log("ChatId no encontrado en caché. Llamando al backend...");
        const respuestaChat = await abrirChat(match._id);
        if (respuestaChat && respuestaChat.chatId) {
          chatIdToUse = respuestaChat.chatId;
          setChatIdsCache((prev) => ({ ...prev, [sortedIds]: chatIdToUse }));
        } else {
          console.error(
            "Error al abrir el chat: La respuesta de la API no contiene un chatId válido.",
          );
          return;
        }
      } else {
        console.log("ChatId encontrado en caché:", chatIdToUse);
      }

      setChatInfo((prevChatInfo) => {
        if (prevChatInfo?.chatId === chatIdToUse) {
          return prevChatInfo;
        }
        return {
          chatId: chatIdToUse,
          nombre: match.nombre,
          imagenPerfil: match.imagenPerfil,
        };
      });
    },
    [abrirChat, chatIdsCache, profile],
  );

  const handleCerrarChat = useCallback(() => {
    setChatInfo(null);
  }, []);

  const handleEnviarMensaje = useCallback(
    async (contenido) => {
      if (!chatInfo?.chatId || !contenido) return;

      const nuevoMensajeTemp = {
        emisor: {
          _id: profile._id,
          nombre: profile.nombre,
          imagenPerfil: profile.imagenPerfil,
        },
        contenido,
        createdAt: new Date(),
        _id: Date.now().toString(),
      };
      setMensajes((prevMensajes) => [...prevMensajes, nuevoMensajeTemp]);

      await enviarMensajeApi(chatInfo.chatId, contenido);
    },
    [enviarMensajeApi, chatInfo, profile],
  );

  const handleOpenAporteModal = useCallback((monto, concepto, descripcion) => {
    setAporteSeleccionado({ monto, concepto, descripcion });
    setMostrarModalAporte(true);
  }, []);

  const handleAporteSuccess = useCallback(() => {
    setMostrarModalAporte(false);
    setAporteSeleccionado(null);
  }, []);

  const matchesMutuos = useMemo(() => {
    if (!profile?.seguidores || !profile?.siguiendo || !matches) {
      return [];
    }
    const misSeguidores = new Set(profile.seguidores);
    const miListaDeSeguidos = new Set(profile.siguiendo);

    return matches.filter(
      (match) =>
        misSeguidores.has(match._id) && miListaDeSeguidos.has(match._id),
    );
  }, [matches, profile]);

  // Tu lógica para filtrar eventos
  const eventosDisponibles = useMemo(() => {
    if (!eventos || !profile?._id) return [];

    return eventos.filter((evento) => {
      const asistentesIds = evento.asistentes.map((a) => a._id);
      const noAsistiranIds = evento.noAsistiran.map((a) => a._id);

      const yaInteractuo =
        asistentesIds.includes(profile._id) ||
        noAsistiranIds.includes(profile._id);

      return !yaInteractuo;
    });
  }, [eventos, profile]);

  if (loadingPerfil || !profile || !profile._id) {
    return <div>Cargando perfil...</div>;
  }

  // Si el perfil no está completo, SOLO mostrar el modal de completar perfil
  const perfilIncompleto =
  !profile?.genero ||
  !profile?.orientacion ||
  !profile?.ubicacion?.ciudad;

if (perfilIncompleto) {
  return (
    <Modal
      isOpen={true}
      title="Completa tu perfil"
      showCloseButton={false}
      onClose={() => {}}
    >
      <p className="text-center text-gray-600 mb-4">
        Necesitamos que completes tu perfil para acceder al dashboard
      </p>

      <FormularioCompletarPerfil
        initialData={profile}
        onSuccess={async () => {
          await cargarPerfil();
        }}
      />
    </Modal>
  );
}

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Estilos del perfil de tu compañero */}
        <aside className="hidden md:block w-[300px] xl:w-[400px] bg-white p-4 overflow-y-auto shadow">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-rose-800 border-b-2 border-bg-red-900 pb-2">
              Tu Perfil
            </h1>
          </header>
          <>
            {profile && (
              <>
                <img
                  src={
                    profile.imagenPerfil && profile.imagenPerfil !== ""
                      ? profile.imagenPerfil
                      : "https://placehold.co/150x150"
                  }
                  alt="Tu foto de perfil"
                  className="rounded-full w-32 h-32 object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-center mt-4 text-gray-800">
                  {profile.nombre || "Sin nombre"}
                </h3>
                <p className="text-center text-gray-500 italic mb-4">
                  {profile.biografia && profile.biografia !== ""
                    ? profile.biografia
                    : "Sin biografía definida"}
                </p>
                <div className="bg-gray-50 rounded-xl p-4 shadow-sm space-y-2">
                  <p>
                    <strong className="text-rose-800">Género:</strong>{" "}
                    {profile.genero && profile.genero !== ""
                      ? profile.genero
                      : "No definido"}
                  </p>
                  <p>
                    <strong className="text-rose-800">Orientación:</strong>{" "}
                    {profile.orientacion && profile.orientacion !== ""
                      ? profile.orientacion
                      : "No definida"}
                  </p>
                  <p>
                    <strong className="text-rose-800">Intereses:</strong>{" "}
                    {Array.isArray(profile.intereses) &&
                    profile.intereses.length > 0
                      ? profile.intereses.join(", ")
                      : "No definidos"}
                  </p>
                  <p>
                    <strong className="text-rose-800">
                      Fecha de nacimiento:
                    </strong>{" "}
                    {profile.fechaNacimiento &&
                    typeof profile.fechaNacimiento === "string"
                      ? profile.fechaNacimiento.split("T")[0]
                      : "No definida"}
                  </p>
                </div>
              </>
            )}

            <hr className="my-6 border-gray-300" />
          </>
          <StrikeForm />
        </aside>

        <main className="flex flex-col flex-1 min-w-0 p-4 gap-4 overflow-y-auto max-w-full md:max-w-3xl mx-auto">
          {/* Estilos de botones de tu compañero */}
          <div className="flex flex-wrap justify-start rounded-lg items-center md:gap-10 gap-14 mb-6 bg-[#D19AA5] max-w-full">
            <button
              onClick={() =>
                handleOpenAporteModal(
                  10,
                  "Apoyo a la app",
                  "Contribución para mejoras de la plataforma Amikuna",
                )
              }
              className="bg-red-900 text-white px-2 py-1 text-sm rounded-md md:px-4 md:py-2 md:text-base"
            >
              Realizar Aporte
            </button>
            <div className="flex flex-col items-center">
              <button
                onClick={() => setMostrarEditarPerfil(true)}
                title="Editar perfil"
              >
                <FaUser className="text-gray-600 hover:text-blue-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              </button>
              <span className="text-xs text-gray-600 mt-1 text-center block">
                Editar perfil
              </span>
            </div>
            <div className="flex flex-col items-center">
              <BotonNotificaciones
                solicitudes={solicitudes}
                loading={loadingSolicitudes}
                onFollow={seguirUsuario}
              />
              <span className="text-xs text-gray-600 mt-1">Notificaciones</span>
            </div>
            <button
              onClick={() => setMostrarChatbot(!mostrarChatbot)}
              title="chatbot"
            >
              <div className="flex flex-col items-center">
                <span className="text-lg">💬</span>
                <span className="text-xs text-gray-700">Chat Bot</span>
              </div>
            </button>
            <button onClick={handleLogout} title="Cerrar sesión">
              <div className="flex flex-col items-center">
                <FiLogOut className="text-gray-600 hover:text-red-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                <span className="text-xs text-gray-700">Cerrar sesión</span>
              </div>
            </button>
          </div>

          {mostrarChatbot && (
            <div className="fixed bottom-4 right-4 w-80 p-4 bg-white rounded shadow-lg z-50">
              {/* Estilo del botón de cerrar chatbot de tu compañero */}
              <button
                onClick={() => setMostrarChatbot(false)}
                className="mb-2 text-red-600 font-bold flex items-center gap-2"
              >
                ❌{" "}
                <span className="text-gray-800 font-semibold">Chat Bot 😎</span>
              </button>
              <ChatbotEstudiante />
            </div>
          )}

          {/* NUEVO CONTENEDOR PARA EL CONTENIDO DINÁMICO */}
          <div className="flex-1 relative">
            {loadingMatches ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p>Cargando usuarios para swipes...</p>
              </div>
            ) : (
              <SwipeCards
                usuarios={usuarios || []}
                onFollow={seguirUsuario}
                cargandoSeguir={cargandoSeguir}
              />
            )}
          </div>
        </main>

        <aside className="hidden lg:block w-[400px] bg-white p-4 overflow-y-auto shadow">
          {/* Aquí usamos tu lógica de eventos */}
          <EventosPublicados
            eventos={eventosDisponibles} // Usamos tu lista filtrada
            loading={loadingEventos}
            onConfirmar={confirmarAsistencia}
            onRechazar={rechazarAsistencia}
            cargandoAsistencia={cargandoAsistencia}
            // Pasamos las props de expandir/colapsar
            isExpanded={eventosExpandidos}
            toggleExpand={() => setEventosExpandidos(!eventosExpandidos)}
          />
          <h2 className="text-gray-500 text-sm uppercase mb-2 mt-4">
            Matches con quien chatear!
          </h2>
          <ul>
            {Array.isArray(matchesMutuos) && matchesMutuos.length > 0 ? (
              matchesMutuos.map((match) => (
                <li
                  key={match._id}
                  onClick={() => handleAbrirChat(match)}
                  className="cursor-pointer flex items-center gap-3 mb-3 hover:bg-gray-100 p-2 rounded"
                >
                  <img
                    src={match.imagenPerfil || "https://placehold.co/40x40"}
                    alt={match.nombre}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{match.nombre}</span>
                </li>
              ))
            ) : (
              <li>No hay matches mutuos.</li>
            )}
          </ul>
        </aside>
      </div>

      {amigoSeleccionado && (
        <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto">
          <button
            onClick={() => setAmigoSeleccionado(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
          >
            ×
          </button>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Info del amigo
          </h2>
          <div className="text-center">
            <img
              src={
                amigoSeleccionado.imagenPerfil || "https://placehold.co/150x150"
              }
              alt={amigoSeleccionado.nombre}
              className="rounded-full w-32 h-32 object-cover mx-auto mb-4"
            />
            <h3 className="text-lg font-bold">{amigoSeleccionado.nombre}</h3>
            <p>
              Ciudad: {amigoSeleccionado.ubicacion?.ciudad || "No definida"}
            </p>
            <p>
              Intereses:{" "}
              {amigoSeleccionado.intereses?.join(", ") || "No definidos"}
            </p>
          </div>
        </div>
      )}

      {chatInfo && profile?._id && (
        <ChatConversacion
          chatInfo={chatInfo}
          miId={profile._id}
          onCloseChat={handleCerrarChat}
          mensajes={mensajes}
          onEnviarMensaje={handleEnviarMensaje}
        />
      )}

      {mostrarModalTratamiento && (
        <ModalTreatments
          patientID={profile._id}
          onClose={() => setMostrarModalTratamiento(false)}
        />
      )}

      {mostrarModalAporte && aporteSeleccionado && (
          <Modal
    isOpen={mostrarModalAporte}
    onClose={() => setMostrarModalAporte(false)}
    title="Realizar aporte"
  >
    <ModalPayment
      aporte={aporteSeleccionado}
      onClose={() => setMostrarModalAporte(false)}
      onPaymentSuccess={handleAporteSuccess}
    />
  </Modal>
)}

      <Modal
        isOpen={mostrarEditarPerfil}
        title="Editar perfil"
        showCloseButton={true}
        onClose={() => setMostrarEditarPerfil(false)}
      >
        <FormularioCompletarPerfil
          initialData={profile}
          onSuccess={async () => {
            await cargarPerfil();
            setMostrarEditarPerfil(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Dashboard_Users;

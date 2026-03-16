import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";

import Modal from "../components/modal/modal";
import ModalTreatments from "../components/treatments/Modal";

import { io } from "socket.io-client";



import ChatConversacion from "../components/Dashboard_User/ChatConversacion";
import ModalPayment from "../components/treatments/ModalPayment";
import StrikeForm from "../components/Dashboard_User/StrikeForm";

import SidebarIzquierdo from "../components/Dashboard_User/SidebarIzquierdo";
import MainCentral from "../components/Dashboard_User/MainCentral";
import SidebarDerecho from "../components/Dashboard_User/SidebarDerecho";

import useEventosEstudiante from "../hooks/useEventosEstudiante";
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
  const [mostrarGaleriaFotos, setMostrarGaleriaFotos] = useState(false);
  const [fotosSeleccionadas, setFotosSeleccionadas] = useState([]);
  const [mostrarModalStrike, setMostrarModalStrike] = useState(false);

  // galeria de fotos
  const subirFotosGaleria = async () => {
    try {
      if (fotosSeleccionadas.length === 0) {
        alert("Selecciona al menos una foto");
        return;
      }

      const formData = new FormData();

      fotosSeleccionadas.forEach((foto) => {
        formData.append("imagenesGaleria", foto);
      });

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}estudiantes/galeria`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storeAuth.getState().token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg);

      await cargarPerfil(); // refresca perfil
      setFotosSeleccionadas([]);
      alert("Fotos subidas correctamente");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
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
    profile &&
    (!profile.genero || !profile.orientacion || !profile.ubicacion?.ciudad);

  if (!loadingPerfil && perfilIncompleto) {
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
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* ASIDE IZQUIERDO */}
      <SidebarIzquierdo
        profile={profile}
        setMostrarGaleriaFotos={setMostrarGaleriaFotos}
      />
      
{/* MAIN CENTRAL */}
<MainCentral
  handleOpenAporteModal={handleOpenAporteModal}
  setMostrarEditarPerfil={setMostrarEditarPerfil}
  setMostrarGaleriaFotos={setMostrarGaleriaFotos}
  solicitudes={solicitudes}
  loadingSolicitudes={loadingSolicitudes}
  seguirUsuario={seguirUsuario}
  setMostrarChatbot={setMostrarChatbot}
  mostrarChatbot={mostrarChatbot}
  setMostrarModalStrike={setMostrarModalStrike}
  handleLogout={handleLogout}
  loadingMatches={loadingMatches}
  usuarios={usuarios}
  cargandoSeguir={cargandoSeguir}
/>
      {/* ASIDE DERECHO */}
          
<SidebarDerecho
  eventosDisponibles={eventosDisponibles}
  loadingEventos={loadingEventos}
  confirmarAsistencia={confirmarAsistencia}
  rechazarAsistencia={rechazarAsistencia}
  cargandoAsistencia={cargandoAsistencia}
  eventosExpandidos={eventosExpandidos}
  setEventosExpandidos={setEventosExpandidos}
  matchesMutuos={matchesMutuos}
  handleAbrirChat={handleAbrirChat}
  mostrarChatbot={mostrarChatbot}
  setMostrarChatbot={setMostrarChatbot}
/>

{/*fin de ASIDE DERECHO */}

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
      <Modal
        isOpen={mostrarGaleriaFotos}
        title="Agregar fotos a tu galería"
        showCloseButton={true}
        onClose={() => setMostrarGaleriaFotos(false)}
      >
        <div className="flex flex-col gap-4">
          <input
            type="file"
            multiple
            accept="image/*"
            className="border p-2 rounded"
            onChange={(e) => setFotosSeleccionadas(Array.from(e.target.files))}
          />

          <button
            onClick={subirFotosGaleria}
            className="bg-rose-600 text-white py-2 rounded hover:bg-rose-700 transition"
          >
            Subir Fotos
          </button>

          {profile?.imagenesGaleria?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {profile.imagenesGaleria.map((foto, i) => (
                <img
                  key={i}
                  src={foto}
                  className="w-full h-35 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
      {mostrarModalStrike && (
        <Modal
          isOpen={mostrarModalStrike}
          onClose={() => setMostrarModalStrike(false)}
          title="Enviar Queja o Sugerencia"
        >
          <StrikeForm />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard_Users;

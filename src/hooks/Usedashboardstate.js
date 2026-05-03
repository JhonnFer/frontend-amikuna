import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";
import { socket } from "../helpers/socket";

import usePerfilUsuarioAutenticado from "./usePerfilUsuarioAutenticado";
import useMatches from "./useMatches";

import useEventos from "./eventos/useEventos";
import useSeguirUsuario from "./useSeguirUsuario";
import useGaleriaFotos from "./useGaleriaFotos";
import useChatSocket from "../helpers/Usechatsocket";
import useUnreadMessages from "./useUnreadMessages";
import storeUnread from "../components/Dashboard_User/ListaChats/store/storeUnread";
import { useShallow } from "zustand/react/shallow";
import useUsuariosSwipe from "./useUsuariosSwipe";

const useDashboardState = () => {
  const navigate = useNavigate();

  const {
    perfil: profile,
    loadingPerfil,
    cargarPerfil,
  } = usePerfilUsuarioAutenticado();

  const {
    usuarios,
    loading: loadingUsuarios,
    eliminarUsuario,
  } = useUsuariosSwipe();

  const {
    matches,
    loading: loadingMatches,
    unreadCountsIniciales,
  } = useMatches();
  const { unreadCounts, marcarLeido, totalUnread, formatBadge } =
    useUnreadMessages(profile?._id, unreadCountsIniciales);

  const { userChatMap } = storeUnread(
    useShallow((state) => ({ userChatMap: state.userChatMap })),
  );

  const {
    eventos,
    loadingEventos,
    obtenerEventos,
    confirmarAsistencia,
    rechazarAsistencia,
    cargandoAsistencia,
  } = useEventos({
    autoCargar: true,
    onAsistenciaSuccess: () => obtenerEventos(),
  });

  const { seguirUsuario, cargando: cargandoSeguir } = useSeguirUsuario();

  const {
    setFotosSeleccionadas,
    subirFotos,
    eliminarFoto,
    reemplazarFoto,
    loading: loadingFotos,
  } = useGaleriaFotos(cargarPerfil);

  const {
    chatInfo,
    mensajes,
    handleAbrirChat,
    handleCerrarChat,
    handleEnviarMensaje,
  } = useChatSocket(profile, async () => {
    await cargarPerfil(); // recarga perfil para actualizar seguidores/siguiendo
  });

  const [mostrarEditarPerfil, setMostrarEditarPerfil] = useState(false);
  const [mostrarGaleriaFotos, setMostrarGaleriaFotos] = useState(false);
  const [mostrarModalStrike, setMostrarModalStrike] = useState(false);
  const [mostrarChatbot, setMostrarChatbot] = useState(false);
  const [eventosExpandidos, setEventosExpandidos] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0);
  const [fotosAEliminar, setFotosAEliminar] = useState([]);
  const [mostrarModalAporte, setMostrarModalAporte] = useState(false);
  const [aporteSeleccionado, setAporteSeleccionado] = useState(null);

  useEffect(() => {
    if (!storeAuth.getState().user) navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!loadingPerfil && !profile) cargarPerfil();
  }, [loadingPerfil, profile, cargarPerfil]);

  useEffect(() => {
    if (!socket) return;

    // =====================
    // EVENTOS
    // =====================
    const refreshEventos = () => obtenerEventos();

    // =====================
    // NOTIFICACIONES
    // =====================
    const refreshNotificaciones = () => {
      window.dispatchEvent(new Event("refetch_notificaciones"));
    };

    socket.on("evento_creado", refreshEventos);
    socket.on("evento_actualizado", refreshEventos);
    socket.on("evento_eliminado", refreshEventos);
    socket.on("asistencia_actualizada", refreshEventos);

    socket.on("notificacion_nueva", refreshNotificaciones);
    socket.on("notificacion_update", refreshNotificaciones);

    return () => {
      socket.off("evento_creado", refreshEventos);
      socket.off("evento_actualizado", refreshEventos);
      socket.off("evento_eliminado", refreshEventos);
      socket.off("asistencia_actualizada", refreshEventos);

      socket.off("notificacion_nueva", refreshNotificaciones);
      socket.off("notificacion_update", refreshNotificaciones);
    };
  }, [obtenerEventos]);

  const handleLogout = useCallback(async () => {
    await storeAuth.getState().logout();
    window.location.href = "/login";
  }, []);

  const handleOpenAporteModal = useCallback((monto, concepto, descripcion) => {
    setAporteSeleccionado({ monto, concepto, descripcion });
    setMostrarModalAporte(true);
  }, []);

  const handleAporteSuccess = useCallback(() => {
    setMostrarModalAporte(false);
    setAporteSeleccionado(null);
  }, []);

  const handleAbrirChatConLeido = useCallback(
    async (match) => {
      const chatId = await handleAbrirChat(match); // ← el que ya tienes
      if (chatId) marcarLeido(chatId);
    },
    [handleAbrirChat, marcarLeido],
  );

  const matchesMutuos = useMemo(() => {
    if (!profile?.matches || !matches) return [];
    const misMatches = new Set(profile.matches.map((id) => id?.toString()));
    return matches
      .filter((m) => misMatches.has(m._id?.toString()))
      .map((m) => ({
        ...m,
        // chatId del store si existe, sino el que vino del fetch
        chatId: userChatMap[m._id?.toString()] || m.chatId || null,
      }));
  }, [matches, profile, userChatMap]);

  const eventosDisponibles = useMemo(() => {
    if (!eventos || !profile?._id) return [];

    const profileId = profile._id.toString(); // ← convertir a string

    return eventos.filter((evento) => {
      const asistentes = evento.asistentes.map((a) => a._id?.toString());
      const noAsistiran = evento.noAsistiran.map((a) => a._id?.toString());
      return (
        !asistentes.includes(profileId) && !noAsistiran.includes(profileId)
      );
    });
  }, [eventos, profile]);

  return {
    profile,
    loadingPerfil,
    cargarPerfil,
    matches,
    loadingMatches,
    eventosDisponibles,
    loadingEventos,
    obtenerEventos,
    confirmarAsistencia,
    rechazarAsistencia,
    cargandoAsistencia,
    seguirUsuario,
    cargandoSeguir,
    setFotosSeleccionadas,
    subirFotos,
    eliminarFoto,
    reemplazarFoto,
    loadingFotos,
    fotoSeleccionada,
    setFotoSeleccionada,
    fotoIndex,
    setFotoIndex,
    fotosAEliminar,
    setFotosAEliminar,
    chatInfo,
    mensajes,
    handleAbrirChat,
    handleCerrarChat,
    handleEnviarMensaje,
    mostrarEditarPerfil,
    setMostrarEditarPerfil,
    mostrarGaleriaFotos,
    setMostrarGaleriaFotos,
    mostrarModalStrike,
    setMostrarModalStrike,
    mostrarChatbot,
    setMostrarChatbot,
    eventosExpandidos,
    setEventosExpandidos,
    matchesMutuos,
    mostrarModalAporte,
    setMostrarModalAporte,
    aporteSeleccionado,
    handleOpenAporteModal,
    handleAporteSuccess,
    handleLogout,
    unreadCounts,
    marcarLeido,
    totalUnread,
    formatBadge,
    handleAbrirChatConLeido,
    usuarios,
    loadingUsuarios,
    eliminarUsuario,
  };
};

export default useDashboardState;

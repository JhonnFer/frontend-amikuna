import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import storeAuth from "../context/storeAuth";

import usePerfilUsuarioAutenticado from "./usePerfilUsuarioAutenticado";
import useMatches from "./useMatches";
import useNotificaciones from "./useNotificaciones";
import useEventos from "./useEventos";
import useSeguirUsuario from "./useSeguirUsuario";
import useGaleriaFotos from "./useGaleriaFotos";
import useChatSocket from "../helpers/Usechatsocket";

const useDashboardState = () => {
  const navigate = useNavigate();

  const { perfil: profile, loadingPerfil, cargarPerfil } = usePerfilUsuarioAutenticado();
  const { matches, loading: loadingMatches }              = useMatches();
  const { solicitudes, loading: loadingSolicitudes }      = useNotificaciones();

  const {
    eventos,
    loadingEventos,
    obtenerEventos,
    confirmarAsistencia,
    rechazarAsistencia,
    cargandoAsistencia,
  } = useEventos({ autoCargar: true, onAsistenciaSuccess: () => obtenerEventos() });

  const { seguirUsuario, cargando: cargandoSeguir }                                                          = useSeguirUsuario();
  const { setFotosSeleccionadas, subirFotos, eliminarFoto, reemplazarFoto, loading: loadingFotos }           = useGaleriaFotos(cargarPerfil);
  const { chatInfo, mensajes, handleAbrirChat, handleCerrarChat, handleEnviarMensaje }                       = useChatSocket(profile);

  const [mostrarEditarPerfil,   setMostrarEditarPerfil]   = useState(false);
  const [mostrarGaleriaFotos,   setMostrarGaleriaFotos]   = useState(false);
  const [mostrarModalStrike,    setMostrarModalStrike]     = useState(false);
  const [mostrarChatbot,        setMostrarChatbot]         = useState(false);
  const [eventosExpandidos,     setEventosExpandidos]      = useState(false);
  const [fotoSeleccionada,      setFotoSeleccionada]       = useState(null);
  const [fotoIndex,             setFotoIndex]              = useState(0);
  const [fotosAEliminar,        setFotosAEliminar]         = useState([]);
  const [mostrarModalAporte,    setMostrarModalAporte]     = useState(false);
  const [aporteSeleccionado,    setAporteSeleccionado]     = useState(null);

  useEffect(() => {
    if (!storeAuth.getState().user) navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!loadingPerfil && !profile) cargarPerfil();
  }, [loadingPerfil, profile, cargarPerfil]);

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

  const matchesMutuos = useMemo(() => {
    if (!profile?.seguidores || !profile?.siguiendo || !matches) return [];
    const seguidores = new Set(profile.seguidores);
    const siguiendo  = new Set(profile.siguiendo);
    return matches.filter((m) => seguidores.has(m._id) && siguiendo.has(m._id));
  }, [matches, profile]);

  const eventosDisponibles = useMemo(() => {
  if (!eventos || !profile?._id) return [];
  
  const profileId = profile._id.toString(); // ← convertir a string
  
  return eventos.filter((evento) => {
    const asistentes  = evento.asistentes.map((a) => a._id?.toString());
    const noAsistiran = evento.noAsistiran.map((a) => a._id?.toString());
    return !asistentes.includes(profileId) && !noAsistiran.includes(profileId);
  });
}, [eventos, profile]);

  return {
    profile, loadingPerfil, cargarPerfil,
    matches, loadingMatches,
    solicitudes, loadingSolicitudes,
    eventosDisponibles, loadingEventos,
    confirmarAsistencia, rechazarAsistencia, cargandoAsistencia,
    seguirUsuario, cargandoSeguir,
    setFotosSeleccionadas, subirFotos, eliminarFoto, reemplazarFoto, loadingFotos,
    fotoSeleccionada, setFotoSeleccionada,
    fotoIndex, setFotoIndex,
    fotosAEliminar, setFotosAEliminar,
    chatInfo, mensajes, handleAbrirChat, handleCerrarChat, handleEnviarMensaje,
    mostrarEditarPerfil, setMostrarEditarPerfil,
    mostrarGaleriaFotos, setMostrarGaleriaFotos,
    mostrarModalStrike, setMostrarModalStrike,
    mostrarChatbot, setMostrarChatbot,
    eventosExpandidos, setEventosExpandidos,
    matchesMutuos,
    mostrarModalAporte, setMostrarModalAporte,
    aporteSeleccionado,
    handleOpenAporteModal, handleAporteSuccess,
    handleLogout,
  };
};

export default useDashboardState;
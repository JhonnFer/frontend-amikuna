import {  useState } from "react";
import useNotificaciones from "./useNotificaciones"; 
import useSeguirUsuario from "../../../../hooks/useSeguirUsuario";
import storeProfile from "../../../../context/storeProfile";
import { toast } from "react-toastify";

const useBotonNotificacionesLogic = () => {
  const profile = storeProfile((state) => state.profile);

  const {
    notificaciones,
    loading,
    marcarLeido,
    marcarTodasLeidas,
    obtenerNotificaciones,
  } = useNotificaciones(); // ✅ usa el hook que ya inicializa socket y fetch

  const { seguirUsuario, cargando } = useSeguirUsuario();

  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});

  const noLeidas = Array.isArray(notificaciones)
    ? notificaciones.filter((n) => !n.leido).length
    : 0;

  const yaSigue = (fromUser) => {
    const fromId = fromUser?._id?.toString() || fromUser?.toString();
    return profile?.siguiendo?.some((id) => id?.toString() === fromId);
  };

  const handleAceptarSolicitud = async (notificacion) => {
    try {
      const idSolicitante = notificacion.fromUser?._id || notificacion.fromUser;
      if (!idSolicitante) {
        toast.error("No se pudo identificar al usuario.");
        return;
      }
      if (notificacion.tipo === "match") {
        await marcarLeido(notificacion._id);
        return;
      }
      const data = await seguirUsuario(idSolicitante);
      if (data?.huboMatch) {
        toast.success("¡Match confirmado! 🎉");
      } else {
        toast.info("Ahora sigues a este usuario.");
      }
      await marcarLeido(notificacion._id);
    } catch (err) {
      console.error(err);
    }
  };

  const abrirNotificaciones = () => {
    setMostrarMenu((prev) => !prev);
  };

  return {
    profile,
    notificaciones,
    loading,
    marcarLeido,
    marcarTodasLeidas,
    obtenerNotificaciones,
    seguirUsuario,
    cargando,
    mostrarMenu,
    setMostrarMenu,
    menuStyle,
    setMenuStyle,
    noLeidas,
    yaSigue,
    handleAceptarSolicitud,
    abrirNotificaciones,
  };
};

export default useBotonNotificacionesLogic;
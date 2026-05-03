// src/hooks/useUnreadMessages.js
import { useEffect, useRef } from "react";
import storeUnread from "../components/Dashboard_User/ListaChats/store/storeUnread";

const useUnreadMessages = (miId, unreadCountsIniciales = {}) => {
  const unreadCounts = storeUnread((state) => state.unreadCounts);
  const inicializarCounts = storeUnread((state) => state.inicializarCounts);
  const marcarLeido = storeUnread((state) => state.marcarLeido);

  const inicializado = useRef(false);

  // poblar desde backend al cargar matches
  useEffect(() => {
    if(inicializado.current)return;
    if (Object.keys(unreadCountsIniciales).length === 0) return;

    inicializarCounts(unreadCountsIniciales);
    inicializado.current = true; 
  }, [JSON.stringify(unreadCountsIniciales)]);

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  const formatBadge = (count) => (count > 9 ? "+9" : count);

  return { unreadCounts, marcarLeido, totalUnread, formatBadge };
};

export default useUnreadMessages;
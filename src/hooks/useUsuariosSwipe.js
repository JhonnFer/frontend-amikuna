import { useEffect, useState } from "react";
import useFetch from "./useFetch";

import storeSwipe from "../components/Dashboard_User/CardsSwipe/store/storeSwipe";
import { useShallow } from "zustand/react/shallow";

function useUsuariosSwipe() {
  const { fetchDataBackend } = useFetch();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const { matchUserId, setMatchUserId , perfilActualizado, clearRefetchSwipe } = storeSwipe(
    useShallow((state) => ({
      matchUserId: state.matchUserId,
      setMatchUserId: state.setMatchUserId,
      perfilActualizado: state.perfilActualizado, 
      clearRefetchSwipe: state.clearRefetchSwipe,
    })),

    
  );

  

  const obtenerUsuarios = async () => {
    try {
      const data = await fetchDataBackend("estudiantes/matches");
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  

  // ✅ Reaccionar cuando orquestador detecta nuevo match
  useEffect(() => {
    if (!matchUserId) return;
    setUsuarios((prev) => prev.filter((u) => u._id.toString() !== matchUserId));
    setMatchUserId(null); // limpiar
  }, [matchUserId]);

  const eliminarUsuario = (id) => {
    setUsuarios((prev) =>
      prev.filter((u) => u._id.toString() !== id.toString()),
    );
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
  if (!perfilActualizado) return;
  obtenerUsuarios();
  clearRefetchSwipe();
}, [perfilActualizado]);

  return { usuarios, loading, eliminarUsuario, refetch: obtenerUsuarios };
}
export default useUsuariosSwipe;

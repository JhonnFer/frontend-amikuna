
import storeProfile from "../context/storeProfile";

export {isPerfilCompleto} from "../context/storeProfile";

const usePerfilUsuarioAutenticado = () => {
  const {
    profile,
    loading,
    loadProfile,
    updateProfile,
    refreshProfile,
  } = storeProfile();

  return {
    perfil: profile,
    loadingPerfil: loading,
    cargarPerfil: loadProfile,
    completarPerfil: updateProfile,
    editarPerfil: updateProfile,
    refreshProfile,
  };
};

export default usePerfilUsuarioAutenticado;
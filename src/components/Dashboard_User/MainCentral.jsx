import PropTypes from "prop-types";
import { FaUser, FaImages } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import SwipeCards from "./SwipeCards";
import BotonNotificaciones from "./BotonNotificaciones";

const MainCentral = ({
  handleOpenAporteModal,
  setMostrarEditarPerfil,
  setMostrarGaleriaFotos,
  solicitudes,
  loadingSolicitudes,
  seguirUsuario,
  setMostrarChatbot,
  mostrarChatbot,
  setMostrarModalStrike,
  handleLogout,
  loadingMatches,
  usuarios,
  cargandoSeguir
}) => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden min-h-0 max-w-5xl mx-auto px-4 py-2 h-full">

      {/* NAVBAR */}
      <div
        className="
        shrink-0
        grid
        grid-cols-4
        sm:grid-cols-5
        md:grid-cols-6
        lg:grid-cols-7
        items-center
        justify-items-center
        gap-2
        md:gap-4
        border
        rounded-lg
        bg-[#ffba79]
        px-2
        py-2
        overflow-visible 
      "
      >

        <button
          onClick={() =>
            handleOpenAporteModal(
              10,
              "Apoyo a la app",
              "Contribución para mejoras de la plataforma Amikuna"
            )
          }
          className="bg-[#ea454592] text-white text-[10px] sm:text-xs md:text-sm px-2 py-1 rounded-full whitespace-nowrap"
        >
          Aporte
        </button>

        <div className="flex flex-col items-center text-center w-full">
          <button onClick={() => setMostrarEditarPerfil(true)}>
            <FaUser className="text-gray-600 hover:text-gray-200 w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="text-[10px] sm:text-xs text-gray-800">
            Perfil
          </span>
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <button onClick={() => setMostrarGaleriaFotos(true)}>
            <FaImages className="text-gray-600 hover:text-gray-200 w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="text-[10px] sm:text-xs text-gray-800">
            Fotos
          </span>
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <BotonNotificaciones
            solicitudes={solicitudes}
            loading={loadingSolicitudes}
            onFollow={seguirUsuario}
          />
          <span className="text-[10px] sm:text-xs text-gray-800">
            Notif
          </span>
        </div>

        <button
          onClick={() => setMostrarChatbot(!mostrarChatbot)}
          className="flex flex-col items-center text-center"
        >
          <span className="text-base md:text-lg">💬</span>
          <span className="text-[10px] sm:text-xs text-gray-800">
            Chat
          </span>
        </button>

        <button
          onClick={() => setMostrarModalStrike(true)}
          className="flex flex-col items-center text-center hover:bg-gray-100 rounded p-1 transition"
        >
          <span className="text-lg md:text-xl">📝</span>
          <span className="text-[10px] sm:text-xs text-gray-800">
            Feedback
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-center"
        >
          <FiLogOut className="text-[#51040492] hover:text-red-200 w-5 h-5 md:w-6 md:h-6" />
          <span className="text-[10px] sm:text-xs text-gray-800">
            Salir
          </span>
        </button>

      </div>

      {/* SWIPE CARDS */}
      <div className="flex-1 min-h-0 relative overflow-hidden flex items-center justify-center">

        {loadingMatches ? (
          <div className="absolute inset-0 flex items-center justify-center">
            Cargando usuarios para swipes...
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
  );
};

MainCentral.propTypes = {
  handleOpenAporteModal: PropTypes.func.isRequired,
  setMostrarEditarPerfil: PropTypes.func.isRequired,
  setMostrarGaleriaFotos: PropTypes.func.isRequired,
  solicitudes: PropTypes.array.isRequired,
  loadingSolicitudes: PropTypes.bool.isRequired,
  seguirUsuario: PropTypes.func.isRequired,
  setMostrarChatbot: PropTypes.func.isRequired,
  mostrarChatbot: PropTypes.bool.isRequired,
  setMostrarModalStrike: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  loadingMatches: PropTypes.bool.isRequired,
  usuarios: PropTypes.array.isRequired,
  cargandoSeguir: PropTypes.bool.isRequired
};

export default MainCentral;


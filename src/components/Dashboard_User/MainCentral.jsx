import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaUser, FaImages, FaRobot, FaFlag } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import SwipeCards from "./SwipeCards";
import BotonNotificaciones from "./Notificaciones/components/BotonNotificaciones";
import storeNotificaciones from "./Notificaciones/store/storeNotificaciones";

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
  cargandoSeguir,
  eliminarUsuario,
}) => {
  const navbarRef = useRef(null);

  //parte en la que se muestra texto para botones del navbar de main central, con efecto marquee al hacer hover
  const [hoverNotif, setHoverNotif] = useState(false);
  const [hoverFeedback, setHoverFeedback] = useState(false);

  const strikeNoLeidas = storeNotificaciones(
    (state) =>
      state.notificaciones.filter(
        (n) => n.tipo === "respuesta_strike" && !n.leido,
      ).length,
  );

  return (
    <main className="flex-1 flex flex-col overflow-hidden min-h-0 max-w-5xl mx-auto px-4 py-2 h-full">
      {/* NAVBAR */}
      <div
        ref={navbarRef}
        className="
        relative
        grid
        grid-cols-4
        w-full
        sm:grid-cols-4 
        md:grid-cols-5 
        lg:grid-cols-5 
        xl:grid-cols-8 
        items-center
        justify-between
        gap-2
        xl:gap-20 lg:gap-2 
        border
        rounded-lg
        bg-gradient-to-r from-pink-600  to-orange-400
        px-auto
        overflow-visible 
      "
      >
        <button
          onClick={() =>
            handleOpenAporteModal(
              10,
              "Apoyo a la app",
              "Contribución para mejoras de la plataforma Amikuna",
            )
          }
          className="bg-gradient-to-r from-[#ff6e7f] to-[#bfe9ff] text-gray-800 mx-auto  sm:px-0 px-2  sm:text-xs md:text-sm lg:text-md xl:text-lg  py-1 rounded-full whitespace-nowrap"
        >
          <span className=" mx-2">Apoyar</span>
        </button>

        <div className="flex flex-col items-center text-center px-auto mx-auto ">
          <button onClick={() => setMostrarEditarPerfil(true)}>
            <FaUser className="text-gray-600 hover:text-gray-200 w-5 h-5 md:w-6 md:h-6" />
          </button>
          <span className="sm:text-xs md:text-sm lg:text-md xl:text-lg  text-gray-800">
            Perfil
          </span>
        </div>

        <div className="flex flex-col items-center text-center px-auto mx-auto ">
          <button onClick={() => setMostrarGaleriaFotos(true)}>
            <FaImages className="text-gray-600 hover:text-gray-200 w-5 h-5  md:w-6 md:h-6" />
          </button>
          <span className="sm:text-xs md:text-sm lg:text-md xl:text-lg text-gray-800">
            Fotos
          </span>
        </div>

        <div
          className="flex flex-col items-center text-center cursor-pointer pb-1"
          onMouseEnter={() => setHoverNotif(true)}
          onMouseLeave={() => setHoverNotif(false)}
          onClickCapture={() => setHoverNotif(false)}
        >
          <div className="text-gray-600 hover:text-gray-200 sm:h-6 md:h-6 lg:h-7 xl:h-8 w-5 md:w-6 lg:w-7 xl:w-8 mb-2 ">
            <BotonNotificaciones
              navbarRef={navbarRef}
              solicitudes={solicitudes}
              loading={loadingSolicitudes}
              onFollow={seguirUsuario}
            />
          </div>

          <div
            style={{
              overflow: "hidden",
              width: "70px",
              height: "20px",
              position: "relative",
            }}
          >
            {/* Sin hover → Notif quieto */}
            {!hoverNotif && (
              <span className="absolute inset-0 flex items-center justify-center sm:text-xs md:text-sm lg:text-md xl:text-lg text-gray-800 pb-2 ">
                Notif
              </span>
            )}

            {/* Con hover → marquee loop */}
            {hoverNotif && (
              <div className="absolute inset-0 ">
                <div
                  className="animate-ticker whitespace-nowrap flex "
                  style={{ position: "absolute" }}
                >
                  <span className="sm:text-xs md:text-sm text-gray-800">
                    Notificaciones&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  <span className="sm:text-xs md:text-sm text-gray-800">
                    Notificaciones&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setMostrarChatbot(!mostrarChatbot)}
          className="flex flex-col items-center text-center"
        >
          <FaRobot className="text-gray-600 hover:text-gray-200 md:w-6 sm:w-5 sm:h-5 md:h-4 lg:h-5 xl:h-6" />
          <span className="sm:text-xs md:text-sm lg:text-md xl:text-lg text-gray-800">
            ChatBot
          </span>
        </button>

        <div
          className="flex flex-col items-center text-center cursor-pointer "
          onMouseEnter={() => setHoverFeedback(true)}
          onMouseLeave={() => setHoverFeedback(false)}
          onClickCapture={() => setHoverFeedback(false)}
        >
          <button
            onClick={() => setMostrarModalStrike(true)}
            className="flex flex-col items-center text-center px-auto mx-auto"
          >
            <div className="relative">
              <FaFlag className="text-gray-600 hover:text-gray-200  md:w-5 sm:w-4  sm:h-5 md:h-4 lg:h-5 xl:h-6" />

              {strikeNoLeidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {strikeNoLeidas > 9 ? "9+" : strikeNoLeidas}
                </span>
              )}
            </div>

            <div
              style={{
                overflow: "hidden",
                width: "90px",
                height: "20px",
                position: "relative",
              }}
            >
              {/* Sin hover → Notif quieto */}
              {!hoverFeedback && (
                <span className="absolute inset-0 flex items-center justify-center  sm:text-xs md:text-sm lg:text-md xl:text-lg text-gray-800  ">
                  Feedback
                </span>
              )}

              {/* Con hover → marquee loop */}
              {hoverFeedback && (
                <div className="absolute inset-0 ">
                  <div
                    className="animate-ticker whitespace-nowrap flex "
                    style={{ position: "absolute" }}
                  >
                    <span className="sm:text-xs md:text-sm text-gray-800">
                      Sugerencias / Quejas&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>

                    <span className="sm:text-xs md:text-sm text-gray-800">
                      Sugerencias / Quejas&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  </div>
                </div>
              )}
            </div>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-center mx-auto px-6 "
        >
          <FiLogOut className="text-[#51040492] hover:text-red-200  md:w-6 sm:w-5 sm:h-5 md:h-4 lg:h-5 xl:h-6" />
          <span className="mx-auto sm:text-xs md:text-sm lg:text-md xl:text-lg text-gray-800">
            Salir
          </span>
        </button>
      </div>

      {/* SWIPE CARDS */}
      <div className="flex-1 min-h-0 relative overflow-hidden flex items-center justify-center">
        {loadingMatches ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#ED213A] to-[#93291E] bg-clip-text text-transparent">
            Cargando usuarios para swipes...
          </div>
        ) : (
          <SwipeCards
            usuarios={usuarios || []}
            onFollow={seguirUsuario}
            cargandoSeguir={cargandoSeguir}
            eliminarUsuario={eliminarUsuario}
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
  cargandoSeguir: PropTypes.bool.isRequired,
};

export default MainCentral;

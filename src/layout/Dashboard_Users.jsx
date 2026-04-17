import { useRef, useEffect } from "react";
import Modal from "../components/Modals_Dashboards/modal";
import ModalPayment from "../components/treatments/ModalPayment";
import StrikeForm from "../components/Dashboard_User/StrikeForm";
import ChatConversacion from "../components/Dashboard_User/ChatConversacion";
import SidebarIzquierdo from "../components/Dashboard_User/SidebarIzquierdo";
import MainCentral from "../components/Dashboard_User/MainCentral";
import SidebarDerecho from "../components/Dashboard_User/SidebarDerecho";
import FormularioCompletarPerfil from "../components/Dashboard_User/FormularioCompletarPerfil";
import VisorFotos from "../components/UI/VisorFotos";
import ModalGaleria from "../components/Modals_Dashboards/Modalgaleria";
import ModalConfirmarEliminar from "../components/Modals_Dashboards/Modalconfirmareliminar";

import useDashboardState from "../hooks/Usedashboardstate";
import storeProfile from "../context/storeProfile";

const Dashboard_Users = () => {

const profile = storeProfile((state) => state.profile);
const loadProfile = storeProfile((state) => state.loadProfile);
const loading = storeProfile((state) => state.loading);
  
  const resetModoEliminarRef = useRef(null); // ← ref para resetear el toggle del ModalGaleria
 
  const {
    loadingPerfil, cargarPerfil,
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
    mostrarModalAporte, setMostrarModalAporte,
    aporteSeleccionado,
    handleOpenAporteModal, handleAporteSuccess,
    handleLogout,
  } = useDashboardState();

  useEffect(() => {
  if (!profile) {
    
    loadProfile();
  }
}, [profile, loadProfile]); 
 
  if (loading) {
  return <div>Cargando perfil...</div>;
}

if (!profile) {

  return <div>No se pudo cargar el perfil, intenta de nuevo.</div>;
}
 
  const perfilIncompleto = !profile.genero || !profile.orientacion || !profile.ubicacion?.ciudad;
    
 
  if (!loadingPerfil && perfilIncompleto) {
    return (
      <Modal isOpen={true} title="Completa tu perfil" showCloseButton={false} onClose={() => {}}>
        <p className="text-center text-gray-600 mb-4">
          Necesitamos que completes tu perfil para acceder al dashboard
        </p>
        <FormularioCompletarPerfil initialData={profile} onSuccess={cargarPerfil} />
      </Modal>
    );
    
  }
  
 
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-red-100 via-orange-50  to-orange-100 overflow-hidden">
 
      <SidebarIzquierdo profile={profile} setMostrarGaleriaFotos={setMostrarGaleriaFotos} />
 
      <MainCentral
        handleOpenAporteModal={handleOpenAporteModal}
        setMostrarEditarPerfil={setMostrarEditarPerfil}
        setMostrarGaleriaFotos={setMostrarGaleriaFotos}
        solicitudes={solicitudes || []}
        loadingSolicitudes={loadingSolicitudes || false}
        seguirUsuario={seguirUsuario}
        setMostrarChatbot={setMostrarChatbot}
        mostrarChatbot={mostrarChatbot}
        setMostrarModalStrike={setMostrarModalStrike}
        handleLogout={handleLogout}
        loadingMatches={loadingMatches}
        usuarios={matches || []}
        cargandoSeguir={cargandoSeguir || false}
      />
 
      <SidebarDerecho
        eventosDisponibles={eventosDisponibles}
        loadingEventos={loadingEventos}
        confirmarAsistencia={confirmarAsistencia}
        rechazarAsistencia={rechazarAsistencia}
        cargandoAsistencia={cargandoAsistencia}
        eventosExpandidos={eventosExpandidos}
        setEventosExpandidos={setEventosExpandidos}
        matchesMutuos={matches}
        
        handleAbrirChat={handleAbrirChat}
        mostrarChatbot={mostrarChatbot}
        setMostrarChatbot={setMostrarChatbot}
      />
 
      {chatInfo && profile?._id && (
        <ChatConversacion
          chatInfo={chatInfo}
          miId={profile._id}
          onCloseChat={handleCerrarChat}
          mensajes={mensajes}
          onEnviarMensaje={handleEnviarMensaje}
        />
      )}
 
      <Modal isOpen={mostrarEditarPerfil} title="Editar perfil" showCloseButton={true} onClose={() => setMostrarEditarPerfil(false)}>
        <FormularioCompletarPerfil
          initialData={profile}
          onSuccess={async () => { await cargarPerfil(); setMostrarEditarPerfil(false); }}
        />
      </Modal>
 
      {mostrarModalAporte && aporteSeleccionado && (
        <Modal isOpen={mostrarModalAporte} onClose={() => setMostrarModalAporte(false)} title="Realizar aporte">
          <ModalPayment
            aporte={aporteSeleccionado}
            onClose={() => setMostrarModalAporte(false)}
            onPaymentSuccess={handleAporteSuccess}
          />
        </Modal>
      )}
 
      {mostrarModalStrike && (
        <Modal isOpen={mostrarModalStrike} onClose={() => setMostrarModalStrike(false)} title="Enviar Queja o Sugerencia">
          <StrikeForm />
        </Modal>
      )}
 
      <ModalGaleria
        isOpen={mostrarGaleriaFotos}
        onClose={() => setMostrarGaleriaFotos(false)}
        profile={profile}
        loadingFotos={loadingFotos}
        setFotosSeleccionadas={setFotosSeleccionadas}
        subirFotos={subirFotos}
        setFotoSeleccionada={setFotoSeleccionada}
        setFotoIndex={setFotoIndex}
        setFotosAEliminar={setFotosAEliminar}
        resetModoEliminarRef={resetModoEliminarRef} // ← ref para resetear el toggle
      />
 
      <ModalConfirmarEliminar
        fotos={fotosAEliminar}
        loadingFotos={loadingFotos}
        onCancelar={() => setFotosAEliminar([])}
        onConfirmar={async () => {
          // Eliminar todas las fotos seleccionadas en paralelo
          const resultados = await Promise.all(fotosAEliminar.map((f) => eliminarFoto(f)));
          const hayError = resultados.find((r) => !r.ok);
          if (hayError) alert(hayError.msg);
 
          setFotosAEliminar([]);
          // Reset del toggle en ModalGaleria
          if (resetModoEliminarRef.current) resetModoEliminarRef.current();
        }}
      />
 
      <VisorFotos
        fotos={profile.imagenesGaleria}
        fotoSeleccionada={fotoSeleccionada}
        fotoIndex={fotoIndex}
        setFotoSeleccionada={setFotoSeleccionada}
        setFotoIndex={setFotoIndex}
        onReemplazar={reemplazarFoto}
      />
 
    </div>
  );
};
 

export default Dashboard_Users;
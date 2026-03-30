import PropTypes from "prop-types";
import { useState } from "react";
import VisorFotos from "../UI/VisorFotos";

const SidebarIzquierdo = ({ profile, setMostrarGaleriaFotos }) => {
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0);

  return (
    <aside className="hidden sm:flex md:flex-col w-full sm:w-64 md:w-72 lg:w-80 xl:w-[350px] bg-gradient-to-br from-pink-50 to-blue-50 p-4 shadow flex-shrink-0 h-screen">
      <div
        className="flex flex-col h-full overflow-y-auto scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* HEADER */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ED213A] to-[#93291E] bg-clip-text text-transparent border-b-2 border-pink-600 pb-2">
            Tu Perfil
          </h1>
        </header>

        {/* PERFIL */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={profile?.imagenPerfil || "https://placehold.co/150x150"}
            alt="Tu foto de perfil"
            className="rounded-full w-32 h-32 object-cover mb-2 cursor-pointer hover:scale-105 transition"
            onClick={() => {
              setFotoSeleccionada(profile?.imagenPerfil);
              setFotoIndex(0);
            }}
          />

          <h3 className="text-xl font-bold text-gray-800">
            {profile?.nombre || "Sin nombre"}
          </h3>
          <p className="text-center text-gray-500 italic">
            {profile?.biografia || "Sin biografía definida"}
          </p>
        </div>

        {/* DATOS PERSONALES */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 shadow-sm space-y-2 mb-4 w-full">
          <p>
            <strong className="bg-gradient-to-r from-[#ED213A] to-[#93291E] bg-clip-text text-transparent">
              Género:
            </strong>{" "}
            {profile?.genero || "No definido"}
          </p>
          <p>
            <strong className="bg-gradient-to-r from-[#ED213A] to-[#93291E] bg-clip-text text-transparent">
              Orientación:
            </strong>{" "}
            {profile?.orientacion || "No definida"}
          </p>
          <p>
            <strong className="bg-gradient-to-r from-[#ED213A] to-[#93291E] bg-clip-text text-transparent">
              Intereses:
            </strong>{" "}
            {Array.isArray(profile?.intereses) && profile.intereses.length > 0
              ? profile.intereses.join(", ")
              : "No definidos"}
          </p>
          <p>
            <strong className="bg-gradient-to-r from-[#ED213A] to-[#93291E] bg-clip-text text-transparent">
              Fecha de nacimiento:
            </strong>{" "}
            {profile?.fechaNacimiento &&
            typeof profile.fechaNacimiento === "string"
              ? profile.fechaNacimiento.split("T")[0]
              : "No definida"}
          </p>
        </div>

        {/* GALERÍA - placeholder si no hay fotos */}
        {(!profile?.imagenesGaleria ||
          profile.imagenesGaleria.length === 0) && (
          <div className="mt-4 w-full">
            <h4 className="text-gray-700 text-xl font-semibold drop-shadow-sm mb-2">
              Últimas Fotos
            </h4>
            <div
              onClick={() => setMostrarGaleriaFotos(true)}
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-rose-300 rounded-xl cursor-pointer hover:bg-rose-50 transition"
            >
              <span className="text-5xl text-rose-300 mb-2 select-none">+</span>
              <p className="text-rose-400 text-sm font-medium text-center px-4 select-none">
                Agrega tus fotos aquí
              </p>
            </div>
          </div>
        )}

        {/* GALERÍA - con fotos */}
        {profile?.imagenesGaleria?.length > 0 && (
          <div className="mt-4 w-full">
            <h4 className="text-gray-700 text-xl font-semibold mb-2">
              Últimas Fotos
            </h4>

            <div className="bg-gradient-to-r from-gray-100 to-blue-100 grid grid-cols-2 gap-2">
              {profile.imagenesGaleria
                .slice(-6)
                .reverse()
                .map((foto, i) => {
                  const indexReal = profile.imagenesGaleria.length - 1 - i;
                  return (
                    <div
                      key={i}
                      className=" overflow-hidden rounded cursor-pointer"
                    >
                      <img
                        src={foto}
                        alt={`Foto ${i + 1}`}
                        onClick={() => {
                          setFotoSeleccionada(foto);
                          setFotoIndex(indexReal);
                        }}
                        className=" w-full h-28 object-cover rounded hover:scale-105 transition duration-300 cursor-pointer"
                      />
                    </div>
                  );
                })}
            </div>

            {profile.imagenesGaleria.length > 6 && (
              <button
                onClick={() => setMostrarGaleriaFotos(true)}
                className="mt-2 bg-gradient-to-r from-pink-600 to-orange-400 text-white shadow-sm py-1 rounded-[10px] hover:from-pink-700 hover:to-orange-500 transition w-full font-semibold"
              >
                Ver más
              </button>
            )}
          </div>
        )}
      </div>

      {/* VISOR */}
      <VisorFotos
        fotos={[profile?.imagenPerfil, ... (profile?.imagenesGaleria || [])]}
        fotoSeleccionada={fotoSeleccionada}
        fotoIndex={fotoIndex}
        setFotoSeleccionada={setFotoSeleccionada}
        setFotoIndex={setFotoIndex}
      />
    </aside>
  );
};

SidebarIzquierdo.propTypes = {
  profile: PropTypes.object,
  setMostrarGaleriaFotos: PropTypes.func,
};

export default SidebarIzquierdo;

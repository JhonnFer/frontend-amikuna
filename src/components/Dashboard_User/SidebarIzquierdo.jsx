//src/components/Dashboard_User/SidebarIzquierdo.jsx
import PropTypes from "prop-types";

const SidebarIzquierdo = ({ profile, setMostrarGaleriaFotos }) => {
  return (
    <aside className="hidden sm:flex md:flex-col w-full sm:w-64 md:w-72 lg:w-80 xl:w-[350px] bg-white p-4 shadow flex-shrink-0 h-screen">

      <div
        className="flex flex-col h-full overflow-y-auto scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >

        {/* HEADER */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-rose-800 border-b-2 border-bg-red-900 pb-2">
            Tu Perfil
          </h1>
        </header>

        {/* PERFIL */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={profile?.imagenPerfil || "https://placehold.co/150x150"}
            alt="Tu foto de perfil"
            className="rounded-full w-32 h-32 object-cover mb-2"
          />

          <h3 className="text-xl font-bold text-gray-800">
            {profile?.nombre || "Sin nombre"}
          </h3>

          <p className="text-center text-gray-500 italic">
            {profile?.biografia || "Sin biografía definida"}
          </p>
        </div>

        {/* DATOS PERSONALES */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm space-y-2 mb-4 w-full">
          <p>
            <strong className="text-rose-800">Género:</strong>{" "}
            {profile?.genero || "No definido"}
          </p>

          <p>
            <strong className="text-rose-800">Orientación:</strong>{" "}
            {profile?.orientacion || "No definida"}
          </p>

          <p>
            <strong className="text-rose-800">Intereses:</strong>{" "}
            {Array.isArray(profile?.intereses) && profile.intereses.length > 0
              ? profile.intereses.join(", ")
              : "No definidos"}
          </p>

          <p>
            <strong className="text-rose-800">Fecha de nacimiento:</strong>{" "}
            {profile?.fechaNacimiento &&
            typeof profile.fechaNacimiento === "string"
              ? profile.fechaNacimiento.split("T")[0]
              : "No definida"}
          </p>
        </div>

        {/* GALERÍA */}
        {profile?.imagenesGaleria?.length > 0 && (
          <div className="mt-4 w-full">
            <h4 className="text-gray-700 text-xl font-semibold mb-2">
              Últimas Fotos
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {profile.imagenesGaleria
                .slice(-6)
                .reverse()
                .map((foto, i) => (
                  <img
                    key={i}
                    src={foto}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-28 object-cover rounded"
                  />
                ))}
            </div>

            {profile.imagenesGaleria.length > 6 && (
              <button
                onClick={() => setMostrarGaleriaFotos(true)}
                className="mt-2 bg-rose-600 text-black py-1 rounded hover:bg-rose-700 transition w-full"
              >
                Ver más
              </button>
            )}
          </div>
        )}

      </div>

    </aside>
  );
};

SidebarIzquierdo.propTypes = {
  profile: PropTypes.object,
  setMostrarGaleriaFotos: PropTypes.func
};

export default SidebarIzquierdo;


import Navbar from "../components/Navbar";
import logindes from '../assets/descarga.png';
import des1 from '../assets/googleplay.png';
import des2 from '../assets/appstore.png';

const Download = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-pink-500 to-orange-400 text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 gap-10 mx-4 md:mx-16 mt-10 rounded-3xl overflow-hidden">
        
        {/* Texto */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
            Conoce gente nueva
          </h1>

          <p className="text-base sm:text-lg md:text-xl mb-9">
            Conoce gente nueva hoy mismo.
          </p>

          <a
            href="#"
            className="bg-white text-pink-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:scale-105 transition-transform text-sm sm:text-lg md:text-xl"
          >
            Descarga Amikuna
          </a>
        </div>

        {/* Imagen */}
        <div className="flex justify-center items-center w-full md:w-auto flex-1">
          <img
            src={logindes}
            alt="Logo decorativo"
            className="w-[80%] sm:w-[60%] md:w-full max-w-[450px] object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Plataformas */}
      <div className="bg-white py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            Plataformas y dispositivos compatibles
          </h2>

          <p className="text-gray-600 text-base md:text-lg max-w-4xl mx-auto mb-4">
            Amikuna actualmente está disponible en dispositivos <strong>iOS</strong>, 
            <strong> Android</strong> y <strong>HarmonyOS</strong>. 
            También puedes usar <strong>Amikuna.com</strong> desde el navegador.
          </p>

          <p className="text-gray-600 text-base md:text-lg max-w-4xl mx-auto">
            Compatible con iOS 16+, Android 9+ y navegadores modernos
            como Chrome, Firefox, Safari y Edge.
          </p>

        </div>
      </div>

      {/* Botones descarga */}
      <div className="bg-gray-50 py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            ¡Descarga la app!
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a href="#">
              <img src={des2} alt="App Store" className="h-12 md:h-14" />
            </a>

            <a href="#">
              <img src={des1} alt="Google Play" className="h-12 md:h-14" />
            </a>
          </div>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            ¡Atención gente politécnica! Si buscas amistad o conocer personas
            nuevas dentro del campus, Amikuna es el lugar perfecto.
            Conecta con estudiantes, forma grupos de estudio y amplía tu círculo social.
          </p>

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-400 text-center py-6">
        © {new Date().getFullYear()} <strong>AMIKUNA</strong> - Todos los derechos reservados.
      </footer>

    </>
  );
};

export default Download;
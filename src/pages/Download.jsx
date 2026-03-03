import Navbar from "../components/Navbar";
import logindes from '../assets/descarga.png';
import des1 from '../assets/googleplay.png';
import des2 from '../assets/appstore.png';

const Download = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-pink-500 to-orange-400 text-white flex  md:flex-row items-center justify-between px-6 md:px-16 py-12 gap-10">
        {/* Texto a la izquierda */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl md:text-9xl font-bold mb-6">Conoce gente nueva</h1>
          <p className="text-lg md:text-xl mb-9">Conoce gente nueva hoy mismo.</p>
          <a
  href="#"
  className="bg-white text-pink-600 font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform text-base sm:text-lg md:text-xl lg:text-2xl"
>
  Descarga Amikuna
</a>

        </div>

        {/* Logo o imagen a la derecha */}
        <div className="flex justify-center items-center w-full h-full">
  <img
    src={logindes}
    alt="Logo decorativo"
    className="w-full max-w-[90%] md:max-w-[500px] object-contain drop-shadow-lg"
  />
</div>

      </div>

      {/* Footer */}
      <footer className="bg-white py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Sección principal */}
          <div className="mb-12">
            <div className="flex justify-center mb-8">
              
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Plataformas y dispositivos compatibles
              </h2>
              </div>
              <div className="text">
              <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                Amikuna actualmente está disponible en dispositivos <strong>iOS</strong>, <strong>Android</strong> y <strong>HarmonyOS</strong>. 
                Junto con nuestras apps móviles, puedes visitar <strong>Amikuna.com</strong> para usar Amikuna para la Web.
              </p>
            </div>
            
            <div className="text">
              <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                Actualmente, Amikuna es compatible con iOS 16.0 y versiones posteriores, Android 9.0 y versiones posteriores, 
                y las versiones más recientes de los navegadores web más usados (Chrome, Firefox, Safari, Edge, etc.).
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Nueva sección Tinder-style */}
      <div className="bg-gray-50 py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Botones de descarga */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">¡Descarga la app!</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="inline-block">
                <img 
                  src={des2} 
                  alt="Descárgalo en el App Store" 
                  className="h-12 md:h-14"
                />
              </a>
              <a href="#" className="inline-block">
                <img 
                  src={des1} 
                  alt="Disponible en Google Play" 
                  className="h-12 md:h-14"
                />
              </a>
            </div>
          </div>

          {/* Texto descriptivo */}
          <div className="mb-8">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              ¡Atención, gente politecnica! si buscas el amor o la amistad quieres salir con gente nueva o solo tener algo casual, tienes que estar en Amikuna. Es el lugar perfecto para conocer a la persona ideal para ti. La verdad es que hoy en día las relaciones son muy diferentes, ya que la mayoría de las personas se conoce por Internet. Con Amikuna, la app de citas más popular, tienes en la palma de tu mano a  de personas solteras con muchas ganas de conocer a alguien como tú. En Amikuna encontrarás a alguien con quien hacer química.
            </p>
           
          </div>

          {/* Logo Amikuna */}
          <div className="flex justify-center mb-12">
            <div className="text-6xl md:text-7xl font-bold">
              <span className="text-gray-500">Amikuna</span>
              <span className="text-gray-500 text-8xl">.</span>
            </div>
          </div>

          {/* Footer links */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-wrap gap-4 md:gap-6 mb-4 md:mb-0 text-sm text-gray-600">
                <a href="#" className="hover:text-gray-800">Preguntas frecuentes</a>
                <span>/</span>
                <a href="#" className="hover:text-gray-800">Consejos de seguridad</a>
                <span>/</span>
                <a href="#" className="hover:text-gray-800">Términos</a>
                <span>/</span>
                <a href="#" className="hover:text-gray-800">Política sobre cookies</a>
                <span>/</span>
                <a href="#" className="hover:text-gray-800">Ajustes de privacidad</a>
              </div>
              <p className="text-sm text-gray-600">
                © 2025 Amikuna LLC, Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Download;
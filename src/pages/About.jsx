import Navbar from "../components/Navbar";
import equipoImg from '../assets/About.png'; // imagen principal
import historiaImg1 from '../assets/Somos1.png';
import historiaImg2 from '../assets/Chicos.png';
import historiaImg3 from '../assets/chicos1.png';

const About = () => {
  return (
    <>
      <Navbar />

      {/* Sección principal "Somos Amikuna" */}
      <section className="bg-gradient-to-br from-[#f16783] to-[#f78b50] text-white  px-6 md:px-16 py-16 rounded-3xl mx-4 md:mx-16 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Texto a la izquierda */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Somos <span className="text-white">Amikuna</span>{" "}
              <span className="inline-block animate-wiggle">👋</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              AmiKuna es una aplicación web orientada a fomentar la conexión entre estudiantes de la Escuela Politécnica Nacional, facilitando la socialización en base a intereses académicos, actividades extracurriculares y afinidades personales dentro del entorno universitario. La plataforma busca fortalecer el tejido social politécnico mediante interacciones significativas que impulsen el desarrollo de habilidades blandas clave para la vida profesional.
            </p>
          </div>

          {/* Imagen a la derecha */}
          <div className="flex-1">
            <img
              src={equipoImg}
              alt="Equipo Amikuna"
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sección Historia de Amikuna */}
      <section className="bg-white text-gray-800 px-6 md:px-16 py-16 mx-4 md:mx-16 mt-10 rounded-3xl shadow-xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">Nuestra Historia</h2>

        {/* Galería de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <img src={historiaImg1} alt="Historia 1" className="w-full h-auto rounded-xl object-cover" />
          <img src={historiaImg2} alt="Historia 2" className="w-full h-auto rounded-xl object-cover" />
          <img src={historiaImg3} alt="Historia 3" className="w-full h-auto rounded-xl object-cover" />
        </div>

        {/* Texto de historia */}
        <div className="text-lg md:text-xl text-justify text-gray-700 leading-relaxed max-w-5xl mx-auto">
          <p>
            La historia de Amikuna nace en las aulas de la Escuela Politécnica Nacional, donde un grupo de estudiantes identificó la necesidad de fortalecer los lazos humanos en un entorno académico exigente. Más allá de las clases, vimos el potencial de construir una red de apoyo, colaboración y amistad entre politécnicos. Así nació Amikuna, una plataforma construida por estudiantes, para estudiantes, con el fin de unir intereses, talentos y pasiones.
          </p>
          <p className="mt-4">
            Desde su concepción, Amikuna ha evolucionado con el objetivo de convertirse en una herramienta clave para impulsar la vida universitaria, fomentando actividades colaborativas, grupos de estudio, eventos extracurriculares y espacios de afinidad. Cada línea de código está escrita con la convicción de que la universidad no solo se trata de aprender, sino de crecer juntos.
          </p>
        </div>
      </section>

      {/* Logo Amikuna */}
      <div className="flex justify-center mt-10 mb-12">
        <div className="text-6xl md:text-7xl font-bold">
          <span className="text-gray-500">Amikuna</span>
          <span className="text-gray-500 text-8xl">.</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 pt-8 pb-6 px-6 md:px-16 mx-4 md:mx-16 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
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
          <p className="text-center md:text-right mt-2 md:mt-0">
            © 2025 Amikuna LLC, Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
};

export default About;

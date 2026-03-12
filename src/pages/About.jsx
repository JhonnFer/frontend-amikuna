import Navbar from "../components/Navbar";
import equipoImg from '../assets/About.png';
import historiaImg1 from '../assets/Somos1.png';
import historiaImg2 from '../assets/Chicos.png';
import historiaImg3 from '../assets/chicos1.png';

const About = () => {
  return (
    <>
      <Navbar />

      {/* Sección principal */}
      <section className="bg-gradient-to-br from-[#f16783] to-[#f78b50] text-white px-6 md:px-16 py-16 rounded-3xl mx-4 md:mx-16 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Somos <span className="text-white">Amikuna</span>{" "}
              <span className="inline-block animate-wiggle">👋</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200">
              AmiKuna es una aplicación web orientada a fomentar la conexión entre estudiantes
              de la Escuela Politécnica Nacional, facilitando la socialización en base a
              intereses académicos, actividades extracurriculares y afinidades personales
              dentro del entorno universitario.
            </p>
          </div>

          <div className="flex-1">
            <img
              src={equipoImg}
              alt="Equipo Amikuna"
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
            />
          </div>

        </div>
      </section>

      {/* Historia */}
      <section className="bg-white text-gray-800 px-6 md:px-16 py-16 mx-4 md:mx-16 mt-10 rounded-3xl shadow-xl">
        
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
          Nuestra Historia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <img src={historiaImg1} className="w-full rounded-xl object-cover" />
          <img src={historiaImg2} className="w-full rounded-xl object-cover" />
          <img src={historiaImg3} className="w-full rounded-xl object-cover" />
        </div>

        <div className="text-lg md:text-xl text-justify text-gray-700 leading-relaxed max-w-5xl mx-auto">
          
          <p>
            La historia de Amikuna nace en las aulas de la Escuela Politécnica Nacional,
            donde un grupo de estudiantes identificó la necesidad de fortalecer los
            lazos humanos en un entorno académico exigente.
          </p>

          <p className="mt-4">
            Desde su concepción, Amikuna ha evolucionado con el objetivo de convertirse
            en una herramienta clave para impulsar la vida universitaria, fomentando
            actividades colaborativas, grupos de estudio y eventos extracurriculares.
          </p>

        </div>

      </section>

      {/* Footer simple igual al Home */}
      <footer className="mt-10 text-sm text-gray-400 text-center py-6">
        © {new Date().getFullYear()} <strong>AMIKUNA</strong> - Todos los derechos reservados.
      </footer>

    </>
  );
};

export default About;
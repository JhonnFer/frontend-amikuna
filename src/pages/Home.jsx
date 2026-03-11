import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import fondo from "../assets/imagen3.avif";
import segundaImagen from "../assets/triste.png";
import Somos1 from "../assets/Somos1.png";
import Somos2 from "../assets/Somos2.png";

const images = [segundaImagen, Somos1, Somos2];

const Home = () => {
  return (
    <div className="flex flex-col bg-gray-100">
      {/* Sección con fondo */}
      <div
        className="relative w-auto   top-2 flex-col items-center justify-center px-4 py-10 text-white"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: "1500px",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>

        <div className="relative z-10 w-full flex-col items-start max-w-6xl mx-auto px-4 md:px-8">
          <main className="mt-10 md:mt-20">
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold mb-6 font-serif leading-tight">
              AMIKUNA - Tu red social universitaria
            </p>

            <p className="text-lg sm:text-xl md:text-2xl text-center font-poppins leading-relaxed mb-3">
              La app que conecta estudiantes de la Politécnica. Encuentra
              compañeros de estudio para esas materias difíciles, forma equipos
              colaborativos para proyectos académicos, descubre eventos del
              campus y amplía tu círculo social universitario.
              <br />
              <br />
              Conoce estudiantes de tu misma carrera o explora otras facultades.
              Desde grupos de estudio hasta actividades extracurriculares,
              AMIKUNA te ayuda a vivir la experiencia universitaria al máximo.
            </p>

            <p
              className="text-2xl sm:text-3xl md:text-4xl text-center mb-4"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Porque la universidad es mejor cuando compartes el camino con
              otros.
            </p>
          </main>
        </div>
      </div>

      {/* Segunda imagen debajo */}
      <div className="w-full h-[600px] relative mt-3">
        <div className="absolute inset-0 flex items-start justify-center pt-3 text-white text-5xl font-serif z-20">
  Conecta con estudiantes de tu universidad
</div>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="w-full h-full"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* overlay blur */}
                <div className="absolute inset-0 backdrop-blur-md bg-black/50"></div>

                {/* imagen principal */}
                <img
                  src={img}
                  className="relative z-10 h-[450px] object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Sección de texto fuera de la imagen */}
      <section className="max-w-5xl mx-auto mt-10 px-4 text-black text-sm sm:text-base md:text-lg leading-relaxed">
        <p>
          ¿Te cuesta socializar en el campus? ¿Quieres conocer compañeros de tu
          carrera o de otras facultades? ¿Buscas formar grupos de estudio,
          encontrar amigos para proyectos o simplemente ampliar tu círculo
          social? AMIKUNA es la app perfecta para ti.
        </p>

        <p className="mt-4">
          Sabemos que muchos estudiantes llegan a la universidad sin conocer a
          nadie, y a veces es difícil romper el hielo en clases o en los
          pasillos. Con AMIKUNA, tienes en la palma de tu mano a miles de
          estudiantes universitarios que, como tú, buscan conectar con otros
          compañeros.
        </p>
      </section>

      {/* Footer fijo al fondo */}
      <footer className="mt-10 text-sm text-gray-400 text-center py-6">
        © {new Date().getFullYear()} <strong>AMIKUNA</strong> - Todos los
        derechos reservados.
      </footer>
    </div>
  );
};

export default Home;

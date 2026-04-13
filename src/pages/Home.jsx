import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import Footer from "../pages/Footer";

import segundaImagen from "../assets/triste.png";
import Somos1 from "../assets/Somos1.png";
import Somos2 from "../assets/Somos2.png";

/* ─── hook de reveal ─── */
const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

/* ─── Tarjeta de característica ─── */
const FeatureCard = ({ icon, title, desc, delay }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f16783]/8 to-[#f78b50]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ backgroundColor: "#fdf0f2" }}
      >
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

/* ─── Paso de cómo funciona ─── */
const StepItem = ({ number, title, desc, delay }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="flex gap-5 items-start"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-30px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
      >
        {number}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

const images = [segundaImagen, Somos1, Somos2];

const Home = () => {
  const [heroRef, heroVisible] = useReveal();
  const [swiperRef, swiperVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  const features = [
    { icon: "🎯", title: "Matching Recíproco", desc: "Conecta con tus compañeros de manera digital y colaborativa dentro del campus.", delay: 0 },
    { icon: "🗓️", title: "Eventos Institucionales", desc: "escubre y organiza actividades extracurriculares, talleres y encuentros estudiantiles.", delay: 100 },
    { icon: "💬", title: "Interacción Directa", desc: "Comunícate directamente con otros estudiantes y comparte ideas.", delay: 200 },
    { icon: "🏛️", title: "Comunidad Politécnica", desc: "Un espacio digital diseñado por y para estudiantes de la EPN, fortaleciendo la identidad y el apoyo mutuo.", delay: 300 },
  ];

  const steps = [
    { number: "1", title: "Crea tu perfil universitario", desc: "Regístrate con tu correo institucional EPN y completa tu perfil con carrera, semestre e intereses.", delay: 0 },
    { number: "2", title: "Descubre tu comunidad", desc: "El sistema sugiere estudiantes de toda la EPN mediante un descubrimiento de pares", delay: 100 },
    { number: "3", title: "Conecta y fortalece la comunidad", desc: "Inicia conversaciones, participa en eventos y construye vínculos significativos dentro de la familia politécnica", delay: 200 },
  ];

  return (
    <div className="bg-[#fafaf8] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative mx-4 md:mx-16 mt-10 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a0a0f] via-[#2d1018] to-[#1a0a0f] min-h-[85vh] flex items-center">
        {/* blobs decorativos */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#f16783]/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#f78b50]/15 blur-3xl" />
        </div>
        {/* patrón de puntos */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 py-20 w-full flex flex-col md:flex-row items-center gap-16"
        >
          {/* texto */}
          <div
            className="flex-1 text-white"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(60px)",
              transition: "opacity 0.9s ease, transform 0.9s ease",
            }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.35em] uppercase text-[#f78b50] bg-[#f78b50]/10 px-4 py-2 rounded-full mb-6">
              Escuela Politécnica Nacional
            </span>
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              La universidad{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
              >
                mejor juntos
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Amikuna conecta a los estudiantes politécnicos para estudiar, colaborar
              y vivir la experiencia universitaria al máximo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
              >
                Empieza gratis
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-bold text-lg border border-white/20 hover:border-white/50 transition-all duration-300"
              >
                Conoce más
              </a>
            </div>
          </div>

          {/* slider */}
          <div
            className="flex-1 w-full max-w-md"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "scale(1) rotate(0deg)" : "scale(0.85) rotate(-3deg)",
              transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
            }}
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#f16783]/40 to-[#f78b50]/30 blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ height: "360px" }}>
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{ delay: 3200 }}
                  loop={true}
                  className="w-full h-full"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img}
                        alt={`Amikuna slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="mx-4 md:mx-16 my-10">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f16783] mb-2">
            Por qué Amikuna
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
            Todo lo que necesitas
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section
        ref={swiperRef}
        className="mx-4 md:mx-16 mb-10"
      >
        <div className="flex flex-col md:flex-row gap-10 items-center bg-gradient-to-br from-[#fff8f9] to-[#fff5f0] rounded-3xl border border-[#f16783]/10 px-10 py-14">
          {/* pasos */}
          <div
            className="flex-1"
            style={{
              opacity: swiperVisible ? 1 : 0,
              transform: swiperVisible ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f16783] mb-3">
              Así de sencillo
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Georgia', serif" }}>
              ¿Cómo funciona Amikuna?
            </h2>
            <div className="flex flex-col gap-7">
              {steps.map((s, i) => <StepItem key={i} {...s} />)}
            </div>
            <a
              href="/register"
              className="inline-flex items-center gap-2 mt-10 px-8 py-4 rounded-full text-white font-bold transition-all duration-300 hover:scale-105"
              style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
            >
              Unirme ahora →
            </a>
          </div>

          {/* imagen decorativa con texto superpuesto */}
          <div
            className="flex-1 w-full relative"
            style={{
              opacity: swiperVisible ? 1 : 0,
              transform: swiperVisible ? "scale(1)" : "scale(0.92)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            <div className="relative rounded-2xl overflow-hidden" style={{ height: "420px" }}>
              <img src={Somos1} alt="Estudiantes EPN" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a0f]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p
                  className="text-white text-2xl font-bold"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  +5,000 estudiantes ya conectados
                </p>
                <p className="text-white/70 text-sm mt-1">Únete a la comunidad politécnica</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEXTO NARRATIVO ── */}
      <section className="mx-4 md:mx-16 mb-10 bg-white rounded-3xl border border-gray-100 shadow-sm px-10 md:px-16 py-14">
        {(() => {
          const [ref, visible] = useReveal();
          return (
            <div
              ref={ref}
              className="max-w-3xl mx-auto text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f16783] mb-4">
                Nuestra razón de ser
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Georgia', serif" }}>
                Porque la universidad es mejor cuando la compartes
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Muchos estudiantes llegan a la EPN sin conocer a nadie, y a veces es difícil
                romper el hielo en clases o en los pasillos. Con Amikuna tienes en la palma
                de tu mano a miles de compañeros que, como tú, buscan conectar.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Desde grupos de estudio para esas materias difíciles hasta actividades
                extracurriculares, Amikuna te ayuda a vivir la experiencia universitaria al máximo.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-2 mt-8 text-[#f16783] font-bold hover:gap-3 transition-all duration-200"
              >
                Conoce nuestra historia →
              </a>
            </div>
          );
        })()}
      </section>

      {/* ── CTA FINAL ── */}
      <section
        ref={ctaRef}
        className="mx-4 md:mx-16 mb-10 rounded-3xl overflow-hidden relative"
        style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #fff 0%, transparent 60%)" }}
        />
        <div
          className="relative z-10 max-w-2xl mx-auto text-center py-20 px-8"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p className="text-white/70 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Empieza hoy
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Tu comunidad te espera
          </h2>
          <p className="text-white/80 mb-10 leading-relaxed">
            Regístrate con tu correo institucional EPN y comienza a conectar con
            miles de estudiantes politécnicos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white font-bold text-[#f16783] hover:scale-105 transition-transform"
            >
              Crear mi cuenta
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/40 text-white font-bold hover:border-white transition-colors"
            >
              Ya tengo cuenta
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
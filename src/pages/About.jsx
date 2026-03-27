import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import equipoImg from '../assets/About.png';
import historiaImg1 from '../assets/Somos1.png';
import historiaImg2 from '../assets/Chicos.png';
import historiaImg3 from '../assets/chicos1.png';
import Footer from "./Footer";

/* ─── pequeño hook para revelar elementos al hacer scroll ─── */
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

/* ─── Tarjeta de valor animada ─── */
const ValueCard = ({ icon, title, desc, delay }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="relative group bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s`,
      }}
    >
      {/* borde degradado en hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f16783]/10 to-[#f78b50]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

/* ─── Ítem de timeline ─── */
const TimelineItem = ({ year, title, desc, img, reverse, delay }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${reverse ? "60px" : "-60px"})`,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      <div className="flex-1">
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#f16783] bg-[#f16783]/10 px-3 py-1 rounded-full mb-3">
          {year}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-serif">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
      </div>
      <div className="flex-1 w-full">
        <img
          src={img}
          alt={title}
          className="w-full h-64 object-cover rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
};

const About = () => {
  const [heroRef, heroVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();

  const stats = [
    { value: "5K+", label: "Estudiantes activos" },
    { value: "12", label: "Facultades conectadas" },
    { value: "98%", label: "Satisfacción" },
    { value: "3", label: "Años de desarrollo" },
  ];

  const values = [
    {
      icon: "🤝",
      title: "Conexión auténtica",
      desc: "Creemos que las mejores amistades nacen de intereses compartidos, no de algoritmos fríos.",
      delay: 0,
    },
    {
      icon: "🎓",
      title: "Comunidad académica",
      desc: "Pensada desde adentro por estudiantes que vivieron en carne propia la soledad del primer año.",
      delay: 100,
    },
    {
      icon: "🌱",
      title: "Crecimiento mutuo",
      desc: "Grupos de estudio, proyectos colaborativos y actividades que hacen crecer a toda la comunidad.",
      delay: 200,
    },
    {
      icon: "🔒",
      title: "Espacio seguro",
      desc: "Verificación universitaria para que cada conexión sea con alguien que realmente pertenece al campus.",
      delay: 300,
    },
  ];

  return (
    <div className="bg-[#fafaf8] min-h-screen">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative mx-4 md:mx-16 mt-10 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a0a0f] to-[#2d1018]">
        {/* patrón decorativo */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #f16783 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f78b50 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        <div
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 py-20 md:py-28 flex flex-col md:flex-row items-center gap-14"
        >
          <div
            className="flex-1 text-white text-center md:text-left"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f78b50] mb-4">
              Escuela Politécnica Nacional
            </p>
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Somos{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
              >
                Amikuna
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-lg">
              Una aplicación web que transforma la manera en que los estudiantes
              politécnicos se conocen, colaboran y crecen juntos dentro del campus.
            </p>
          </div>

          <div
            className="flex-1 w-full"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "scale(1)" : "scale(0.9)",
              transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
            }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#f16783]/30 to-[#f78b50]/30 blur-xl" />
              <img
                src={equipoImg}
                alt="Equipo Amikuna"
                className="relative w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        ref={statsRef}
        className="mx-4 md:mx-16 my-10 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? "translateY(0)" : "translateY(30px)",
              transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
            }}
          >
            <p
              className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text mb-1"
              style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
            >
              {s.value}
            </p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── VALORES ── */}
      <section className="mx-4 md:mx-16 mb-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f16783] mb-2">
            Lo que nos mueve
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
            Nuestros valores
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <ValueCard key={i} {...v} />
          ))}
        </div>
      </section>

      {/* ── HISTORIA / TIMELINE ── */}
      <section className="bg-white mx-4 md:mx-16 rounded-3xl shadow-sm border border-gray-100 px-8 md:px-16 py-16 mb-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f16783] mb-2">
            De donde venimos
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
            Nuestra historia
          </h2>
        </div>

        <div className="flex flex-col gap-20 max-w-5xl mx-auto">
          <TimelineItem
            year="El comienzo"
            title="Una necesidad real"
            desc="La historia de Amikuna nace en las aulas de la Escuela Politécnica Nacional, donde un grupo de estudiantes identificó algo que muchos sienten pero pocos dicen: la soledad en un campus lleno de gente. Esa contradicción fue la chispa."
            img={historiaImg1}
            reverse={false}
            delay={0}
          />
          <TimelineItem
            year="El equipo"
            title="Construido desde adentro"
            desc="Somos estudiantes que pasamos por lo mismo. Desde las primeras líneas de código hasta el diseño de cada pantalla, cada decisión fue tomada pensando en qué necesitábamos nosotros cuando llegamos a la EPN sin conocer a nadie."
            img={historiaImg2}
            reverse={true}
            delay={100}
          />
          <TimelineItem
            year="Hoy"
            title="Una comunidad en crecimiento"
            desc="Amikuna ha evolucionado para convertirse en una herramienta clave para la vida universitaria: grupos de estudio, proyectos colaborativos, eventos y conexiones que trascienden las aulas y duran más allá de la carrera."
            img={historiaImg3}
            reverse={false}
            delay={200}
          />
        </div>
      </section>

      {/* ── MISIÓN / VISIÓN ── */}
      <section className="mx-4 md:mx-16 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            label: "Misión",
            title: "Conectar para crecer",
            desc: "Facilitar conexiones auténticas entre estudiantes universitarios, fomentando la colaboración académica y el desarrollo personal dentro del entorno politécnico.",
            gradient: "from-[#f16783] to-[#f78b50]",
          },
          {
            label: "Visión",
            title: "La red universitaria del futuro",
            desc: "Ser la plataforma de referencia para la vida universitaria en Ecuador, expandiendo la experiencia de comunidad a más instituciones de educación superior.",
            gradient: "from-[#f78b50] to-[#f16783]",
          },
        ].map((item, i) => {
          const [ref, vis] = useReveal();
          return (
            <div
              key={i}
              ref={ref}
              className={`bg-gradient-to-br ${item.gradient} text-white rounded-3xl p-10`}
              style={{
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(40px)",
                transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`,
              }}
            >
              <p className="text-xs font-bold tracking-[0.3em] uppercase opacity-70 mb-2">
                {item.label}
              </p>
              <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Georgia', serif" }}>
                {item.title}
              </h3>
              <p className="text-white/80 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </section>
      <Footer />
    </div>
  );
};

export default About;

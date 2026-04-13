import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import logindes from '../assets/descarga.png';
import historiaImg1 from '../assets/Somos1.png';
import historiaImg2 from '../assets/Chicos.png';
import Footer from "./Footer";

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

/* ─── Tarjeta de funcionalidad grande alternada ─── */
const BigFeatureCard = ({ icon, title, desc, tag, color, delay, reverse }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      <div
        className="flex-1 flex flex-col justify-center items-start p-10 md:p-14 min-h-[200px]"
        style={{ background: color }}
      >
        <span
          className="text-4xl mb-4 tracking-widest leading-none"
          style={{ fontFamily: "'Courier New', 'Lucida Console', monospace", letterSpacing: "0.1em" }}
        >{icon}</span>
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-white/60 mb-2">{tag}</span>
        <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug">{title}</h3>
      </div>
      <div className="flex-1 bg-white flex flex-col justify-center p-10 md:p-14">
        <p className="text-gray-500 text-base leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

/* ─── Sección "¿Por qué unirte?" — reemplaza testimonios ─── */
const WhyJoin = () => {
  const [ref, visible] = useReveal();
  const reasons = [
    {
      number: "01",
      title: "Llega sin conocer a nadie, sal con tu red",
      desc: "El primer semestre es duro. Amikuna existe exactamente para ese momento: conectarte con personas reales de tu facultad desde el día uno.",
    },
    {
      number: "02",
      title: "Colabora más allá del aula",
      desc: "Proyectos interdisciplinarios, grupos de estudio, iniciativas estudiantiles. Todo empieza con una conexión en la plataforma.",
    },
    {
      number: "03",
      title: "Descubre lo que pasa en el campus",
      desc: "Eventos, talleres, hackathons y más — organizados por y para la comunidad EPN, todos en un solo lugar.",
    },
    {
      number: "04",
      title: "Un espacio solo para politécnicos",
      desc: "Acceso verificado con correo institucional. Hablas con compañeros reales de tu misma universidad, no con desconocidos del internet.",
    },
  ];

  return (
    <section className="mx-4 md:mx-16 mb-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-10 py-14">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f16783] mb-2">
            Por qué unirte
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Hecha para la realidad universitaria
          </h2>
        </div>
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 gap-8"
        >
          {reasons.map((r, i) => (
            <div
              key={i}
              className="flex gap-5 items-start"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
              }}
            >
              <span
                className="text-3xl font-bold flex-shrink-0 text-transparent bg-clip-text leading-none mt-1"
                style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
              >
                {r.number}
              </span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{r.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── CTA final limpio — solo botón a /register ─── */
const CtaFinal = () => {
  const [ref, visible] = useReveal();
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className="mx-4 md:mx-16 mb-10 rounded-3xl overflow-hidden relative"
      style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #fff 0%, transparent 60%)" }}
      />
      {/* patrón de puntos sutil */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="relative z-10 flex flex-col md:flex-row items-center gap-10 px-10 md:px-20 py-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(50px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* texto */}
        <div className="flex-1">
          <p className="text-white/70 text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Empieza ahora
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Tu comunidad universitaria te está esperando.
          </h2>
          <p className="text-white/75 leading-relaxed max-w-md">
            Crea tu cuenta con tu correo institucional EPN y empieza a conectar,
            colaborar y descubrir todo lo que tu campus tiene para ofrecer.
          </p>
        </div>

        {/* botones */}
        <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[260px]">
          <button
            onClick={() => navigate("/register")}
            className="w-full px-10 py-5 rounded-full bg-white font-bold text-[#f16783] text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg"
          >
            Crear mi cuenta
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-10 py-5 rounded-full bg-transparent font-bold text-white text-lg border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all"
          >
            Ya tengo cuenta
          </button>
        </div>
      </div>
    </section>
  );
};

const Community = () => {
  const [headerRef, headerVisible] = useReveal();

  const features = [
    {
      icon: "░▒▓",   // bloques de densidad — "procesando / IA"
      title: "Asistente IA con jerga ecuatoriana",
      desc: "¿No sabes como funciona la aplicación? Nuestro chatbot te responde 'de una'. Entiende nuestro lenguaje, te orienta sobre materias y te ayuda a no quedarte en supletorios. ¡Habla como un politécnico más!",
      tag: "Inteligencia Artificial",
      color: "linear-gradient(135deg, #f16783, #c0446a)",
      delay: 0,
      reverse: false,
    },
    {
      icon: "♥ ♥",  
      title: "Haz match con tus compañeros",
      desc: "El sistema te muestra perfiles de otros compañeros de la Escuela Politécnica Nacional promoviendo la interacción social y la creación de amigos de verdad en la EPN.",
      tag: "Conexiones",
      color: "linear-gradient(135deg, #f78b50, #e06030)",
      delay: 100,
      reverse: true,
    },
    {
      icon: "◄►",   // flechas de diálogo — "comunicación"
      title: "Chat en tiempo real",
      desc: "Habla con tus nuevas conexiones al instante dentro de la misma plataforma. Sin saltar a otras apps, sin compartir tu número. Todo dentro de Amikuna.",
      tag: "Comunicación",
      color: "linear-gradient(135deg, #f16783, #f78b50)",
      delay: 0,
      reverse: false,
    },
    {
      icon: "▣",    // cuadro con interior — "marco / galería"
      title: "Galería compartida del campus",
      desc: "Sube fotos de tus proyectos, talleres, eventos y momentos en la EPN. Construye tu presencia dentro de la comunidad y descubre lo que otros están viviendo.",
      tag: "Galería",
      color: "linear-gradient(135deg, #e06030, #c0446a)",
      delay: 100,
      reverse: true,
    },
    {
      icon: "♪♫",   // notas musicales CP437 — "celebración / evento"
      title: "Eventos del campus",
      desc: "Descubre hackathons, talleres, charlas y actividades extracurriculares organizadas por y para la comunidad EPN. Nunca más te pierdas algo interesante.",
      tag: "Eventos",
      color: "linear-gradient(135deg, #f78b50, #f16783)",
      delay: 0,
      reverse: false,
    },
    {
      icon: "☺☺",   // caritas CP437 — "personas / red"
      title: "Sigue y sé seguido",
      desc: "Crea tu red universitaria siguiendo a compañeros, proyectos y grupos que te inspiran. Construye tu comunidad dentro del campus desde el primer día.",
      tag: "Red social",
      color: "linear-gradient(135deg, #c0446a, #e06030)",
      delay: 100,
      reverse: true,
    },
    {
      icon: "◙",    
      title: "Solidaridad y Aportes",
      desc: "Apoya a la plataforma con un pequeño aporte económico para que la plataforma evolucione para todos.",
      tag: "Comunidad",
      color: "linear-gradient(135deg, #f16783, #c0446a)",
      delay: 0,
      reverse: false,
    },
  ];

  return (
    <div className="bg-[#fafaf8] min-h-screen">
      <Navbar />

      {/* ── HEADER ── */}
      <section className="mx-4 md:mx-16 mt-10 mb-6">
        <div
          ref={headerRef}
          className="rounded-3xl px-10 md:px-20 py-16 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #fff8f9 0%, #fff5f0 100%)",
            border: "1px solid rgba(241,103,131,0.15)",
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#f16783]/10" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#f78b50]/10" />
          <div className="relative z-10 max-w-2xl">
            <span
              className="inline-block text-xs font-bold tracking-[0.35em] uppercase px-4 py-2 rounded-full mb-6"
              style={{ color: "#f16783", backgroundColor: "#fdf0f2" }}
            >
              Todo lo que puedes hacer
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Amikuna no es solo{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
              >
                una red social.
              </span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
              Es tu espacio dentro de la EPN para conectar, aprender, compartir y
              hacer que la vida universitaria valga la pena — con todo lo que necesitas en un solo lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              {["IA ░▒▓", "Match ♥", "Chat ◄►", "Galería ▣", "Eventos ♪", "Aportes ◙"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-white border border-gray-200 text-gray-600 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ── */}
      <section className="mx-4 md:mx-16 mb-6">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f16783] mb-6 px-1">
          Funcionalidades
        </p>
        <div className="flex flex-col gap-4">
          {features.map((f, i) => <BigFeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* ── POR QUÉ UNIRTE (reemplaza testimonios) ── */}
      <WhyJoin />

      {/* ── CTA FINAL ── */}
      <CtaFinal />

      <Footer />
    </div>
  );
};

export default Community;
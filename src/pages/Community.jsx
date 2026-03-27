import { useEffect, useRef, useState } from "react";
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
      {/* panel de color */}
      <div
        className="flex-1 flex flex-col justify-center items-start p-10 md:p-14 min-h-[200px]"
        style={{ background: color }}
      >
        <span className="text-5xl mb-4">{icon}</span>
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-white/60 mb-2">{tag}</span>
        <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug">{title}</h3>
      </div>
      {/* panel blanco */}
      <div className="flex-1 bg-white flex flex-col justify-center p-10 md:p-14">
        <p className="text-gray-500 text-base leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

/* ─── Tarjeta de testimonio ─── */
const TestimonialCard = ({ quote, name, career, emoji, delay }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="bg-[#fafaf8] rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <p className="text-gray-600 leading-relaxed mb-6 text-sm">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg shadow-sm">
          {emoji}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{name}</p>
          <p className="text-gray-400 text-xs">{career}</p>
        </div>
      </div>
    </div>
  );
};

const Community = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [ctaRef, ctaVisible] = useReveal();
  const [headerRef, headerVisible] = useReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  const features = [
    {
      icon: "🤖",
      title: "Chatbot con IA siempre disponible",
      desc: "¿Tienes una duda a las 11pm antes del parcial? El asistente de IA de Amikuna te ayuda con preguntas académicas, orientación sobre materias y mucho más. Sin juicios, sin horarios.",
      tag: "Inteligencia Artificial",
      color: "linear-gradient(135deg, #f16783, #c0446a)",
      delay: 0,
      reverse: false,
    },
    {
      icon: "💫",
      title: "Haz match con tus compañeros",
      desc: "El sistema analiza tu carrera, semestre e intereses para sugerirte estudiantes con quienes realmente tienes cosas en común. Como tinder, pero para hacer amigos de verdad en la EPN.",
      tag: "Conexiones",
      color: "linear-gradient(135deg, #f78b50, #e06030)",
      delay: 100,
      reverse: true,
    },
    {
      icon: "💬",
      title: "Chat en tiempo real",
      desc: "Habla con tus nuevas conexiones al instante dentro de la misma plataforma. Sin saltar a otras apps, sin compartir tu número. Todo dentro de Amikuna.",
      tag: "Comunicación",
      color: "linear-gradient(135deg, #f16783, #f78b50)",
      delay: 0,
      reverse: false,
    },
    {
      icon: "🖼️",
      title: "Galería compartida del campus",
      desc: "Sube fotos de tus proyectos, talleres, eventos y momentos en la EPN. Construye tu presencia dentro de la comunidad y descubre lo que otros están viviendo.",
      tag: "Galería",
      color: "linear-gradient(135deg, #e06030, #c0446a)",
      delay: 100,
      reverse: true,
    },
    {
      icon: "🎉",
      title: "Eventos del campus",
      desc: "Descubre hackathons, talleres, charlas y actividades extracurriculares organizadas por y para la comunidad EPN. Nunca más te pierdas algo interesante.",
      tag: "Eventos",
      color: "linear-gradient(135deg, #f78b50, #f16783)",
      delay: 0,
      reverse: false,
    },
    {
      icon: "👥",
      title: "Sigue y sé seguido",
      desc: "Crea tu red universitaria siguiendo a compañeros, proyectos y grupos que te inspiran. Construye tu comunidad dentro del campus desde el primer día.",
      tag: "Red social",
      color: "linear-gradient(135deg, #c0446a, #e06030)",
      delay: 100,
      reverse: true,
    },
    {
      icon: "💛",
      title: "Aportes entre compañeros",
      desc: "Apoya iniciativas, causas y proyectos de tus compañeros con pequeñas contribuciones. La comunidad también se construye desde la solidaridad.",
      tag: "Comunidad",
      color: "linear-gradient(135deg, #f16783, #c0446a)",
      delay: 0,
      reverse: false,
    },
  ];

  const testimonials = [
    {
      quote: "La uso todos los días para ver qué eventos hay. Ya fui a dos talleres que no hubiera sabido que existían.",
      name: "Andrés P.",
      career: "Ing. Mecánica - 4to semestre",
      emoji: "⚙️",
      delay: 0,
    },
    {
      quote: "Me parece una app muy entretenida, uno termina explorando perfiles y encontrando gente cool de otras facultades.",
      name: "Camila V.",
      career: "Diseño - 3er semestre",
      emoji: "🎨",
      delay: 100,
    },
    {
      quote: "El chatbot me salvó en Física. Le pregunté lo mismo tres veces y me lo explicó diferente cada vez hasta que entendí.",
      name: "Diego S.",
      career: "Ing. Eléctrica - 2do semestre",
      emoji: "⚡",
      delay: 200,
    },
    {
      quote: "Hice match con alguien de mi misma materia optativa y ahora estudiamos juntos cada semana.",
      name: "Isabella R.",
      career: "Biotecnología - 5to semestre",
      emoji: "🧬",
      delay: 300,
    },
  ];

  return (
    <div className="bg-[#fafaf8] min-h-screen">
      <Navbar />

      {/* ── HEADER — claro y amplio, muy diferente al hero oscuro del Home ── */}
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
              {["IA 🤖", "Match 💫", "Chat 💬", "Galería 🖼️", "Eventos 🎉", "Aportes 💛"].map((tag) => (
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

      {/* ── FUNCIONALIDADES — tarjetas grandes alternadas ── */}
      <section className="mx-4 md:mx-16 mb-6">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f16783] mb-6 px-1">
          Funcionalidades
        </p>
        <div className="flex flex-col gap-4">
          {features.map((f, i) => <BigFeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="mx-4 md:mx-16 mb-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-10 py-14">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#f16783] mb-2">
              Lo que dicen
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Estudiantes reales, experiencias reales
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL — horizontal en desktop ── */}
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
          className="relative z-10 flex flex-col md:flex-row items-center gap-10 px-10 md:px-16 py-16"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="flex-1">
            <p className="text-white/70 text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Empieza ahora
            </p>
            <h2
              className="text-3xl md:text-5xl font-bold text-white mb-3"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {submitted ? "¡Te esperamos adentro!" : "Ya son más de 5,000 estudiantes."}
            </h2>
            <p className="text-white/80 leading-relaxed max-w-md">
              {submitted
                ? "Revisa tu correo institucional para confirmar tu registro."
                : "Regístrate con tu correo EPN y empieza a conectar hoy mismo."}
            </p>
          </div>
          <div className="flex-1 w-full max-w-md">
            {!submitted ? (
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="tu.nombre@epn.edu.ec"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-full bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-white backdrop-blur-sm"
                />
                <button
                  onClick={handleSubmit}
                  className="w-full px-8 py-4 rounded-full bg-white font-bold text-[#f16783] hover:scale-105 transition-transform"
                >
                  Unirme a la comunidad
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-white/20 text-white px-8 py-4 rounded-full border border-white/30">
                <span className="text-2xl">✓</span>
                <span className="font-bold">Registro enviado — revisa tu correo</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Community;
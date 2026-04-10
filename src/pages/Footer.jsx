const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const developers = [
  { handle: "@duck_mc666",    url: "https://www.instagram.com/duck_mc666" },
  { handle: "@jhonnfer_23",   url: "https://www.instagram.com/jhonnfer_23/" },
];

const Footer = () => {
  return (
    <footer className="bg-[#1a0a0f] text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* línea divisora superior con degradado */}
        <div
          className="h-px w-full mb-10"
          style={{ backgroundImage: "linear-gradient(90deg, transparent, #f16783, #f78b50, transparent)" }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 pb-10">

          {/* ── Marca ── */}
          <div className="flex-1">
            <p
              className="text-3xl font-bold text-transparent bg-clip-text tracking-wide"
              style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)", fontFamily: "'Georgia', serif" }}
            >
              AMIKUNA
            </p>
            <p className="text-gray-400 text-xs mt-2 tracking-widest uppercase">
              Tu red social universitaria
            </p>
            <p className="text-gray-500 text-xs mt-3" style={{ fontFamily: "'Courier New', monospace" }}>
              ░ EPN · Quito, Ecuador ░
            </p>
          </div>

          {/* ── Desarrolladores ── */}
          <div className="flex-1 flex flex-col items-start md:items-center gap-4">
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase"
              style={{ color: "#f16783" }}
            >
              Desarrollado por
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {developers.map(({ handle, url }) => (
                <a
                  key={handle}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[#f16783]/60 hover:bg-[#f16783]/5 transition-all duration-300"
                >
                  <span
                    className="text-gray-400 group-hover:text-[#f16783] transition-colors duration-300"
                  >
                    <InstagramIcon />
                  </span>
                  <span className="text-gray-300 group-hover:text-white text-sm transition-colors duration-300">
                    {handle}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Copyright ── */}
          <div className="flex-1 flex flex-col items-start md:items-end gap-1">
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} AMIKUNA
            </p>
            <p className="text-gray-400 text-xs">
              Todos los derechos reservados.
            </p>
            <p
              className="text-gray-500 text-xs mt-2 tracking-widest"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              ▓▒░ beta v1.0 ░▒▓
            </p>
          </div>

        </div>

        {/* línea divisora inferior */}
        <div
          className="h-px w-full"
          style={{ backgroundImage: "linear-gradient(90deg, transparent, #f16783, #f78b50, transparent)" }}
        />

        {/* crédito final pequeño */}
        <p className="text-center text-gray-500 text-xs py-4 tracking-widest" style={{ fontFamily: "'Courier New', monospace" }}>
        </p>

      </div>
    </footer>
  );
};

export default Footer;
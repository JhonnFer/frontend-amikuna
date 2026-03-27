const Footer = () => {
  return (
    <div className="bg-[#1a0a0f] text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p
            className="text-2xl font-bold text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #f16783, #f78b50)" }}
          >
            AMIKUNA
          </p>
          <p className="text-gray-500 text-xs mt-1">Tu red social universitaria</p>
        </div>
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} AMIKUNA — Todos los derechos reservados.
        </p>
        <div className="flex gap-6 text-gray-500 text-xs">
          <a href="#" className="hover:text-[#f16783] transition-colors">Privacidad</a>
          <a href="#" className="hover:text-[#f16783] transition-colors">Términos</a>
          <a href="#" className="hover:text-[#f16783] transition-colors">Contacto</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
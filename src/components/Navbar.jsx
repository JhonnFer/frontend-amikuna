import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logoAmikuna from "../assets/Logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const activeClass = "text-pink-600 px-4 py-2 rounded-lg font-semibold transition-colors duration-300";
  const baseClass = "text-black px-6 py-2 rounded-lg transition-colors duration-300 hover:text-pink-600";

  return (
    <div className="bg-white text-black">
<nav className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between h-auto py-6 md:py-0 px-4 md:px-8 font-poppins">

        {/* Logo + Botón hamburguesa */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <img src={logoAmikuna} alt="Logo" className="w-24 h-24 object-contain flex-shrink-0" />

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              <svg className="w-8 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Enlaces para desktop */}
        <div className="hidden md:flex gap-4 ml-4">
          <NavLink to="/" className={({ isActive }) => `${isActive ? activeClass : baseClass} text-xs md:text-sm whitespace-nowrap select-none`}>Inicio</NavLink>
          <NavLink to="/download" className={({ isActive }) => `${isActive ? activeClass : baseClass} text-xs md:text-sm whitespace-nowrap select-none`}>Descarga</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${isActive ? activeClass : baseClass} text-xs md:text-sm whitespace-nowrap select-none ml-[-16px]`}>¿Quiénes somos?</NavLink>
        </div>

        {/* Botones para desktop */}
        <div className="hidden md:flex gap-4">
          <NavLink to="/login">
            <button className="px-4 py-2 rounded-full bg-white text-black font-semibold border border-black hover:text-pink-600 active:text-pink-600 focus:outline-none text-xs md:text-sm whitespace-nowrap select-none transition-colors duration-300">
              Iniciar sesión
            </button>
          </NavLink>
          <NavLink to="/register">
            <button className="px-4 py-2 rounded-full bg-white text-black font-semibold border border-black hover:text-pink-600 active:text-pink-600 focus:outline-none text-xs md:text-sm whitespace-nowrap select-none transition-colors duration-300">
              Registrate
            </button>
          </NavLink>
        </div>

        {/* Menú desplegable mobile */}
        {isOpen && (
          <div className="w-full mt-4 md:hidden flex flex-col items-center gap-4">
            <NavLink to="/" onClick={() => setIsOpen(false)} className="text-black hover:text-pink-600">Inicio</NavLink>
            <NavLink to="/download" onClick={() => setIsOpen(false)} className="text-black hover:text-pink-600">Descarga</NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)} className="text-black hover:text-pink-600">¿Quiénes somos?</NavLink>
            <NavLink to="/login" onClick={() => setIsOpen(false)} className="text-black hover:text-pink-600">Iniciar sesión</NavLink>
            <NavLink to="/register" onClick={() => setIsOpen(false)} className="text-black hover:text-pink-600">Registrate</NavLink>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

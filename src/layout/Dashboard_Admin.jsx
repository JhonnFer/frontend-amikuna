// src/layout/Dashboard_Admin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/storeAuth";

import PerfilAdmin from "../components/Dashboard_Admin/PerfilAdmin";
import CambiarPasswordAdmin from "../components/Dashboard_Admin/CambiarPasswordAdmin";
import EventList from "../components/Dashboard_Admin/EventList";
import UserList from "../components/Dashboard_Admin/UserList";
import MisStrikes from "../components/Dashboard_Admin/MisStrikes";
import Tesoreria from "../components/Dashboard_Admin/Tesoreria";

const TABS = ["perfil", "eventos", "usuarios", "strikes", "tesoreria"];

const Dashboard_Admin = () => {
  const logout = useAuth((state) => state.logout);
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-8 md:px-12 lg:px-20">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-300">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 md:mb-0">
          Panel de Administrador
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium text-lg">
            Hola, {user?.nombre || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="mb-8 overflow-x-auto">
        <ul className="flex flex-nowrap gap-8">
          {TABS.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-medium cursor-pointer pb-2 whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab
                  ? "border-b-4 border-blue-600 text-blue-600 font-bold"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </nav>

      {/* CONTENIDO */}
      <div className="space-y-8">
        {activeTab === "perfil" && (
          <div className="space-y-8">
            <PerfilAdmin />
            <CambiarPasswordAdmin />
          </div>
        )}
        {activeTab === "eventos"    && <EventList />}
        {activeTab === "usuarios"   && <UserList />}
        {activeTab === "strikes"    && <MisStrikes />}
        {activeTab === "tesoreria"  && <Tesoreria />}
      </div>
    </div>
  );
};

export default Dashboard_Admin;
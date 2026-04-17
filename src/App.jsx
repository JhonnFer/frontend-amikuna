import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef } from "react";

import storeAuth from "./context/storeAuth";
import storeProfile from "./context/storeProfile";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NuevoPassword from "./pages/NuevoPassword";
import ForgotAdministrador from "./pages/ForgotAdministrador";
import ConfirmarCuenta from "./pages/ConfirmarCuenta";
import Dashboard_Admin from "./layout/Dashboard_Admin";
import Dashboard_Users from "./layout/Dashboard_Users";
import Forbidden from "./pages/Forbidden";
import FormularioCompletarPerfil from "./components/Dashboard_User/FormularioCompletarPerfil";
import Download from "./pages/Community";
import About from "./pages/About";
import GoogleSuccess from "./pages/GoogleSuccess";

import { socket } from "./helpers/socket";

function App() {
  const token = storeAuth((state) => state.token);
  const clearProfile = storeProfile((state) => state.clearProfile);
  const loadProfile = storeProfile((state) => state.loadProfile);  // ✅ añadir
  const user = storeAuth((state) => state.user);  
  const socketInitialized = useRef(false);                 // ✅ añadir

  useEffect(() => {
    if (!token) {
      clearProfile();
    }
  }, [token]);

  // ✅ Cargar perfil cuando hay token y es estudiante
  useEffect(() => {
  if (token && user?.rol === "estudiante") {
    loadProfile();
  }
}, [token]);



useEffect(() => {
  if (token && !socketInitialized.current) {
    console.log("🔐 Conectando socket UNA SOLA VEZ...");

    socket.auth = { token };
    socket.connect();

    socketInitialized.current = true;
  }

  if (!token && socket.connected) {
    console.log("🔌 Desconectando socket...");
    socket.disconnect();
    socketInitialized.current = false;
  }
}, [token]);

  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        {/* Public routes protegidas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/download" element={<Download />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Públicas */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/confirmar/:token" element={<><Navbar /><ConfirmarCuenta /></>} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/forgot2" element={<ForgotAdministrador />} />
        <Route path="/nuevopassword/:token" element={<NuevoPassword />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />

        {/* Protegidas */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard_Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute requiredRole="estudiante">
              <Dashboard_Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/completar-perfil"
          element={
            <ProtectedRoute requiredRole="estudiante">
              <FormularioCompletarPerfil />
            </ProtectedRoute>
          }
        />

        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
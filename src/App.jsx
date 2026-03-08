import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

import storeProfile from './context/storeProfile';
import storeAuth from './context/storeAuth';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import NuevoPassword from './pages/NuevoPassword';
import ForgotAdministrador from './pages/ForgotAdministrador';
import ConfirmarCuenta from './pages/ConfirmarCuenta';
import Dashboard_Admin from './layout/Dashboard_Admin';
import Dashboard_Users from './layout/Dashboard_Users';
import Forbidden from './pages/Forbidden';
import FormularioCompletarPerfil from './components/Dashboard_User/FormularioCompletarPerfil';
import Download from './pages/Download';
import About from './pages/About';
import GoogleSuccess from "./pages/GoogleSuccess";

function App() {
  const loadProfile = storeProfile(state => state.loadProfile);
  const token = storeAuth(state => state.token);

  const profile = storeProfile((state) => state.profile);
  useEffect(() => {
  if (token && !profile) {
    loadProfile();
  }
}, [token]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Rutas públicas protegidas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/download" element={<Download />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Rutas públicas normales */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/confirmar/:token" element={<><Navbar /><ConfirmarCuenta /></>} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/forgot2" element={<ForgotAdministrador />} />
        <Route path="/recuperarPassword/:token" element={<NuevoPassword />} />
        <Route path="/admin/cambiar-password" element={<ForgotAdministrador />} />
        <Route path="/admin/generar-nueva-password" element={<ForgotAdministrador />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
        {/* Rutas protegidas por rol */}
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
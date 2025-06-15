import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import NuevoPassword from "./pages/NuevoPassword";
import ForgotAdministrador from "./pages/ForgotAdministrador";
import ConfirmarCuenta from "./pages/ConfirmarCuenta";
import RedirigirConfirmacion from "./pages/RedirigirConfirmacion";


function App() {
  return (
    <BrowserRouter>
      {/* ✅ Aquí va solo UNA VEZ el ToastContainer */}
      <ToastContainer />

      <Routes>
        {/* Rutas con Navbar */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/confirmar/:token" element={<><Navbar /><ConfirmarCuenta /></>} />
        <Route path="/forgot" element={<ForgotPassword />} />
         <Route path="/forgot2" element={<ForgotAdministrador />} />
        <Route path="/recuperarPassword/:token" element={<><Navbar /><NuevoPassword /></>} />
        <Route path="/admin/cambiar-password" element={<><Navbar /><ForgotAdministrador /></>} />
        <Route path="/admin/generar-nueva-password" element={<><Navbar /><ForgotAdministrador /></>} />
        <Route path="/api/confirmar/:token" element={<RedirigirConfirmacion />} />
        



        {/* Rutas SIN Navbar */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

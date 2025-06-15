import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const ConfirmarCuenta = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const ejecutado = useRef(false); // bandera para evitar doble ejecución

  useEffect(() => {
    if (ejecutado.current) return; // si ya se ejecutó, no vuelve a ejecutar
    ejecutado.current = true;

    const confirmarCuenta = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/confirmar/${token}`; // Revisa si tu ruta backend tiene prefijo /api
        const { data } = await axios.get(url);

        if (data.msg.includes("ya ha sido confirmada")) {
          toast.info(data.msg);
        } else if (data.msg.includes("Token confirmado")) {
          toast.success(data.msg);
        } else {
          toast.success(data.msg);
        }

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Token inválido o expirado");
      }
    };

    confirmarCuenta();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gradient-to-r from-orange-100 to-yellow-200">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-4 text-[#B5651D]">Confirmando cuenta...</h1>
      <p className="text-lg text-gray-700">Por favor espera mientras procesamos tu confirmación.</p>
    </div>
  );
};

export default ConfirmarCuenta;

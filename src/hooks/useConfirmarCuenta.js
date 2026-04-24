//src\hooks\useConfirmarCuenta.js
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetchDataBackend from "../helpers/fetchDataBackend";

const useConfirmarCuenta = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const ejecutado = useRef(false);

  const [status, setStatus] = useState("loading"); 
  // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (ejecutado.current) return;
    ejecutado.current = true;

    const confirmar = async () => {
      try {
        const response = await fetchDataBackend(
          `confirmar/${token}`,
          null,
          "GET",
          false
        );

        if (!response?.success) {
          setStatus("error");
          setMessage(response?.msg || "Error al confirmar");
          return;
        }

        setStatus("success");
        setMessage(response.msg);

      } catch (error) {
        setStatus("error");
        setMessage(error?.message || "Token inválido o expirado");
      } finally {
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    };

    confirmar();
  }, [token, navigate]);

  return {
    status,
    message,
  };
};

export default useConfirmarCuenta;
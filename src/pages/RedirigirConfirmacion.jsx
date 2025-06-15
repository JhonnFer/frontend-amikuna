import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RedirigirConfirmacion = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige automáticamente al frontend correcto
    navigate(`/confirmar/${token}`);
  }, [token, navigate]);

  return <p>Redirigiendo...</p>;
};

export default RedirigirConfirmacion;

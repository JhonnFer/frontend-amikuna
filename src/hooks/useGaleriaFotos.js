import { useState } from "react";
import getAuthHeaders from "../helpers/getAuthHeaders";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}estudiantes`;

const useGaleriaFotos = (cargarPerfil) => {
  const [loading, setLoading] = useState(false);
  const [fotosSeleccionadas, setFotosSeleccionadas] = useState([]);

  // ✅ SUBIR
  const subirFotos = async () => {
    try {
      if (fotosSeleccionadas.length === 0) {
        throw new Error("Selecciona al menos una imagen");
      }

      setLoading(true);

      const formData = new FormData();

      fotosSeleccionadas.forEach((foto) => {
        formData.append("imagenesGaleria", foto);
      });

      const res = await fetch(`${BASE_URL}/galeria`, {
        method: "POST",
        headers: {
          Authorization: getAuthHeaders().Authorization,
        },
        body: formData,
      });

      const text = await res.text();
      console.log("UPLOAD RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      if (!res.ok) throw new Error(data.msg);

      await cargarPerfil();
      setFotosSeleccionadas([]);

      return { ok: true, msg: "Fotos subidas correctamente" };

    } catch (error) {
      return { ok: false, msg: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR (POR URL - CORRECTO)
  const eliminarFoto = async (url) => {
  try {
    setLoading(true);

    const res = await fetch(`${BASE_URL}/galeria`, {
      method: "DELETE",
      headers: {
        Authorization: getAuthHeaders().Authorization, // ✅ igual que en subirFotos
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

      const text = await res.text();
      console.log("DELETE RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      if (!res.ok) throw new Error(data.msg);

      await cargarPerfil();

      return { ok: true, msg: "Imagen eliminada" };

    } catch (error) {
      return { ok: false, msg: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ⚠️ OPCIONAL (si usas PUT)
  const reemplazarFoto = async (index, nuevaFoto) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("imagen", nuevaFoto);

      const res = await fetch(`${BASE_URL}/galeria/${index}`, {
        method: "PUT",
        headers: {
          Authorization: getAuthHeaders().Authorization,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg);

      await cargarPerfil();

      return { ok: true };

    } catch (error) {
      return { ok: false, msg: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    fotosSeleccionadas,
    setFotosSeleccionadas,
    subirFotos,
    eliminarFoto,
    reemplazarFoto,
    loading,
  };
};

export default useGaleriaFotos;
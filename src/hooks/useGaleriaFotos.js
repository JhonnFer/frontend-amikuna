// src/hooks/useGaleriaFotos.js
import { useState } from "react";
import fetchDataBackend from "../helpers/fetchDataBackend";

const useGaleriaFotos = (cargarPerfil) => {
  const [loading, setLoading] = useState(false);
  const [fotosSeleccionadas, setFotosSeleccionadas] = useState([]);

  // SUBIR
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

      await fetchDataBackend("estudiantes/galeria", formData, "POST");
      await cargarPerfil();
      setFotosSeleccionadas([]);

      return { ok: true, msg: "Fotos subidas correctamente" };
    } catch (error) {
      return { ok: false, msg: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR
  const eliminarFoto = async (url) => {
    try {
      setLoading(true);

      await fetchDataBackend("estudiantes/galeria", { url }, "DELETE");
      await cargarPerfil();

      return { ok: true, msg: "Imagen eliminada" };
    } catch (error) {
      return { ok: false, msg: error.message };
    } finally {
      setLoading(false);
    }
  };

  // REEMPLAZAR
  const reemplazarFoto = async (index, nuevaFoto) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("imagen", nuevaFoto);

      await fetchDataBackend(`estudiantes/galeria/${index}`, formData, "PUT");
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
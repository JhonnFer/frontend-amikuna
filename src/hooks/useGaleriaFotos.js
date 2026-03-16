import storeAuth from "../context/storeAuth";

const useGaleriaFotos = (cargarPerfil) => {

  const subirFotosGaleria = async (fotosSeleccionadas) => {

    if (fotosSeleccionadas.length === 0) {
      alert("Selecciona al menos una foto");
      return;
    }

    const formData = new FormData();

    fotosSeleccionadas.forEach((foto) => {
      formData.append("imagenesGaleria", foto);
    });

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}estudiantes/galeria`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storeAuth.getState().token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.msg);

    await cargarPerfil();
  };

  return { subirFotosGaleria };
};

export default useGaleriaFotos;
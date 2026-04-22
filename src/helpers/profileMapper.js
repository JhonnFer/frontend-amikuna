export const buildProfileFormData = (data) => {
  const form = new FormData();

  form.append("nombre", data.nombre);
  form.append("apellido", data.apellido);
  form.append("biografia", data.biografia);
  form.append("genero", data.genero);
  form.append("orientacion", data.orientacion);
  form.append("fechaNacimiento", data.fechaNacimiento);
  form.append("ubicacion[ciudad]", data.ciudad);
  form.append("ubicacion[pais]", data.pais);

  if (data.imagenArchivo) {
    form.append("imagenPerfil", data.imagenArchivo);
  }

  return form;
};
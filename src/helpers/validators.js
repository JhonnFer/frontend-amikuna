
// src/helpers/validators.js

// ─── Reglas primitivas ───────────────────────────────────────────
const rules = {
  required: (value) =>
    value !== undefined && value !== null && String(value).trim() !== ""
      ? null
      : "Este campo es obligatorio.",

  minLength: (min) => (value) =>
    String(value).trim().length >= min
      ? null
      : `Mínimo ${min} caracteres.`,

  maxLength: (max) => (value) =>
    String(value).trim().length <= max
      ? null
      : `Máximo ${max} caracteres.`,

  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? null
      : "Correo electrónico inválido.",

  onlyLetters: (value) =>
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)
      ? null
      : "Solo se permiten letras.",

  numeric: (value) =>
    /^\d+$/.test(value)
      ? null
      : "Solo se permiten números.",

  passwordStrong: (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
      ? null
      : "Mínimo 8 chars, mayúscula, número y símbolo.",

  matchField: (otherValue, label = "los campos") => (value) =>
    value === otherValue
      ? null
      : `${label} no coinciden.`,

  url: (value) =>
    /^https?:\/\/.+/.test(value)
      ? null
      : "URL inválida.",
  // Agrega dentro del objeto rules:

noSpaces: (value) =>
  /\s/.test(String(value).trim())
    ? "No se permiten espacios."
    : null,

selectRequired: (value) =>
  !value || value === ""
    ? "Selecciona una opción."
    : null,

minAge: (minYears) => (value) => {
  if (!value) return "La fecha es obligatoria.";
  const nacimiento = new Date(value);
  if (isNaN(nacimiento.getTime())) return "Fecha inválida.";
  const hoy = new Date();
  const edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumplio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() >= nacimiento.getDate());
  return (cumplio ? edad : edad - 1) >= minYears
    ? null
    : `Debes tener al menos ${minYears} años.`;
},

};

// ─── Función principal ────────────────────────────────────────────
/**
 * Valida un objeto de datos contra un schema de reglas.
 * 
 * @param {Object} data   - { nombre: "Juan", email: "..." }
 * @param {Object} schema - { nombre: [rules.required, rules.minLength(2)], ... }
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validate = (data, schema) => {
  const errors = {};

  for (const field in schema) {
    const fieldRules = schema[field];
    for (const rule of fieldRules) {
      const error = rule(data[field] ?? "");
      if (error) {
        errors[field] = error;
        break; // Un error por campo es suficiente
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export { rules };
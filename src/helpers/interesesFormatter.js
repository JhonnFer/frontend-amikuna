/**
 * Helper centralizado para transformar el campo "intereses"
 *
 * Maneja conversiones:
 * - Backend → Frontend: array o JSON string → string limpio (ej: "fútbol, música, cine")
 * - Frontend → Backend: string limpio → array JSON (formato aceptado por el backend)
 */

/**
 * Transforma datos del backend a string limpio para mostrar en el formulario
 * Maneja múltiples formatos:
 * - Array de strings simples: ["dbz", "goku"] → "dbz, goku"
 * - JSON string: '["dbz","goku"]' → "dbz, goku"
 * - Array con escaping anidado: ["[\"dbz\"", "\"goku\""] → "dbz, goku"
 * - String con corchetes y comillas: '["dbz, goku"]' → "dbz, goku"
 * - String simple: "dbz, goku" → "dbz, goku"
 *
 * @param {Array|string} raw - Datos crudos del backend
 * @returns {string} String limpio separado por comas (ej: "fútbol, música, cine")
 */
export const formatInteresesFromBackend = (raw) => {
  if (!raw) return "";

  let cleanText = "";

  // Caso 1: Es un array
  if (Array.isArray(raw)) {
    // Mapear cada elemento limpiando completamente
    const intereses = raw
      .map((item) => {
        if (typeof item === "string") {
          // Eliminar TODOS los caracteres especiales: [ ] " \
          return item
            .replace(/[\[\]"\\]/g, "") // Elimina [ ] " \
            .trim();
        }
        return String(item)
          .replace(/[\[\]"\\]/g, "")
          .trim();
      })
      .filter((item) => item.length > 0);

    cleanText = intereses.join(", ");
  }
  // Caso 2: Es un string
  else if (typeof raw === "string") {
    cleanText = raw
      .replace(/[\[\]"\\]/g, "") // Elimina [ ] " \
      .trim();
  } else {
    return "";
  }

  // Limpiar comas extras y espacios
  cleanText = cleanText
    .replace(/,\s*,/g, ",") // Elimina comas dobles
    .replace(/,\s+/g, ", ") // Normaliza espacios después de comas
    .replace(/^\s*,|,\s*$/g, "") // Elimina comas al inicio/final
    .trim();

  return cleanText;
};

/**
 * Transforma el string del formulario al formato que acepta el backend
 * @param {string} interesesString - String del formulario (ej: "fútbol, música, cine")
 * @returns {string} JSON stringify del array (ej: '["fútbol","música","cine"]')
 */
export const formatInteresesForBackend = (interesesString) => {
  if (!interesesString || typeof interesesString !== "string") {
    return JSON.stringify([]);
  }

  // Dividir por coma, trimear espacios y filtrar vacíos
  const interesArray = interesesString
    .split(",")
    .map((interes) => interes.trim())
    .filter((interes) => interes.length > 0);

  // Devolver como JSON string
  return JSON.stringify(interesArray);
};

/**
 * Valida si el string de intereses cumple con el formato esperado
 * Limpia primero corchetes y caracteres de escape antes de validar
 * @param {string} interesesString - String a validar
 * @returns {boolean} true si es válido
 */
export const isValidInteresesFormat = (interesesString) => {
  if (!interesesString || typeof interesesString !== "string") {
    return false;
  }

  // Primero limpiar corchetes y caracteres escapados
  let cleaned = interesesString
    .trim()
    .replace(/^\[/, "") // Quita [ al inicio
    .replace(/\]$/, "") // Quita ] al final
    .replace(/\\"/g, '"') // Desescapea comillas
    .replace(/^"|"$/g, "") // Quita comillas al inicio/final
    .trim();

  if (!cleaned) return false;

  // Regex: permite letras, números, y espacios alrededor de comas
  // Ej: "fútbol, música, cine" ✓
  // Ej: "fútbol,música,cine" ✓
  // Ej: "fútbol" ✓
  const regex = /^([a-zA-ZñÑ0-9]+)(,\s*[a-zA-ZñÑ0-9]+)*$/;
  return regex.test(cleaned);
};

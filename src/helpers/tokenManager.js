// src/helpers/tokenManager.js
// ÚNICA fuente de verdad para tokens

class TokenManager {
  // Observadores para cambios de token
  #listeners = [];

  /**
   * Obtiene el token y valida que no esté expirado
   */
  getToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // Decodificar payload (sin validar firma, solo para obtener exp)
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Si está expirado, eliminarlo
      if (payload.exp * 1000 < Date.now()) {
        this.clearToken();
        return null;
      }

      return token;
    } catch {
      // Token corrupto
      this.clearToken();
      return null;
    }
  }

  /**
   * Guarda token y user, notifica a listeners
   */
  setToken(token, user = null) {
    if (!token) {
      console.error("❌ Token requerido");
      return false;
    }

    localStorage.setItem("token", token);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    this.#notifyListeners({ token, user });
    return true;
  }

  /**
   * Elimina token y user, notifica a listeners
   */
  clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.#notifyListeners({ token: null, user: null });
  }

  /**
   * Obtiene user del localStorage
   */
  getUser() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Verifica si hay token válido
   */
  isAuthenticated() {
    return this.getToken() !== null;
  }

  /**
   * Suscribe listener a cambios de token
   * Retorna función para desuscribirse
   */
  subscribe(listener) {
    this.#listeners.push(listener);

    // Retornar función unsubscribe
    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notifica a todos los listeners de cambios
   */
  #notifyListeners(state) {
    this.#listeners.forEach((listener) => listener(state));
  }
}

export default new TokenManager();

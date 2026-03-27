import axios from "axios";
import { toast } from "react-toastify";
import { useCallback } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

let errorToastId = null;

function useFetch() {
  const fetchDataBackend = useCallback(
    async (endpoint, data, method = "GET", showToast = true) => {
      // Ajuste para evitar dobles o faltantes de slash
      const url = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

      const showLoadingToast = showToast && method.toUpperCase() !== "GET";
      const loadingToast = showLoadingToast
        ? toast.loading("Procesando solicitud...")
        : null;

      try {
        const token = localStorage.getItem("token");
        const isFormData = data instanceof FormData;

        const combinedHeaders = {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(!isFormData && { "Content-Type": "application/json" }),
        };

        const options = {
          method: method.toUpperCase(),
          url,
          headers: combinedHeaders,
          ...(method.toUpperCase() !== "GET" && data ? { data } : {}),
        };

        const response = await axios(options);

        if (loadingToast) toast.dismiss(loadingToast);
        if (response?.data?.msg && showToast && method !== "GET") {
          toast.success(response.data.msg);
        }

        return response.data;
      } catch (error) {
        if (loadingToast) toast.dismiss(loadingToast);
        const status = error?.response?.status;
        const errorMsg =
          error?.response?.data?.msg ||
          error?.response?.data?.error ||
          error?.message ||
          "Error desconocido";

        // Manejar error 403 (Forbidden)
        if (status === 403) {
          console.error("403 Forbidden:", errorMsg);
          if (showToast) {
            toast.error(errorMsg); // ← usa el mensaje real del backend
          }
          throw new Error(errorMsg); // ← lanza el mensaje real
        }

        if (errorMsg.toLowerCase().includes("token expired")) {
          localStorage.removeItem("token");
          toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
          window.location.href = "/login";
          return;
        }

        if (showToast) {
          if (!errorToastId) {
            errorToastId = toast.error(errorMsg, {
              onClose: () => {
                errorToastId = null;
              },
              autoClose: 3000,
            });
          }
        }
        throw new Error(errorMsg);
      }
    },
    [],
  );

  return { fetchDataBackend };
}

export default useFetch;

// src/helpers/fetchDataBackend.js — ya lo tienes, mueve la lógica aquí

import axios from "axios";
import { toast } from "react-toastify";

const API_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

let errorToastId = null;

const fetchDataBackend = async (endpoint, data, method = "GET", showToast = true) => {
  try {
    const url = `${API_URL}/${endpoint.replace(/^\//, "")}`;
    const token = localStorage.getItem("token");
    const isFormData = data instanceof FormData;

    const options = {
      method: method.toUpperCase(),
      url,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!isFormData && { "Content-Type": "application/json" }),
      },
      ...(method.toUpperCase() !== "GET" && data ? { data } : {}),
    };

    const response = await axios(options);

    if (showToast && response?.data?.msg) {
      toast.success(response.data.msg, {
        toastId: `success-${response.data.msg}`,
      });
    }

    return response.data;

  } catch (error) {
    const status = error?.response?.status;
    const errorMsg =
      error?.response?.data?.msg ||
      error?.response?.data?.error ||
      error?.message ||
      "Error desconocido";

    if (status === 403) {
      toast.error(errorMsg, { toastId: "403-error" });
      throw new Error(errorMsg);
    }

    if (errorMsg.toLowerCase().includes("token expired")) {
      localStorage.removeItem("token");
      toast.error("Sesión expirada");
      window.location.href = "/login";
      return;
    }

    if (!errorToastId) {
      errorToastId = toast.error(errorMsg, {
        toastId: `error-${errorMsg}`,
        onClose: () => { errorToastId = null; },
      });
    }

    throw new Error(errorMsg);
  }
};

export default fetchDataBackend;
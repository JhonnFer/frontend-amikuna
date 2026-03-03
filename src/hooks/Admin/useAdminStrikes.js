// src/hooks/useAdminStrikes.js
import useFetch from "../useFetch";

const useAdminStrikes = () => {
  const { fetchDataBackend } = useFetch();

  const obtenerStrikes = async () => {
    return await fetchDataBackend("mis-strikes", null, "GET");
  };

  return { obtenerStrikes };
};

export default useAdminStrikes;

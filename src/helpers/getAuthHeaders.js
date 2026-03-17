// helpers/getAuthHeaders.js
const getAuthHeaders = (forAxios = false) => {
  const token = localStorage.getItem("token");
  
  if (forAxios) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export default getAuthHeaders;
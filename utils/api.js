import axios from "axios";

// Initialize Axios instance with base URL and default headers
const api = axios.create({
  baseURL: "https://moneycare.io.vn/",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Set or remove the Authorization token for API requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Handle async cloud data operations (for example, sync data across different tables)
export const asyncDataAction = async (actionList) => {
  try {
    // Convert actions to JSON format as per API specification
    const formData = new FormData();
    formData.append("jsonData", JSON.stringify(actionList));

    const response = await api.post("async-cloud/", formData);
    console.log("Async data action response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during async data action:", error);
    throw error;
  }
};

export default api;

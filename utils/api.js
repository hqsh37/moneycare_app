import axios from "axios";
import Constants from "expo-constants";

const { API_URL } = Constants.expoConfig.extra;

// Tạo một instance Axios với cấu hình API base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;

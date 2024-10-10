import axios from "axios";

// Tạo một instance Axios với cấu hình API base URL
const api = axios.create({
  baseURL: "https://moneycare.io.vn/",
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

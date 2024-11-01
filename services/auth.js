import api, { setAuthToken } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginAuth = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    if ((token = response.data?.data?.token)) {
      await AsyncStorage.setItem("token", token);
      setAuthToken(token);
      return token;
    } else {
      return 0;
    }
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

export const logoutAuth = async () => {
  try {
    await AsyncStorage.removeItem("token");

    setAuthToken(null);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// get information about user
export const getInfo = async () => {
  try {
    const response = await api.post("/auth/me");
    if ((data = response.data?.data)) {
      return data;
    } else {
      return 0;
    }
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

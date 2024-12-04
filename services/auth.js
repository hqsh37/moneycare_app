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

export const registerAuth = async (email, password, fisrtName, lastName) => {
  try {
    const response = await api.post("/auth/register", {
      firstname: fisrtName,
      lastname: lastName,
      email,
      password,
    });

    if (response?.status) {
      return response.status;
    } else {
      return false;
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

export const forgotAuth = async (email) => {
  try {
    const response = await api.post("/auth/forgot", { email });

    if (response?.status === 200) {
      return true;
    }

    return false;
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

export const otpAuth = async (otp, email) => {
  try {
    const response = await api.post("/auth/otp", { otp, email });

    if ((token = response.data?.data?.token)) {
      await AsyncStorage.setItem("token", token);
      setAuthToken(token);
      return token;
    } else {
      return false;
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

export const resetPassAuth = async (password) => {
  try {
    const response = await api.post("/auth/reset-password", { password });

    if (response?.status === 200) {
      return true;
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

export const changePassAuth = async (password, passwordNew) => {
  try {
    const response = await api.post("/auth/change-password", {
      password,
      passwordNew,
    });

    if (response?.status === 200) {
      return true;
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

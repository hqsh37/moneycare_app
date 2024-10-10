import api, { setAuthToken } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getListAccounts = async () => {
  try {
    const response = await api.get("/accounts");
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

export const getAnAccount = async (id) => {
  try {
    const response = await api.get(`/accounts/${id}`);
    if ((token = response.data?.data?.token)) {
      await AsyncStorage.setItem("token", token);
      setAuthToken(token);
      return token;
    } else {
      console.log("No token received");
    }
    return token;
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

export const removeAaccount = async (id) => {
  try {
    const response = await api.delete(`/accounts/${id}`);
    if (response.data?.status === "success") {
      return true;
    } else {
      console.log("Unexpected response status:", response.status);
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
      console.log("Status code:", error.response.status);
    } else if (error.request) {
      console.log("No response received:", error.request);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

export const updateAaccount = async (
  id,
  tentaikhoan,
  loaitaikhoan,
  sotien,
  diengiai = ""
) => {
  const data = {
    tentaikhoan,
    loaitaikhoan,
    sotien,
    ...(diengiai && { diengiai }),
  };

  try {
    const response = await api.put(`/accounts/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data?.status === "success") {
      return true;
    } else {
      console.log("Unexpected response status:", response.status);
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
      console.log("Status code:", error.response.status);
    } else if (error.request) {
      console.log("No response received:", error.request);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

// Create a new account
export const createAccount = async (
  tentaikhoan,
  loaitaikhoan,
  sotien,
  diengiai = ""
) => {
  const data = {
    tentaikhoan,
    loaitaikhoan,
    sotien,
    ...(diengiai && { diengiai }),
  };

  try {
    const response = await api.post("/accounts", data);
    if (response.data?.status === "success") {
      return true;
    } else {
      console.log("Unexpected response status:", response.status);
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
      console.log("Status code:", error.response.status);
    } else if (error.request) {
      console.log("No response received:", error.request);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

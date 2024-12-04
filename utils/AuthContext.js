import React, { createContext, useState, useEffect } from "react";

import { getData, storeData, removeData } from "./storage";
import { setAuthToken } from "./api";
import { deleteTimestamps } from "../stores/Timestamp";

// Tạo AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token từ AsyncStorage khi ứng dụng được khởi động
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await getData("userToken");
        setToken(storedToken);
        setAuthToken(storedToken);
      } catch (error) {
        console.error("Error checking token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  // Hàm đăng nhập
  const loginAuthContext = async (userToken) => {
    try {
      await storeData("userToken", userToken);
      setToken(userToken);
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  // Hàm đăng xuất
  const logoutAuthContext = async () => {
    try {
      await removeData("userToken");
      await deleteTimestamps();
      setToken(null); // Đặt lại token về null để điều hướng lại màn hình đăng nhập
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, loginAuthContext, logoutAuthContext, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

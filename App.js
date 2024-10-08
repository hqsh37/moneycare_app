import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthContext, AuthProvider } from "./utils/AuthContext"; // Import AuthContext
import Taskbar from "./components/Taskbar";
import Login from "./Screens/Login";

const AppContent = () => {
  const { token, loading } = useContext(AuthContext); // Lấy token từ context

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00aaff" />
      </View>
    );
  }

  return token ? <Taskbar /> : <Login />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthContext, AuthProvider } from "./utils/AuthContext";
import Taskbar from "./components/Taskbar";
import Login from "./Screens/Login";
import * as Notifications from "expo-notifications";

const AppContent = () => {
  const { token, loading } = useContext(AuthContext);

  const sendNotification = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Quyền thông báo đã bị từ chối.");
        return;
      }
    }
  };

  sendNotification();

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

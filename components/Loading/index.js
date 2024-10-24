import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const Loading = ({
  message = "Đang tải...",
  size = "large",
  color = "#00ff00",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    marginBottom: 10,
    transform: [{ rotate: "360deg" }], // Hiệu ứng xoay
  },
  message: {
    fontSize: 16,
    color: "#000",
  },
});

export default Loading;

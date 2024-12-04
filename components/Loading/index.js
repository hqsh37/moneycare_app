import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Modal } from "react-native";

const Loading = ({
  message = "Đang tải...",
  size = "large",
  color = "#00ff00",
  transparent = false,
}) => {
  return transparent ? (
    <Modal transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <ActivityIndicator size={size} color={color} style={styles.spinner} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Modal>
  ) : (
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  spinner: {
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#fff", // White text for better contrast in modal
  },
});

export default Loading;

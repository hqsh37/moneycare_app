// ConfirmationModal.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

const ConfirmationModal = ({
  isVisible,
  toggleModal,
  onConfirm,
  content = "Bạn có chắc chắn muốn thực hiện hành động này?",
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal} // Đóng modal khi nhấn bên ngoài
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{content}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.noButton} onPress={toggleModal}>
            <Text style={styles.buttonText}>Không</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.yesButton} onPress={onConfirm}>
            <Text style={styles.buttonText}>Có</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  noButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  yesButton: {
    backgroundColor: "#009fda",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConfirmationModal;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  deleteSpendingAlertData,
  getSpendingAlertData,
} from "../../../stores/spendingAlertStorage";

const AddReminderModal = ({ visible, onClose, onAdd, idAccount }) => {
  const [title, setTitle] = useState("Cảnh báo chi tiêu");
  const [amount, setAmount] = useState("");
  const [content, setContent] = useState(
    "Bạn đã vượt quá hạn mức chi tiêu được đặt ra. Vui lòng kiểm tra và điều chỉnh chi tiêu của mình để tránh các rủi ro tài chính."
  );

  const checkAlert = async () => {
    const dataOld = await getSpendingAlertData();
    const result = dataOld.some(
      (item) => item.idAccount === idAccount && item.amount == amount
    );

    if (result) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Số tiền cảnh báo đã tồn tại.",
      });
      return false;
    } else {
      const getRandomId = () => `alert_${Math.floor(Math.random() * 9999999)}`;
      onAdd({
        id: getRandomId(),
        title,
        amount: parseInt(amount),
        content,
      });

      onClose();
    }
  };

  const handleAddReminder = () => {
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập tiêu đề!",
      });
      return false;
    }

    if (!amount.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập số tiền cảnh báo",
      });
      return false;
    }

    if (!isFinite(amount) || amount < 0) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập số tiền cảnh báo là số nguyên dương",
      });
      return false;
    }

    if (!content.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập nội dung cảnh báo.",
      });
      return false;
    }

    checkAlert();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Thêm cảnh báo</Text>

          {/* Nhập Tiêu Đề */}
          <Text style={styles.label}>Tiêu đề:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tiêu đề cảnh báo"
            value={title}
            onChangeText={setTitle}
          />

          {/* Nhập Số Tiền */}
          <Text style={styles.label}>Số tiền cảnh báo(đ):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Nhập Nội Dung */}
          <Text style={styles.label}>Nội dung:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            keyboardType="default"
            returnKeyType="done"
            multiline={true}
            maxLength={200}
            value={content}
            onChangeText={setContent}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                onClose();
                // deleteSpendingAlertData();
              }}
            >
              <Text style={styles.modalButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.addButtonModal]}
              onPress={handleAddReminder}
            >
              <Text style={styles.modalButtonText}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff", // White background
    borderRadius: 15,
    padding: 20,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 130, // Increase height for multiline input
    textAlignVertical: "top", // Align text at the top
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#e6f7ff", // Light blue background
  },
  timePickerText: {
    fontSize: 16,
    color: "#007bff", // Blue text color
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#FF4C4C", // Light red
  },
  addButtonModal: {
    backgroundColor: "#009FDA", // Bright blue
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddReminderModal;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddReminderModal = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState(
    "Đừng quên ghi lại các khoản chi tiêu của bạn!"
  );
  const [time, setTime] = useState(new Date()); // Default time: now
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Handle time selection
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleAddReminder = () => {
    if (!title.trim()) {
      Alert.alert("Vui lòng nhập tiêu đề!", "Tiêu đề không được để trống.");
      return;
    }

    if (!time) {
      Alert.alert("Thời gian không hợp lệ!", "Vui lòng chọn thời gian.");
      return;
    }

    onAdd({
      title: title.trim(),
      time: time.toISOString(), // Store the time as an ISO string
    });

    // Reset input fields
    setTitle("Đừng quên ghi lại các khoản chi tiêu của bạn!");
    setTime(new Date());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Thêm lời nhắc</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Nhập tiêu đề lời nhắc (ví dụ: Ghi chi tiêu trong tuần này)"
            value={title}
            onChangeText={setTitle}
            keyboardType="default"
            returnKeyType="done"
            multiline={true}
            maxLength={200}
          />

          {/* Display selected time */}
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timePickerText}>
              {`Thời gian: ${time.getHours().toString().padStart(2, "0")}:${time
                .getMinutes()
                .toString()
                .padStart(2, "0")}`}
            </Text>
          </TouchableOpacity>

          {/* Show TimePicker when showTimePicker is true */}
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time" // Changed to 'time'
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
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
    height: 80, // Increase height for multiline input
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

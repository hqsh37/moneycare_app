import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

const FeedbackModal = ({ onBack = () => {} }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim().length === 0) {
      Toast.show({
        type: "error",
        text1: "Nội dung không được để trống",
      });
      return;
    }

    if (title.trim().length === 0) {
      Toast.show({
        type: "error",
        text1: "Tiêu đề không được để trống",
      });
      return;
    }

    if (content.length > 1000) {
      Toast.show({
        type: "error",
        text1: "Nội dung không được vượt quá 1000 ký tự.",
      });
      return;
    }
    console.log("Title:", title);
    console.log("Content:", content);

    Toast.show({
      type: "success",
      text1: "Gửi nhận xét thành công!",
    });
    setTitle("");
    setContent("");
    onBack();
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Nhận Xét</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tiêu đề"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập nội dung (tối đa 1000 ký tự)"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={1000}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => onBack()}
          >
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: "#009FDA",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FeedbackModal;

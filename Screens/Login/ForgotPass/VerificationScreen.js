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
import ResetPassword from "./ResetPassword";
import { otpAuth } from "../../../services/auth";
import Loading from "../../../components/Loading";

const VerificationScreen = ({
  onBack = () => {},
  onHome = () => {},
  email = "",
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [isLoading, setISLoading] = useState(false);

  const handleResetPassword = async () => {
    setISLoading(true);
    const jwt = await otpAuth(verificationCode, email);
    setISLoading(false);
    return jwt;
  };

  const handleContinue = () => {
    if (verificationCode.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mã xác nhận gồm 6 số.",
      });
      return false;
    }

    if (handleResetPassword()) {
      setIsResetPasswordModalVisible(true);
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mã xác nhận không đúng. Vui lòng thử lại.",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề chính */}
      <Text style={styles.title}>Lấy lại mật khẩu</Text>
      {/* Thông báo xác thực */}
      <Text style={styles.instruction}>
        Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra email và
        nhập chính xác mã vào ô dưới.
      </Text>

      {/* Ô nhập mã xác thực */}
      <TextInput
        style={styles.input}
        placeholder="Mã xác thực"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
      />

      {/* Nút tiếp tục */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>

      {/* Liên kết phụ trợ */}
      <View style={styles.centerLinkContainer}>
        <TouchableOpacity onPress={() => onBack()}>
          <Text style={styles.linkText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centerLinkContainer}></View>

      {/* Modal Verification */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isResetPasswordModalVisible}
        onRequestClose={() => setIsResetPasswordModalVisible(false)}
      >
        <ResetPassword
          onBack={() => {
            setIsResetPasswordModalVisible(false);
            onHome();
          }}
        />
      </Modal>

      <Toast />
      {isLoading && <Loading transparent />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    marginHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#009FDA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centerLinkContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  linkText: {
    color: "#009FDA",
    fontSize: 14,
  },
});

export default VerificationScreen;

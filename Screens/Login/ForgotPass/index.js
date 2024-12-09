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
import VerificationScreen from "./VerificationScreen";
import Loading from "../../../components/Loading";
import { forgotAuth } from "../../../services/auth";
import { checkNetworkStatus } from "../../../services/asyncDataCloud";

const ForgotPass = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [isEmail, setISEmail] = useState(false);
  const [isLoading, setISLoading] = useState(false);

  const handleVerification = async () => {
    setISLoading(true);
    const isConnected = await checkNetworkStatus();
    if (!isConnected) {
      setISLoading(false);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng kiểm tra kết nối mạng để đăng ký.",
      });
      return;
    }
    const result = await forgotAuth(email.toLocaleLowerCase());
    setISLoading(false);
    if (result) {
      setISEmail(true);
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Email chưa được đăng ký, vui lòng tạo tài khoản để sử dụng",
      });
    }
  };

  const handleForgotPassword = () => {
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Email không hợp lệ.",
      });
      return false;
    }

    handleVerification();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lấy lại mật khẩu</Text>

      {/* Hướng dẫn */}
      <Text style={styles.instruction}>
        Nhập email của bạn để nhận mã xác thực lấy lại mật khẩu
      </Text>

      <View style={styles.emailContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Lấy lại mật khẩu</Text>
      </TouchableOpacity>

      <View style={styles.centerLinkContainer}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.link}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
      <Toast />

      {/* Modal Verification */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isEmail}
        onRequestClose={() => setISEmail(false)}
      >
        <VerificationScreen
          onBack={() => setISEmail(false)}
          onHome={() => onBack()}
          email={email}
        />
      </Modal>
      {isLoading && <Loading transparent />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 20,
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
  emailContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  iconContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#009FDA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centerLinkContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  link: {
    color: "#009FDA",
    fontSize: 14,
    textAlign: "center",
  },
});

export default ForgotPass;

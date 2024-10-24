import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const VerificationScreen = () => {
  const [verificationCode, setVerificationCode] = useState("");

  const handleContinue = () => {
    // Logic xử lý khi người dùng nhấn nút "Tiếp tục"
    console.log("Mã xác thực: ", verificationCode);
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề chính */}
      <Text style={styles.title}>Lấy lại mật khẩu</Text>

      {/* Thông báo xác thực */}
      <Text style={styles.instruction}>
        Mã xác thực đã được gửi đến email ntm*******@gmail.com. Vui lòng kiểm
        tra email và nhập chính xác mã vào ô dưới.
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
        <TouchableOpacity>
          <Text style={styles.linkText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centerLinkContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
    backgroundColor: "#1E90FF",
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
    color: "#1E90FF",
    fontSize: 14,
  },
});

export default VerificationScreen;

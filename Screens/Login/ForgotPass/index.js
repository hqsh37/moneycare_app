import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ForgotPass = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [isEmailHidden, setIsEmailHidden] = useState(false);

  // Hàm chuyển đổi email thành dấu *
  const renderHiddenEmail = (email) => {
    if (isEmailHidden && email.length > 0) {
      return email.replace(/./g, "•");
    }
    return email;
  };

  const handleForgotPassword = () => {
    console.log("Mã xác thực được gửi đến: ", email);
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề chính */}
      <Text style={styles.title}>Lấy lại mật khẩu</Text>

      {/* Hướng dẫn */}
      <Text style={styles.instruction}>
        Nhập email của bạn để nhận mã xác thực lấy lại mật khẩu
      </Text>

      <View style={styles.emailContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          value={renderHiddenEmail(email)}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setIsEmailHidden(!isEmailHidden)}
        >
          <Icon
            name={isEmailHidden ? "eye-off" : "eye"}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Lấy lại mật khẩu</Text>
      </TouchableOpacity>

      <View style={styles.centerLinkContainer}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.link}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    backgroundColor: "#1E90FF",
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
    color: "#1E90FF",
    fontSize: 14,
    textAlign: "center",
  },
});

export default ForgotPass;

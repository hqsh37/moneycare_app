import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function Signup({ onBack }) {
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.logoText}>ĐĂNG KÝ</Text>

      {/* Họ và tên đệm */}
      <TextInput
        style={styles.input}
        placeholder="Họ và tên đệm *"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Tên */}
      <TextInput
        style={styles.input}
        placeholder="Tên *"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email *"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Mật khẩu */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu *"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Điều khoản */}
      <Text style={styles.termsText}>
        Bằng cách bấm vào nút đăng ký, bạn đã đồng ý với{" "}
        <Text style={styles.linkText}>Thỏa thuận sử dụng phần mềm</Text> và{" "}
        <Text style={styles.linkText}>Chính sách quyền riêng tư</Text>
      </Text>

      {/* Nút Đăng ký */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>ĐĂNG KÝ</Text>
      </TouchableOpacity>

      {/* Đăng nhập */}
      <Text style={styles.loginText}>
        Bạn đã có tài khoản?{" "}
        <Text style={styles.linkText} onPress={onBack}>
          Đăng nhập ngay
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  showPasswordButton: {
    position: "absolute",
    right: 10,
    top: 17,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    marginVertical: 10,
    color: "#555",
  },
  linkText: {
    color: "#1E90FF",
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E90FF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { registerAuth } from "../../services/auth";
import { checkNetworkStatus } from "../../services/asyncDataCloud";

export default function Signup({ onBack }) {
  const [fisrtName, setFisrtName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const validateInput = () => {
    if (!fisrtName.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Họ không được để trống.",
      });
      return false;
    }
    if (!lastName.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Tên không được để trống.",
      });
      return false;
    }
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Email không được để trống.",
      });
      return false;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Email không hợp lệ.",
      });
      return false;
    }
    if (password.trim().length < 6) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    const isConnected = await checkNetworkStatus();

    if (validateInput()) {
      if (!isConnected) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Vui lòng kiểm tra kết nối mạng để đăng ký.",
        });
        return;
      }

      const result = await registerAuth(
        email.toLocaleLowerCase(),
        password,
        fisrtName,
        lastName
      );

      if (result === 201) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Đăng ký tài khoản thành công!",
        });
        setTimeout(() => {
          onBack();
        }, 2000);
      } else if (result === 400) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Đăng ký thất bại vui lòng kiểm tra lại!",
        });
      } else if (result === 409) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Email đã tồn tại.",
        });
      } else if (result === 500) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Đã xảy ra lôi khi đăng ký. Vui lòng thử lại!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Đã xảy ra lôi khi đăng ký. Vui lòng thử lại!",
        });
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.logoText}>ĐĂNG KÝ</Text>

      {/* Họ */}
      <TextInput
        style={styles.input}
        placeholder="Họ"
        value={fisrtName}
        onChangeText={setFisrtName}
      />

      {/* Tên */}
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Mật khẩu */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
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
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => handleSignup()}
      >
        <Text style={styles.registerButtonText}>ĐĂNG KÝ</Text>
      </TouchableOpacity>

      {/* Đăng nhập */}
      <Text style={styles.loginText}>
        Bạn đã có tài khoản?{" "}
        <Text style={styles.linkText} onPress={onBack}>
          Đăng nhập ngay
        </Text>
      </Text>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
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
    color: "#009fda",
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#009fda",
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

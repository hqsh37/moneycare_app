import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "../../../components/Icon";
import { resetPassAuth } from "../../../services/auth";

const ResetPassword = ({ onBack = () => {} }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Trạng thái hiển thị mật khẩ
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    const result = await resetPassAuth(newPassword);
    return result;
  };

  const handleChangePassword = () => {
    if (!newPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập mật khẩu mới!",
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu mới phải có ít nhất 6 ký tự!",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu xác nhận không khớp!",
      });
      return;
    }
    if (handleReset()) {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Mật khẩu đã được thay đổi!",
      });

      setTimeout(() => {
        onBack();
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Đặt lại mật khẩu</Text>
      </View>

      <View style={styles.wrapContent}>
        {/* Mật khẩu mới */}
        <Text style={styles.inputLabel}>Mật khẩu mới</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Icon
              icon={showNewPassword ? "eye-off-outline" : "eye-outline"}
              iconLib="Ionicons"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Xác nhận mật khẩu mới */}
        <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu mới"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              icon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              iconLib="Ionicons"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Nút đổi mật khẩu */}
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        {/* Liên kết phụ trợ */}
        <View style={styles.centerLinkContainer}>
          <TouchableOpacity onPress={() => onBack()}>
            <Text style={styles.linkText}>Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: 40,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  wrapContent: {
    margin: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#009FDA",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
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

export default ResetPassword;

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
import Loading from "../../../components/Loading";
import { changePassAuth } from "../../../services/auth";

const ChangePasswordScreen = ({ onBack = () => {} }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setISLoading] = useState(false);

  // Trạng thái hiển thị mật khẩu
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleVerification = async () => {
    setISLoading(true);
    const result = await changePassAuth(currentPassword, newPassword);
    setISLoading(false);
    if (result) {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Mật khẩu đã được thay đổi!",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu không đúng, vui lòng thử lại sau.",
      });
    }
  };

  const handleChangePassword = () => {
    if (!currentPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập mật khẩu cũ!",
      });
      return;
    }

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

    handleVerification();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View />
      </View>

      <View style={styles.wrapContent}>
        {/* Mật khẩu cũ */}
        <Text style={styles.inputLabel}>Mật khẩu cũ</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu cũ"
            secureTextEntry={!showCurrentPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            <Icon
              icon={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
              iconLib="Ionicons"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

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
      </View>

      {/* Toast */}
      <Toast />
      {isLoading && <Loading transparent />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#009FDA",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
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
});

export default ChangePasswordScreen;

import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { AuthContext } from "../../utils/AuthContext";
import { loginAuth } from "../../services/auth";
import Toast from "react-native-toast-message";
import ForgotPass from "./ForgotPass";
import Sigup from "./Signup";

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [forgotPassVisible, setForgotPassVisible] = useState(false);
  const [sigupVisible, setSigupVisible] = useState(false);
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const { loginAuthContext } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Email không hợp lệ.",
      });
      return false;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
      return false;
    }

    const token = await loginAuth(email, password);
    console.log(token);

    if (token === 0) {
      loginAuthContext(token);
      Toast.show({
        type: "error",
        text1: "lỗi",
        text2: "Server Error",
      });
    } else if (token) {
      loginAuthContext(token);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "token: " + token,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Tài khoản không chính xác!. Vui lòng thử lại.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable width="100%" height="100%" onPress={Keyboard.dismiss}>
        <Text style={styles.textTile}>Đăng nhập</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setemail}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.iconContainer}
          >
            <Icon
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => handleLogin()}
        >
          <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => setForgotPassVisible(true)}>
            <Text style={styles.linkText}>QUÊN MẬT KHẨU?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSigupVisible(true)}>
            <Text style={styles.linkText}>ĐĂNG KÝ</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
      <View style={styles.txtBottom}>
        <Text>© 2024 Copyright – Money care</Text>
      </View>
      {/* Modal forgot password */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={forgotPassVisible}
        onRequestClose={() => setForgotPassVisible(false)}
      >
        <ForgotPass onBack={() => setForgotPassVisible(false)} />
      </Modal>

      {/* Modal Sigup */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={sigupVisible}
        onRequestClose={() => setSigupVisible(false)}
      >
        <Sigup onBack={() => setSigupVisible(false)} />
      </Modal>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  textTile: {
    fontSize: 30,
    padding: 20,
    color: "#009FDA",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  inputPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  iconContainer: {
    paddingRight: 10,
  },
  loginButton: {
    backgroundColor: "#009fda",
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  linkText: {
    color: "#00aaff",
    fontSize: 14,
  },
  txtBottom: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

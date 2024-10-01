import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  Pressable,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Sử dụng cho biểu tượng con mắt

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Pressable width="100%" height="100%" onPress={Keyboard.dismiss}>
        <Text style={styles.textTile}>Đăng nhập</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
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

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <TouchableOpacity>
            <Text style={styles.linkText}>QUÊN MẬT KHẨU?</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.linkText}>ĐĂNG KÝ</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
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
    backgroundColor: "#00aaff",
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
});

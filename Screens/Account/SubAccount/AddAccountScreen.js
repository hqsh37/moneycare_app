import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Pressable,
} from "react-native";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";

import SelectOptions from "../../../components/SelectOptions";
import { createAccount } from "../../../services/account";

const accounts = [
  {
    name: "Tiền mặt",
    type: "cash",
  },
  {
    name: "Ngân hàng",
    type: "bank",
  },
];

const AddAccountScreen = ({ onPressClose }) => {
  const [initialBalance, setInitialBalance] = useState("");
  const [accountName, setAccountName] = useState("");
  const [account, setAccount] = useState(accounts[0].name);
  const [typeAccount, setTypeAccount] = useState(accounts[0].type);
  const [desc, setDesc] = useState("");

  // Handle Account change
  const handleAccountChange = (selectedName) => {
    setAccount(selectedName);
    const selectedAccount = accounts.find(
      (account) => account.name === selectedName[0]
    );
    if (selectedAccount) {
      setTypeAccount(selectedAccount.type);
    }
  };

  const handleCreateLoading = async () => {
    // Gọi hàm createAccount và trả về kết quả
    return await createAccount(accountName, typeAccount, initialBalance, desc);
  };

  // Handle save
  const handleSave = async () => {
    const result = await handleCreateLoading();
    if (
      initialBalance.trim() === "" ||
      isNaN(initialBalance) ||
      initialBalance < 1
    ) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập số dư ban đầu hợp lệ",
      });
      return;
    }

    if (accountName.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập tên tài khoản",
      });
      return;
    }

    if (result) {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Tài khoản đã được thêm thành công",
      });

      setTimeout(() => {
        onPressClose();
      }, 1500);
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Có lỗi khi tạo tài khoản. Vui lòng thử lại.",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={onPressClose}
        />
        <Text style={styles.headerTitle}>Thêm tài khoản</Text>
        <Ionicons
          name="checkmark"
          size={24}
          color="#fff"
          onPress={handleSave}
        />
      </View>

      <View style={styles.separation}></View>

      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.inputGroup}>
          <Text>
            Số dư ban đầu <Text style={styles.required}>*</Text>
          </Text>
          {initialBalance ? (
            <TextInput
              style={styles.balanceInput}
              keyboardType="numeric"
              value={initialBalance}
              onChangeText={setInitialBalance}
            />
          ) : (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={initialBalance}
              onChangeText={setInitialBalance}
              placeholder="Nhập số dư ban đầu"
            />
          )}
        </View>

        {/* Tên tài khoản */}
        <View style={styles.inputGroup}>
          <Text>
            Tên tài khoản <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập Tên tài khoản"
            value={accountName}
            onChangeText={setAccountName}
          />
        </View>

        {/* Loại tài khoản */}
        <View style={styles.inputGroup}>
          <Text>
            Chọn loại tài khoản <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryContainer}>
            <SelectOptions
              data={accounts.map((account) => account.name)}
              type="radio"
              onSelectionChange={handleAccountChange}
              indexDefault={0}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text>Diễn giải</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập diễn giải"
            value={desc}
            onChangeText={setDesc}
          />
        </View>

        {/* Nút lưu */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </Pressable>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00aaff",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  separation: {
    height: 1,
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  inputGroup: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  required: {
    color: "red",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderRadius: 5,
  },
  balanceInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 24,
    paddingVertical: 5,
    textAlign: "right",
    color: "#000",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: "#00aaff",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AddAccountScreen;

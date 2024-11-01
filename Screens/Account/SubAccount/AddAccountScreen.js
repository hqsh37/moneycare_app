import React, { useEffect, useState } from "react";
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
import { addHandleAsyncData } from "../../../services/asyncData";
import {
  getAccountData,
  saveAccountData,
} from "../../../stores/accountStorage";
import { useDebounce } from "../../../hooks";

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
  const [balanceView, setBalanceView] = useState("0 đ");
  const [accountName, setAccountName] = useState("");
  const [typeAccount, setTypeAccount] = useState(accounts[0].type);
  const [desc, setDesc] = useState("");
  const debouncedValue = useDebounce(balanceView, 500);

  const formatCurrency = (value) => {
    const number = parseInt(value.replace(/[^0-9]/g, ""));
    return isNaN(number) ? "0" : number.toLocaleString("vi-VN");
  };

  useEffect(() => {
    setBalanceView((pre) => formatCurrency(pre));
  }, [debouncedValue]);

  const parseCurrency = (value) =>
    parseInt(value.replace(/\./g, "").replace("đ", "").trim());

  const getRandomId = () => `account_${Math.floor(Math.random() * 9999999)}`;

  const handleAccountChange = (selectedName) => {
    const selectedAccount = accounts.find(
      (account) => account.name === selectedName[0]
    );
    if (selectedAccount) {
      setTypeAccount(selectedAccount.type);
    }
  };

  const handleCreateLoading = async () => {
    const accountPrepare = {
      id: getRandomId(),
      name: accountName,
      balance: parseCurrency(balanceView),
      type: typeAccount,
      desc: desc || null,
    };

    try {
      const dataOld = await getAccountData();
      const updatedData = await saveAccountData([
        ...dataOld,
        { ...accountPrepare, amount: accountPrepare.balance },
      ]);
      await addHandleAsyncData({
        type: "create",
        tbl: "account",
        id: accountPrepare.id,
        data: accountPrepare,
      });
      return updatedData;
    } catch (error) {
      console.error("Error creating account:", error);
      return false;
    }
  };

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: message,
    });
  };

  const handleSave = async () => {
    if (parseCurrency(balanceView) === 0) {
      showErrorToast("Số dư ban đầu không hợp lệ");
      return;
    }
    if (!accountName.trim()) {
      showErrorToast("Vui lòng nhập tên tài khoản");
      return;
    }

    const result = await handleCreateLoading();
    if (result) {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Tài khoản đã được thêm thành công",
      });
      setTimeout(onPressClose, 1500);
    } else {
      showErrorToast("Có lỗi khi tạo tài khoản. Vui lòng thử lại.");
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
          <View style={styles.balance}>
            <TextInput
              style={styles.balanceInput}
              keyboardType="numeric"
              value={balanceView}
              onChangeText={setBalanceView}
            />
            <Text style={styles.currency}>đ</Text>
          </View>
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
  balance: {
    position: "relative",
  },
  balanceInput: {
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 24,
    paddingVertical: 5,
    textAlign: "right",
    color: "#00aaff",
    fontWeight: "medium",
  },
  currency: {
    position: "absolute",
    paddingBottom: 7,
    right: 0,
    bottom: 0,
    fontSize: 24,
    color: "#000",
    textAlign: "right",
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

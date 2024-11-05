import React, { useState, useEffect, useRef } from "react";
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
import {
  getAccountData,
  saveAccountData,
} from "../../../stores/accountStorage";
import { addHandleAsyncData } from "../../../services/asyncData";
import { useDebounce } from "../../../hooks";

const accounts = [
  { name: "Tiền mặt", type: "cash" },
  { name: "Ngân hàng", type: "bank" },
];

const UpdateAccountScreen = ({
  id,
  balance,
  name,
  type = "cash",
  descOld = "",
  onPressClose,
}) => {
  const [initialBalance, setInitialBalance] = useState(balance || "0");
  const [accountName, setAccountName] = useState(name);
  const [typeAccount, setTypeAccount] = useState(type);
  const [desc, setDesc] = useState(descOld);
  const debouncedValue = useDebounce(initialBalance, 500);
  const inputRef = useRef(null);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  useEffect(() => {
    setInitialBalance((pre) => formatCurrency(pre));
  }, [debouncedValue]);

  const handleAccountChange = (selectedName) => {
    const selectedAccount = accounts.find(
      (account) => account.name === selectedName[0]
    );
    if (selectedAccount) setTypeAccount(selectedAccount.type);
  };

  const formatCurrency = (value) => {
    const number = parseInt(value.replace(/[^0-9]/g, ""), 10);
    return isNaN(number) ? "0" : number.toLocaleString("vi-VN");
  };

  const parseCurrency = (value) =>
    parseInt(value.replace(/\./g, "").trim(), 10);

  const handleDataUpdate = (dataOld, accountPrepare) =>
    dataOld.map((cat) =>
      cat.id === accountPrepare.id ? { ...cat, ...accountPrepare } : cat
    );

  const handleUpdating = async () => {
    const accountPrepare = {
      id: id,
      name: accountName,
      amount: parseCurrency(initialBalance),
      type: typeAccount,
      desc: desc || null,
    };

    await addHandleAsyncData({
      type: "update",
      tbl: "account",
      id: accountPrepare.id,
      data: { ...accountPrepare, balance: accountPrepare.amount },
    });

    const dataOld = await getAccountData();
    return await saveAccountData(handleDataUpdate(dataOld, accountPrepare));
  };

  const handleSave = async () => {
    if (parseCurrency(initialBalance) === 0) {
      return Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập số dư ban đầu hợp lệ",
      });
    }
    if (!accountName.trim()) {
      return Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập tên tài khoản",
      });
    }
    const result = await handleUpdating();
    result
      ? Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Tài khoản đã được thêm thành công",
        })
      : Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể thêm dữ liệu, Vui lòng thử lại!",
        });
    setTimeout(onPressClose, 1500);
  };

  const handleFocus = () => {
    setSelection({
      start: 0,
      end: initialBalance.length,
    });
  };

  const handleChangeText = (text) => {
    setInitialBalance(text);
    if (selection) {
      setSelection(null);
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
        <Text style={styles.headerTitle}>Sửa tài khoản</Text>
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
              ref={inputRef}
              style={styles.balanceInput}
              keyboardType="numeric"
              value={initialBalance}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              selection={selection}
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
              indexDefault={type === "cash" ? 0 : 1}
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
    paddingVertical: 6,
    color: "#00aaff",
    fontWeight: "bold",
    textAlign: "right",
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

export default UpdateAccountScreen;

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Keyboard,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

import SelectOptions from "../../../components/SelectOptions";
import { addHandleAsyncData } from "../../../services/asyncData";
import { useDebounce } from "../../../hooks";
import Icon from "../../../components/Icon";
import AccountAdd from "../../ExpenseAdd/AccountAdd";
import CustomToast from "../../../components/CustomToast";
import { getSavingsData, saveSavingsData } from "../../../stores/savingStorage";
import { updateAmountById } from "../../../stores/accountStorage";

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

const AddSavingScreen = ({ onPressClose }) => {
  const [balanceView, setBalanceView] = useState("");
  const [accountName, setAccountName] = useState("");
  const debouncedValue = useDebounce(balanceView, 500);
  const inputRef = useRef(null);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });
  const [depositDate, setDepositDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [term, setTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [interestType, setInterestType] = useState("don");
  const [modalVisibleAcc, setModalVisibleAcc] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({
    id: 0,
    name: "Chọn tài khoản",
    type: "cash",
  });

  const formatCurrency = (value) => {
    const number = parseInt(value.replace(/[^0-9]/g, ""));
    return isNaN(number) ? "0" : number.toLocaleString("vi-VN");
  };

  useEffect(() => {
    setBalanceView((pre) => formatCurrency(pre));
  }, [debouncedValue]);

  const parseCurrency = (value) => parseInt(value.replace(/\./g, "").trim());

  const getRandomId = () => `savings_${Math.floor(Math.random() * 9999999)}`;

  // Function to handle account selection
  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setModalVisibleAcc(false); // Close the modal after selection
  };

  function addMonths(date, months) {
    const result = new Date(date);
    const day = result.getDate();
    result.setMonth(result.getMonth() + months);

    // Check if the day has changed after adding months
    if (result.getDate() !== day) {
      // Set to the last day of the previous month
      result.setDate(0);
    }
    return result;
  }

  // func interest rate
  function calculateSimpleInterest(principal, rate, time) {
    const simpleInterest = principal * rate * time;
    const totalAmount = principal + simpleInterest;

    return {
      interest: simpleInterest,
      total: totalAmount,
    };
  }

  function calculateCompoundInterest(principal, rate, time, frequency = 12) {
    const totalAmount =
      principal * Math.pow(1 + rate / frequency, frequency * time);
    const compoundInterest = totalAmount - principal;

    return {
      interest: compoundInterest,
      total: totalAmount,
    };
  }

  const handleCreateLoading = async (interestResult) => {
    const savingsPrepare = {
      id: getRandomId(),
      accountId: selectedAccount.id,
      amount: parseCurrency(balanceView),
      name: accountName,
      date: getDAte(depositDate),
      term: term,
      interestRate: interestRate,
      interestType: interestType,
      settlementAmount: interestResult,
      status: "active",
    };

    try {
      const dataOld = await getSavingsData();
      const updatedData = await saveSavingsData([...dataOld, savingsPrepare]);
      await addHandleAsyncData({
        type: "create",
        tbl: "savings",
        id: savingsPrepare.id,
        data: savingsPrepare,
      });

      await updateAmountById(
        savingsPrepare.accountId,
        savingsPrepare.amount,
        "minus"
      );

      await addHandleAsyncData({
        type: "update",
        tbl: "amount",
        id: savingsPrepare.accountId,
        data: {
          id: savingsPrepare.accountId,
          amount: "-" + savingsPrepare.amount,
        },
      });
      return updatedData;
    } catch (error) {
      console.error("Error creating account:", error);
      return false;
    }
  };

  const toastConfig = {
    custom_success: (props) => <CustomToast {...props} />,
  };

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: message,
    });
  };

  const getDAte = (dateObj) => {
    const date = `${dateObj.getDate().toString().padStart(2, "0")}/${(
      dateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${dateObj.getFullYear()}`;

    return date;
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

    if (selectedAccount.id == 0) {
      showErrorToast("Vui lòng chọn tài khoản");
      return;
    }

    if (!depositDate) {
      showErrorToast("Vui lòng chọn ngày tất toán");
      return;
    }

    if (term.trim() === "" || isNaN(term) || term <= 0) {
      showErrorToast("Kỳ hạn không hợp lệ!");
      return;
    }

    if (
      interestRate.trim() === "" ||
      isNaN(interestRate) ||
      interestRate <= 0
    ) {
      showErrorToast("Lãi suất nhập không hợp lệ!");
      return;
    }

    if (interestType === "") {
      showErrorToast("Vui lòng nhập tất cả các thông tin");
      return;
    }

    let interestResult = 0;
    let datePrepare = getDAte(addMonths(depositDate, Number(term)));

    if (interestType == "don") {
      interestResult = calculateSimpleInterest(
        Number(parseCurrency(balanceView)),
        interestRate / 100,
        term / 12
      ).total.toFixed();
    } else {
      interestResult = calculateCompoundInterest(
        Number(parseCurrency(balanceView)),
        interestRate / 100,
        term / 12
      ).total.toFixed();
    }

    const result = await handleCreateLoading(interestResult);

    if (result) {
      Toast.show({
        type: "custom_success",
        position: "top",
        text1: "Thêm thành công!",
        text2: `<strong>Tài khoản</strong>: ${accountName}\n<strong>Tổng số tiền</strong>: ${formatCurrency(
          interestResult + ""
        )} đ\n<strong>Ngày tất toán</strong>: ${datePrepare}`,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
      });
      setTimeout(onPressClose, 1500);
    } else {
      showErrorToast("Có lỗi khi tạo tài khoản. Vui lòng thử lại.");
    }
  };

  const handleFocus = () => {
    setSelection({
      start: 0,
      end: balanceView.length,
    });
  };

  const handleChangeText = (text) => {
    setBalanceView(text);
    if (selection) {
      setSelection(null);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || depositDate;
    setShowDatePicker(Platform.OS === "ios");
    setDepositDate(currentDate);
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
        <Text style={styles.headerTitle}>Thêm sổ tiết kiệm</Text>
        <Ionicons
          name="checkmark"
          size={24}
          color="#fff"
          onPress={handleSave}
        />
      </View>

      <View style={styles.separation}></View>

      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Số dư ban đầu */}
          <View style={styles.inputGroup}>
            <Text>
              Số dư ban đầu <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.balance}>
              <TextInput
                ref={inputRef}
                style={styles.balanceInput}
                keyboardType="numeric"
                value={balanceView}
                onChangeText={handleChangeText}
                onFocus={handleFocus}
                selection={selection}
              />
              <Text style={styles.currency}>đ</Text>
            </View>
          </View>

          {/* Tên sổ tiết kiệm */}
          <View style={styles.inputGroup}>
            <Text>
              Tên sổ tiết kiệm <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên sổ tiết kiệm"
              value={accountName}
              onChangeText={setAccountName}
            />
          </View>

          {/* Tài khoản */}
          <View style={styles.inputGroup}>
            <Text>
              Tài khoản <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.accountSelection}
              onPress={() => setModalVisibleAcc(true)}
            >
              <View style={styles.accountInfo}>
                {selectedAccount.type === "cash" ? (
                  <Icon
                    iconLib="Ionicons"
                    icon="cash-outline"
                    size={24}
                    color="#333"
                  />
                ) : (
                  <Icon
                    iconLib="FontAwesome"
                    name="bank"
                    size={24}
                    color="#333"
                  />
                )}
                <Text style={styles.accountName}>{selectedAccount.name}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Ngày gửi */}
          <View style={styles.inputGroup}>
            <Text>
              Ngày gửi <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePicker}
            >
              <Text style={styles.dateText}>
                {depositDate.toLocaleDateString("vi-VN")}
              </Text>
              <Ionicons name="calendar-outline" size={24} color="#00aaff" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={depositDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Kỳ hạn */}
          <View style={styles.inputGroup}>
            <Text>
              Kỳ hạn (tháng) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Nhập kỳ hạn (số tháng)"
              value={term}
              onChangeText={setTerm}
            />
          </View>

          {/* Lãi suất */}
          <View style={styles.inputGroup}>
            <Text>
              Lãi suất (%/năm) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Nhập lãi suất (%/năm)"
              value={interestRate}
              onChangeText={setInterestRate}
            />
          </View>

          {/* Loại lãi suất */}
          <View style={styles.inputGroup}>
            <Text>
              Loại lãi suất <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.categoryContainer}>
              <SelectOptions
                data={["Lãi đơn", "Lãi kép"]}
                type="radio"
                onSelectionChange={(item) =>
                  setInterestType(item == "Lãi đơn" ? "don" : "kep")
                }
                indexDefault={interestType === "don" ? 0 : 1}
              />
            </View>
          </View>

          {/* Nút lưu */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </ScrollView>
      </Pressable>

      {/* Modal Accounts */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleAcc}
        onRequestClose={() => setModalVisibleAcc(false)}
      >
        <AccountAdd
          onBack={() => {
            setModalVisibleAcc(false);
          }}
          selectedAccount={selectedAccount}
          handleAccountSelect={handleAccountSelect}
        />
      </Modal>

      <Toast config={toastConfig} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#009fda",
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
  balance: {
    position: "relative",
  },
  balanceInput: {
    paddingRight: 18,
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
    fontSize: 16,
  },
  accountSelection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountName: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  categoryContainer: {
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#009fda",
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

export default AddSavingScreen;

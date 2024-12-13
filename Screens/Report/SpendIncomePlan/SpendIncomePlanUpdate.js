import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
  Pressable,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useDebounce } from "../../../hooks";

import OptionModal from "./OptionModal";
import CategoryAdd from "./CategoryAdd";
import HeaderExpense from "./HeaderExpense";
import Icon from "../../../components/Icon";
import AccountAdd from "./AccountAdd";
import Toast from "react-native-toast-message";
import {
  getSpendIncomePlanData,
  saveSpendIncomePlanData,
} from "../../../stores/spendIncomePlanStorage";
import ConfirmationModal from "../../../components/ConfirmationModal";

// Initialize the current time
const currentDateTime = new Date();

export default function SpendIncomePlanUpdate({
  onBack = () => {},
  onReload = () => {},
  datas = {},
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Dự chi");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(currentDateTime);
  const debouncedValue = useDebounce(amount, 500);
  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    name: "Chọn hạng mục",
    icon: "pricetag-outline",
    iconLib: "Ionicons",
  });
  const [selectedAccount, setSelectedAccount] = useState({
    id: 0,
    name: "Chọn tài khoản",
    type: "cash",
  });
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  const convertToDate = (dateString) => {
    // Phân tách chuỗi ngày
    const [day, month, year] = dateString.split("/").map(Number);

    // Tạo đối tượng Date (lưu ý: tháng bắt đầu từ 0, nên cần -1)
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    setSelectedOption(`Dự ${datas.type}`);
    setAmount(datas.amount + "");
    setDate(convertToDate(datas.date));
    setSelectedAccount({
      id: datas.accountId,
      name: datas.accountName,
      type: datas.accountType,
    });
    setSelectedCategory({
      id: datas.categoryId,
      name: datas.categoryName,
      icon: datas.icon,
      iconLib: datas.iconLib,
    });
    setDesc(datas.desc);
  }, []);

  // Visible toggle modal
  const [modalVisibleCate, setModalVisibleCate] = useState(false);
  const [modalVisibleAcc, setModalVisibleAcc] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);

  // Trạng thái điều khiển DateTimePicker Modal
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");

  // handle change amount
  const formatCurrency = (value) => {
    const number = parseInt(value.replace(/[^0-9]/g, ""));
    return isNaN(number) ? "0" : number.toLocaleString("vi-VN");
  };

  // Reset trạng thái dữ liệu
  const resetForm = useCallback(() => {
    setAmount("");
    setDesc("");
    setSelectedCategory({
      id: 0,
      name: "Chọn hạng mục",
      icon: "pricetag-outline",
      iconLib: "Ionicons",
    });
    setSelectedAccount({
      id: 0,
      name: "Chọn tài khoản",
      type: "cash",
      amount: 0,
    });
    setDate(currentDateTime);
    onBack();
  }, []);

  useEffect(() => {
    setAmount((pre) => formatCurrency(pre));
  }, [debouncedValue]);

  const parseCurrency = (value) =>
    parseInt(value.replace(/\./g, "").replace("đ", "").trim());

  // Dữ liệu tùy chọn (Dự chi, Dự thu)
  const options = [
    {
      key: "1",
      label: "Dự chi",
      icon: "remove-circle-outline",
      color: "red",
    },
    { key: "2", label: "Dự thu", icon: "add-circle-outline", color: "green" },
  ];

  // Hàm chuyển đổi trạng thái Modal tùy chọn
  const toggleModal = useCallback(
    () => setModalVisible(!isModalVisible),
    [isModalVisible]
  );

  const selectOption = useCallback((option) => {
    setSelectedOption(option.label);
    setModalVisible(false);
    setSelectedCategory({
      id: 0,
      name: "Chọn hạng mục",
      icon: "pricetag-outline",
      iconLib: "Ionicons",
    });
  }, []);

  // Hàm hiển thị DateTimePicker với mode ngày hoặc giờ
  const showMode = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  // Hàm xử lý khi người dùng chọn ngày/giờ
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);

    if (pickerMode === "date") {
      setDate(currentDate); // Cập nhật ngày
    }
  };

  // func handle categories
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // func handle account
  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleFocus = () => {
    setSelection({
      start: 0,
      end: amount.length,
    });
  };

  const handleChangeText = (text) => {
    setAmount(text);
    if (selection) {
      setSelection(null);
    }
  };

  // convert date +7 UTC to local time
  const getDateAndTime = (dateObj) => {
    const date = `${dateObj.getDate().toString().padStart(2, "0")}/${(
      dateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${dateObj.getFullYear()}`;
    const time = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return { date, time };
  };

  const addHours = (dateObj, hours) => {
    const newDate = new Date(dateObj);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  };

  const prepareTransactionData = () => ({
    id: datas.id,
    amount: parseCurrency(amount),
    date: getDateAndTime(addHours(date, 0)).date,
    accountId: selectedAccount.id,
    categoryId: selectedCategory.id,
    type: selectedOption === "Dự chi" ? "chi" : "thu",
    desc: desc,
    status: "waiting",
  });

  const handleCreateLoading = async () => {
    const transactionPrepare = prepareTransactionData();
    try {
      const dataOld = await getSpendIncomePlanData();

      // Cập nhật dữ liệu
      const updatedData = dataOld.map((item) =>
        item.id === datas.id ? { ...item, ...transactionPrepare } : item
      );
      await saveSpendIncomePlanData(updatedData);
      return true;
    } catch (error) {
      console.error("Error creating transaction:", error);
      return false;
    }
  };

  // Handle Toast Message save
  const handleSave = async () => {
    // Kiểm tra dữ liệu hợp lệ
    if (parseCurrency(amount) === 0) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập số tiền lớn hơn 0",
      });
      return;
    }

    if (selectedCategory.id === 0) {
      Toast.show({
        type: "error",
        text1: "Vui lòng chọn hạng mục!",
      });
      return;
    }

    if (selectedAccount.id === 0) {
      Toast.show({
        type: "error",
        text1: "Vui lòng chọn tài khoản!",
      });
      return;
    }

    // Lưu dữ liệu
    const result = await handleCreateLoading();

    // Hiển thị thông báo và reset nếu thành công
    if (result) {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Dự thu/dự chi đã được thêm thành công",
      });

      onReload();

      setTimeout(() => {
        resetForm();
      }, 1500);
    } else {
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra",
        text2: "Vui lòng thử lại sau.",
      });
    }
  };

  const handleDataRemove = (dataOld, alertId) => {
    const index = dataOld.findIndex((item) => item.id === alertId);
    if (index !== -1) {
      dataOld.splice(index, 1);
    }
    return dataOld;
  };

  const handleRemoveConfirm = async () => {
    try {
      const dataOld = await getSpendIncomePlanData();

      // Cập nhật dữ liệu
      const updatedData = handleDataRemove(dataOld, datas.id);

      await saveSpendIncomePlanData(updatedData);
      setModalVisibleRemove(false);

      Toast.show({
        text1: "Thành công",
        text2: "Xóa dự chi/dự thu thành công.",
        type: "success",
      });

      onReload();

      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (error) {
      console.error("Error updating data:", error);
      Toast.show({
        text1: "Lỗi",
        text2: "Không thể xóa dự chi/dự thu.",
        type: "error",
      });
    }
  };

  return (
    <View style={styles.container}>
      <HeaderExpense
        selectedOption={selectedOption}
        toggleModal={toggleModal}
        onConfirm={() => handleSave()}
        onBackPress={() => onBack()}
      />

      <OptionModal
        isVisible={isModalVisible}
        options={options}
        toggleModal={toggleModal}
        selectOption={selectOption}
      />

      <View style={styles.mainContent}>
        <Pressable onPress={Keyboard.dismiss}>
          <View style={styles.moneyInputContainer}>
            <Text style={styles.moneyInputLabel}>Số tiền</Text>
            <View style={styles.moneyInputFieldContainer}>
              <TextInput
                style={styles.moneyInputField}
                value={amount}
                onChangeText={handleChangeText}
                onFocus={handleFocus}
                selection={selection}
                color={selectedOption === "Dự chi" ? "red" : "green"}
                keyboardType="numeric"
              />
              <Text style={styles.moneyInputCurrency}>₫</Text>
            </View>
            <View style={styles.moneyInputUnderline} />
          </View>

          <View style={styles.dividerBlock} />

          {/* Ngày/Thời gian */}
          <View style={styles.transactionRow}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#333"
              style={styles.transactionIcon}
            />
            <View style={styles.transactionContent}>
              {/* Chọn Ngày */}
              <TouchableOpacity onPress={() => showMode("date")}>
                <Text style={styles.transactionLabel}>
                  {date.toLocaleDateString("vi-VN")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Hiển thị DateTimePicker nếu showPicker là true */}
            {showPicker && (
              <DateTimePicker
                value={date}
                mode={pickerMode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <View style={styles.transactionDivider} />

          {/* Tài khoản */}
          <TouchableOpacity
            style={styles.transactionRow}
            onPress={() => setModalVisibleAcc(true)}
          >
            {selectedAccount.type === "cash" ? (
              <Ionicons
                name="cash-outline"
                size={24}
                color="#333"
                style={styles.transactionIcon}
              />
            ) : (
              <FontAwesome
                name="bank"
                size={24}
                color="#333"
                style={styles.transactionIcon}
              />
            )}
            <View style={styles.transactionContent}>
              <Text style={styles.transactionLabel}>
                {selectedAccount.name}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </View>
          </TouchableOpacity>

          <View style={styles.transactionDivider} />

          {/* Hạng mục */}
          <TouchableOpacity
            style={styles.transactionRow}
            onPress={() => setModalVisibleCate(true)}
          >
            <Icon
              iconLib={selectedCategory.iconLib}
              icon={selectedCategory.icon}
              size={24}
              color="#333"
              style={styles.transactionIcon}
            />
            <View style={styles.transactionContent}>
              <Text style={styles.transactionLabel}>
                {selectedCategory.name}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </View>
          </TouchableOpacity>

          <View style={styles.transactionDivider} />

          <View style={styles.transactionRow}>
            <TextInput
              style={styles.inputDesc}
              placeholder="Nhập diễn giải"
              value={desc}
              onChangeText={setDesc}
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setModalVisibleRemove(true)}
            >
              <Icon iconLib="Ionicons" icon="trash" size={24} color="red" />
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSave()}
            >
              <Icon iconLib="Ionicons" icon="save" size={24} color="#fff" />
              <Text style={styles.saveText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>

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

      {/* Modal Category */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleCate}
        onRequestClose={() => setModalVisibleCate(false)}
      >
        <CategoryAdd
          onBack={() => {
            setModalVisibleCate(false);
          }}
          type={selectedOption}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
        />
      </Modal>

      {/* Modal Remove */}
      <ConfirmationModal
        isVisible={modalVisibleRemove}
        toggleModal={() => {
          setModalVisibleRemove(false);
        }}
        onConfirm={() => {
          handleRemoveConfirm();
        }}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "#009fda",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5cc0ff",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  headerButtonText: { color: "white", fontSize: 16, marginRight: 5 },
  mainContent: { flex: 1 },
  moneyInputContainer: { margin: 15 },
  moneyInputLabel: { fontSize: 16, color: "#333", textAlign: "right" },
  moneyInputFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  moneyInputField: {
    flex: 1,
    fontSize: 25,
    color: "#000",
    textAlign: "right",
    paddingVertical: 3,
    fontWeight: "bold",
  },
  moneyInputCurrency: { fontSize: 20, color: "#000", marginLeft: 4 },
  moneyInputUnderline: { height: 1, backgroundColor: "#ddd" },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  transactionIcon: { width: 30, textAlign: "center", marginRight: 8 },
  transactionContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionLabel: { fontSize: 16, color: "#333" },
  transactionValue: { fontSize: 16, color: "#333" },
  transactionDivider: {
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 20,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    height: 60,
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerVertical: { width: 1, height: "100%", backgroundColor: "#ddd" },
  inputDesc: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 0.45,
    justifyContent: "center",
  },
  deleteText: {
    color: "red",
    marginLeft: 5,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#009fda",
    borderRadius: 5,
    padding: 10,
    flex: 0.45,
    justifyContent: "center",
  },
  saveText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
  dividerBlock: {
    height: 10,
    backgroundColor: "#ddd",
    width: "100%",
    marginVertical: 15,
  },
});

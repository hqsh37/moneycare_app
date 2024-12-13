import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Keyboard,
  Pressable,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDebounce } from "../../hooks";

import CategoryAdd from "./CategoryAdd";
import Icon from "../../components/Icon";
import Toast from "react-native-toast-message";
import {
  getTransactionData,
  saveTransactionData,
} from "../../stores/transactionStorage";
import { addHandleAsyncData } from "../../services/asyncData";
import { updateAmountById } from "../../stores/accountStorage";
import ConfirmationModal from "../../components/ConfirmationModal";

// Initialize the current time
const currentDateTime = new Date();

function UpdateTransactionScreen({
  data = {},
  onPressClose = () => {},
  onReload = () => {},
}) {
  const convertToDate = (dateString) => {
    // Tách ngày, giờ từ chuỗi
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    // Tạo đối tượng Date (lưu ý: tháng bắt đầu từ 0)
    return new Date(year, month - 1, day, hours, minutes);
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    data.type === "chi" ? "Chi tiền" : "Thu tiền"
  );
  const [amount, setAmount] = useState(data.amount);
  const [desc, setDesc] = useState(data.desc);
  const [date, setDate] = useState(convertToDate(data.date));
  const [time, setTime] = useState(convertToDate(data.date));
  const [selectedImage, setSelectedImage] = useState(null);
  const debouncedValue = useDebounce(amount, 500);
  const [selectedCategory, setSelectedCategory] = useState({
    id: data.categoryId,
    name: data.categoryName,
    icon: data.icon,
    iconLib: data.iconLib,
  });
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });
  const getRandomId = () => `account_${Math.floor(Math.random() * 9999999)}`;
  // Visible toggle modal
  const [modalVisibleCate, setModalVisibleCate] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);

  // Trạng thái điều khiển DateTimePicker Modal
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");

  // handle change amount
  const formatCurrency = (value) => {
    if (value) {
      const number = parseInt(value.replace(/[^0-9]/g, ""));
      return isNaN(number) ? "0" : number.toLocaleString("vi-VN");
    } else {
      return "0";
    }
  };

  useEffect(() => {
    setAmount((pre) => formatCurrency(pre));
  }, [debouncedValue]);

  const parseCurrency = (value) =>
    value ? parseInt(value.replace(/\./g, "").replace("đ", "").trim()) : "0";

  // Dữ liệu tùy chọn (Chi tiền, Thu tiền)
  const options = [
    {
      key: "1",
      label: "Chi tiền",
      icon: "remove-circle-outline",
      color: "red",
    },
    { key: "2", label: "Thu tiền", icon: "add-circle-outline", color: "green" },
  ];

  // Hàm hiển thị DateTimePicker với mode ngày hoặc giờ
  const showMode = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  // Hàm xử lý khi người dùng chọn ngày/giờ
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || (pickerMode === "date" ? date : time);
    setShowPicker(false);

    if (pickerMode === "date") {
      setDate(currentDate); // Cập nhật ngày
    } else {
      setTime(currentDate); // Cập nhật giờ
    }
  };

  // func handle categories
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Hàm chọn ảnh từ thư viện hoặc camera
  const handleImageSelection = async (fromCamera) => {
    const permissionResult = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert(
        `Bạn cần cấp quyền truy cập ${
          fromCamera ? "camera" : "bộ sưu tập"
        } để chọn ảnh!`
      );
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
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

  const openImagePicker = () => handleImageSelection(false);
  const openCamera = () => handleImageSelection(true);
  const removeImage = () => setSelectedImage(null);

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
    id: data.id,
    amount: parseCurrency(amount),
    date: `${getDateAndTime(addHours(date, 0)).date} ${
      getDateAndTime(addHours(time, 0)).time
    }`,
    accountId: data.accountId,
    categoryId: selectedCategory.id,
    image: selectedImage,
    type: selectedOption === "Chi tiền" ? "chi" : "thu",
    desc: desc,
  });

  const handleDataUpdate = (dataOld, accountPrepare) =>
    dataOld.map((cat) =>
      cat.id === accountPrepare.id ? { ...cat, ...accountPrepare } : cat
    );

  const handleCreateLoading = async () => {
    const transactionPrepare = prepareTransactionData();

    try {
      const dataOld = await getTransactionData();
      await saveTransactionData(handleDataUpdate(dataOld, transactionPrepare));
      await addHandleAsyncData({
        type: "update",
        tbl: "transaction",
        id: transactionPrepare.id,
        data: transactionPrepare,
      });
      if (data.amount - transactionPrepare.amount !== 0) {
        await addHandleAsyncData({
          type: "update",
          tbl: "amount",
          id: data.accountId,
          data: {
            id: data.accountId,
            amount: data.amount - transactionPrepare.amount,
          },
        });

        await updateAmountById(
          data.accountId,
          data.amount - transactionPrepare.amount,
          "plus"
        );
      }
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

    // Lưu dữ liệu
    const result = await handleCreateLoading();

    // Hiển thị thông báo và reset nếu thành công
    if (result) {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Giao dịch đã được thêm thành công",
      });

      setModalVisibleRemove(false);

      setTimeout(() => {
        onPressClose();
        onReload();
      }, 1500);
    } else {
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra",
        text2: "Vui lòng thử lại sau.",
      });
    }
  };

  const handleDataRemove = async (dataOld, transactionId) => {
    const index = dataOld.findIndex((item) => item.id === transactionId);
    if (index !== -1) {
      dataOld.splice(index, 1);
    }
    return dataOld;
  };

  const handleRemoving = async (transactionId) => {
    try {
      await addHandleAsyncData({
        type: "delete",
        tbl: "transaction",
        id: transactionId,
      });

      const dataOld = await getTransactionData();

      const storageData = await saveTransactionData(
        handleDataRemove(dataOld, transactionId)
      );

      return storageData;
    } catch (error) {
      console.error("Error creating account:", error);
      return false;
    }
  };

  const handleRemoveConfirm = async () => {
    try {
      const success = await handleRemoving(data.id);
      if (success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Khoản thu chi đã xoá thành công!",
        });

        setTimeout(() => {
          onPressClose();
          onReload();
        }, 1500);
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Xoá thất bại, vui lòng thử lại!",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại!",
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
        <Text style={styles.headerTitle}>Sửa khoản thu chi</Text>
        <Ionicons
          name="checkmark"
          size={24}
          color="#fff"
          onPress={handleSave}
        />
      </View>

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
                color={selectedOption === "Chi tiền" ? "red" : "green"}
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

              {/* Chọn Giờ */}
              <TouchableOpacity onPress={() => showMode("time")}>
                <Text style={styles.transactionValue}>
                  {time.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Hiển thị DateTimePicker nếu showPicker là true */}
            {showPicker && (
              <DateTimePicker
                value={pickerMode === "date" ? date : time}
                mode={pickerMode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>

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

          {/* Thêm hoặc hiển thị ảnh */}
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <AntDesign name="closecircle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={openImagePicker}>
                <FontAwesome name="photo" size={35} color="#808080" />
              </TouchableOpacity>
              <View style={styles.dividerVertical} />
              <TouchableOpacity style={styles.button} onPress={openCamera}>
                <Ionicons name="camera-outline" size={35} color="#808080" />
              </TouchableOpacity>
            </View>
          )}

          {/* Nút hành động */}
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
  imageContainer: {
    position: "relative",
    marginHorizontal: 20,
    marginTop: 15,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    objectFit: "contain",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginHorizontal: 20,
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

export default UpdateTransactionScreen;

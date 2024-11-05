import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Image,
  Keyboard,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDebounce } from "../../hooks";
// Header Component
function Header({ selectedOption, toggleModal, onBackPress, onConfirm }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="time-outline" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={toggleModal}>
        <Text style={styles.headerButtonText}>{selectedOption}</Text>
        <Ionicons name="chevron-down-outline" size={16} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onConfirm}>
        <Ionicons name="checkmark-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// Option Modal Component
function OptionModal({ isVisible, options, toggleModal, selectOption }) {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => selectOption(item)}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function ExpenseAdd() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Chi tiền");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState(null);
  const debouncedValue = useDebounce(amount, 500);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  // Trạng thái điều khiển DateTimePicker Modal
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");

  // handle change amount
  const formatCurrency = (value) => {
    const number = parseInt(value.replace(/[^0-9]/g, ""));
    return isNaN(number) ? "0" : number.toLocaleString("vi-VN");
  };

  useEffect(() => {
    setAmount((pre) => formatCurrency(pre));
  }, [debouncedValue]);

  const parseCurrency = (value) =>
    parseInt(value.replace(/\./g, "").replace("đ", "").trim());

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

  // Hàm chuyển đổi trạng thái Modal tùy chọn
  const toggleModal = useCallback(
    () => setModalVisible(!isModalVisible),
    [isModalVisible]
  );

  const selectOption = useCallback((option) => {
    setSelectedOption(option.label);
    setModalVisible(false);
  }, []);

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
      setDate(currentDate);
    } else {
      setTime(currentDate);
    }
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
  return (
    <View style={styles.container}>
      <Header
        selectedOption={selectedOption}
        toggleModal={toggleModal}
        onBackPress={() => console.log("lịch sử")}
        onConfirm={() => console.log("Xác nhận")}
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
              />
              <Text style={styles.moneyInputCurrency}>đ</Text>
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

          {/* Tài khoản */}
          <TouchableOpacity
            style={styles.transactionRow}
            onPress={() => console.log("Chọn tài khoản")}
          >
            <FontAwesome
              name="credit-card"
              size={24}
              color="#333"
              style={styles.transactionIcon}
            />
            <View style={styles.transactionContent}>
              <Text style={styles.transactionLabel}>Ví</Text>
              <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </View>
          </TouchableOpacity>

          <View style={styles.transactionDivider} />

          {/* Hạng mục */}
          <TouchableOpacity
            style={styles.transactionRow}
            onPress={() => console.log("Chọn hạng mục")}
          >
            <Ionicons
              name="pricetag-outline"
              size={24}
              color="#333"
              style={styles.transactionIcon}
            />
            <View style={styles.transactionContent}>
              <Text style={styles.transactionLabel}>Ăn uống</Text>
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

          <View style={styles.dividerBlock} />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </Pressable>
      </View>
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
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  optionContainer: { flexDirection: "row", padding: 10, alignItems: "center" },
  optionText: { fontSize: 16, marginLeft: 10 },
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
  transactionIcon: { width: 30, textAlign: "center" },
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
  saveButton: {
    marginTop: 10,
    backgroundColor: "#009fda",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  saveButtonText: { color: "white", fontSize: 18 },
  dividerBlock: {
    height: 10,
    backgroundColor: "#ddd",
    width: "100%",
    marginVertical: 15,
  },
});

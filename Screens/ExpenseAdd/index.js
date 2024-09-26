import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Keyboard,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import SelectOptions from "../../components/SelectOptions";

function Header({ selectedOption, toggleModal, onBackPress, onConfirm }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="time-outline" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.transactionButton} onPress={toggleModal}>
        <Text style={styles.transactionButtonText}>{selectedOption}</Text>
        <Ionicons name="chevron-down-outline" size={16} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onConfirm}>
        <Ionicons name="checkmark-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default function ExpenseAdd() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Chi tiền");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // date
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  //   data
  const options = [
    {
      key: "1",
      label: "Chi tiền",
      icon: "remove-circle-outline",
      color: "red",
    },
    { key: "2", label: "Thu tiền", icon: "add-circle-outline", color: "green" },
  ];

  const hangmucs = ["suc khoẻ", "ăn uống", "đi lại", "quà cáp"];

  //   handle hạng mục

  const [hangmuc, setHangmuc] = useState([]);

  const handleHangmucChange = (selectedItems) => {
    setHangmuc(selectedItems);
  };

  const accounts = ["ví sang", "ví b", "ngân hàng c"];

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const selectOption = (option) => {
    setSelectedOption(option.label);
    setModalVisible(false);
  };

  const handleBackPress = () => {
    console.log("lịch sử");
  };

  const handleConfirmPress = () => {
    console.log("Xác nhận");
  };

  return (
    <View style={styles.container}>
      <Header
        selectedOption={selectedOption}
        toggleModal={toggleModal}
        onBackPress={handleBackPress}
        onConfirm={handleConfirmPress}
      />

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
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
      <View style={styles.mainContent}>
        <Pressable onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số tiền</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số tiền"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Chọn hạng mục</Text>
            <View style={styles.categoryContainer}>
              <SelectOptions
                data={hangmucs}
                type="radio"
                onSelectionChange={handleHangmucChange}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Diễn giải</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập diễn giải"
              value={note}
              onChangeText={setNote}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tài khoản</Text>
            <Text>Ví Sang</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ngày</Text>
            <View style={styles.txtDate}>
              <TouchableOpacity
                onPress={() => showMode("date")}
                style={styles.textTouchable}
              >
                <Text style={styles.text}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => showMode("time")}
                style={styles.textTouchable}
              >
                <Text style={styles.text}>
                  {"   "}
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {show && (
              <DateTimePicker
                value={date}
                mode={mode}
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#009fda",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5cc0ff",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  transactionButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 5,
  },
  headerText: {
    fontSize: 18,
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  option: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  mainContent: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  txtDate: {
    flexDirection: "row",
    fontSize: 16,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#009fda",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
  },
});

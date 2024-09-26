import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";

const SelectOptions = ({ data, type, modal = false, onSelectionChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  // Hàm xử lý thay đổi lựa chọn
  const handleSelect = (item) => {
    if (type === "radio") {
      setSelectedOptions([item]);
      onSelectionChange([item]); // Trả về tùy chọn đã chọn
    } else if (type === "checkbox") {
      const updatedSelection = selectedOptions.includes(item)
        ? selectedOptions.filter((i) => i !== item)
        : [...selectedOptions, item];
      setSelectedOptions(updatedSelection);
      onSelectionChange(updatedSelection); // Trả về danh sách các tùy chọn đã chọn
    }
  };

  // Đóng hoặc mở modal
  const toggleModal = () => setModalVisible(!isModalVisible);

  return (
    <View style={styles.container}>
      {/* Nếu là modal và modal = true, hiển thị nút để mở modal */}
      {modal ? (
        <>
          <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
            <Text style={styles.buttonText}>Chọn tùy chọn</Text>
          </TouchableOpacity>
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={toggleModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ScrollView>
                  {data.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.optionContainer}
                      onPress={() => handleSelect(item)}
                    >
                      <View
                        style={
                          type === "radio"
                            ? styles.radioButton
                            : styles.checkbox
                        }
                      >
                        {selectedOptions.includes(item) && (
                          <View
                            style={
                              type === "radio"
                                ? styles.radioSelected
                                : styles.checkboxSelected
                            }
                          />
                        )}
                      </View>
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={toggleModal}
                >
                  <Text style={styles.closeModalText}>Xong</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View>
          {data.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.optionContainer}
              onPress={() => handleSelect(item)}
            >
              <View
                style={type === "radio" ? styles.radioButton : styles.checkbox}
              >
                {selectedOptions.includes(item) && (
                  <View
                    style={
                      type === "radio"
                        ? styles.radioSelected
                        : styles.checkboxSelected
                    }
                  />
                )}
              </View>
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Sử dụng hàm trong App component
// export default function App() {
//   const [selection, setSelection] = useState([]);

//   const handleSelectionChange = (selectedItems) => {
//     setSelection(selectedItems);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Sử dụng kiểu radio mà không có modal */}
//       <SelectOptions
//         data={["Option 1", "Option 2", "Option 3"]}
//         type="radio"
//         onSelectionChange={handleSelectionChange}
//       />

//       {/* Sử dụng kiểu checkbox mà không có modal */}
//       <SelectOptions
//         data={["Option A", "Option B", "Option C"]}
//         type="checkbox"
//         onSelectionChange={handleSelectionChange}
//       />

//       {/* Sử dụng kiểu radio trong modal */}
//       <SelectOptions
//         data={["Option X", "Option Y", "Option Z"]}
//         type="radio"
//         modal={true}
//         onSelectionChange={handleSelectionChange}
//       />

//       <Text style={styles.resultText}>Bạn đã chọn: {selection.join(", ")}</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    backgroundColor: "#fff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#00aaff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#00aaff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00aaff",
  },
  checkboxSelected: {
    width: 16,
    height: 16,
    backgroundColor: "#00aaff",
  },
  modalButton: {
    backgroundColor: "#00aaff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    justifyContent: "center",
  },
  closeModalButton: {
    backgroundColor: "#00aaff",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeModalText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  selectedMark: {
    color: "#00aaff",
    fontSize: 18,
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});

export default SelectOptions;

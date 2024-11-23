import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const YearPicker = ({ isVisible, onClose, onSave, mode = "single" }) => {
  const currentYear = new Date().getFullYear() + 5;
  const availableYears = Array.from({ length: 30 }, (_, i) => currentYear - i); // Tạo danh sách năm

  const [selectedYear, setSelectedYear] = useState(null); // Cho "single" mode
  const [selectedStartYear, setSelectedStartYear] = useState(null); // Năm bắt đầu cho "range"
  const [selectedEndYear, setSelectedEndYear] = useState(null); // Năm kết thúc cho "range"
  const [activeTab, setActiveTab] = useState("start"); // Điều khiển tab "Từ" hoặc "Đến"

  const handleYearPress = (year) => {
    if (mode === "single") {
      setSelectedYear(year);
    } else if (mode === "range") {
      if (activeTab === "start") {
        setSelectedStartYear(year);
      } else {
        setSelectedEndYear(year);
      }
    }
  };

  const handleSave = () => {
    if (mode === "single") {
      onSave(selectedYear);
    } else if (mode === "range") {
      onSave([selectedStartYear, selectedEndYear]);
    }
    onClose();
  };

  const renderYearItem = (year) => {
    const isSelected =
      (mode === "single" && year === selectedYear) ||
      (mode === "range" &&
        ((activeTab === "start" && year === selectedStartYear) ||
          (activeTab === "end" && year === selectedEndYear)));

    return (
      <TouchableOpacity
        style={[styles.yearItem, isSelected && styles.selectedYearItem]}
        onPress={() => handleYearPress(year)}
      >
        <Text style={[styles.yearText, isSelected && styles.selectedYearText]}>
          {year}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Tiêu đề hoặc Tabs */}
          {mode === "single" ? (
            <Text style={styles.modalTitle}>Chọn năm</Text>
          ) : (
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  activeTab === "start" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("start")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "start" && styles.activeTabText,
                  ]}
                >
                  Từ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  activeTab === "end" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("end")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "end" && styles.activeTabText,
                  ]}
                >
                  Đến
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Danh sách năm */}
          <FlatList
            data={availableYears}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => renderYearItem(item)}
            contentContainerStyle={styles.yearList}
            showsVerticalScrollIndicator={false}
            style={styles.yearListContainer}
          />

          {/* Nút điều khiển */}
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={onClose} style={styles.footerButton}>
              <Text style={styles.cancelButton}>ĐÓNG</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.footerButton}>
              <Text style={styles.saveButton}>LƯU</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: "center",
    maxHeight: "60%", // Giới hạn chiều cao của modal
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009fda",
    marginBottom: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 15,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#009fda",
  },
  tabText: {
    fontSize: 16,
    color: "#aaa",
  },
  activeTabText: {
    color: "#009fda",
    fontWeight: "bold",
  },
  yearList: {
    alignItems: "center",
  },
  yearListContainer: {
    maxHeight: 200, // Danh sách không chiếm quá nhiều chiều cao
    width: "100%",
  },
  yearItem: {
    paddingVertical: 9,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 50,
    marginVertical: 5,
    width: "90%",
  },
  selectedYearItem: {
    borderColor: "#009fda",
    backgroundColor: "#f0f8ff",
  },
  yearText: {
    fontSize: 18,
    color: "#000",
  },
  selectedYearText: {
    color: "#009fda",
    fontWeight: "bold",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  footerButton: {
    padding: 10,
  },
  cancelButton: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default YearPicker;

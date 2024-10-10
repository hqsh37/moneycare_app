import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import CategoryScreen from "./CategoryScreen";

// Các component trang (đảm bảo đây là function components)
const FinancialReport = () => (
  <View>
    <Text style={styles.pageText}>Tài chính hiện tại</Text>
  </View>
);

const IncomeExpenseReport = () => (
  <View>
    <Text style={styles.pageText}>Tình hình thu chi</Text>
  </View>
);

const ExpenseAnalysis = () => (
  <View>
    <Text style={styles.pageText}>Phân tích chi tiêu</Text>
  </View>
);

const IncomeAnalysis = () => (
  <View>
    <Text style={styles.pageText}>Phân tích thu</Text>
  </View>
);

const FinancialAnalysis = () => (
  <View>
    <Text style={styles.pageText}>Phân tích tài chính</Text>
  </View>
);

const Report = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [SelectedComponent, setSelectedComponent] = useState(null);

  const data = [
    {
      id: "1",
      title: "Tài chính hiện tại",
      icon: "finance",
      color: "#4caf50",
      component: FinancialReport,
    },
    {
      id: "2",
      title: "Tình hình thu chi",
      icon: "chart-line",
      color: "#2196f3",
      component: IncomeExpenseReport,
    },
    {
      id: "3",
      title: "Phân tích chi tiêu",
      icon: "chart-bar",
      color: "#f44336",
      component: ExpenseAnalysis,
    },
    {
      id: "4",
      title: "Phân tích thu",
      icon: "chart-pie",
      color: "#4caf50",
      component: IncomeAnalysis,
    },
    {
      id: "5",
      title: "Quản lý hạng mục",
      icon: "ballot-outline",
      color: "#ffeb3b",
      component: CategoryScreen,
    },
    {
      id: "8",
      title: "Phân tích tài chính",
      icon: "file-chart",
      color: "#9c27b0",
      component: FinancialAnalysis,
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelectedComponent(() => item.component); // Đặt component được chọn
        setModalVisible(true); // Mở modal
      }}
    >
      <Icon name={item.icon} size={30} color={item.color} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textTile}>Báo cáo</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />

      {/* Modal hiển thị trang chi tiết */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Hiển thị trang được chọn */}
          {SelectedComponent ? (
            <SelectedComponent onBack={() => setModalVisible(false)} />
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#009FDA",
    paddingBottom: 20,
    alignItems: "center",
  },
  textTile: {
    fontSize: 18,
    color: "#fff",
  },
  item: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    borderRadius: 10,
    elevation: 3, // Tạo bóng đổ cho mỗi hộp
  },
  title: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pageText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default Report;

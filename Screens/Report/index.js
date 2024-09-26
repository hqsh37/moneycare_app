import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Sử dụng thư viện biểu tượng

const Report = () => {
  const data = [
    { id: "1", title: "Tài chính hiện tại", icon: "finance", color: "#4caf50" },
    {
      id: "2",
      title: "Tình hình thu chi",
      icon: "chart-line",
      color: "#2196f3",
    },
    {
      id: "3",
      title: "Phân tích chi tiêu",
      icon: "chart-bar",
      color: "#f44336",
    },
    { id: "4", title: "Phân tích thu", icon: "chart-pie", color: "#4caf50" },
    { id: "5", title: "Theo dõi vay nợ", icon: "bank", color: "#ffeb3b" },
    {
      id: "6",
      title: "Đối tượng thu/chi",
      icon: "account-multiple",
      color: "#2196f3",
    },
    {
      id: "7",
      title: "Chuyển đi/Sự kiện",
      icon: "swap-horizontal",
      color: "#009688",
    },
    {
      id: "8",
      title: "Phân tích tài chính",
      icon: "file-chart",
      color: "#9c27b0",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
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
        numColumns={2} // Để hiển thị lưới 2 cột
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default Report;

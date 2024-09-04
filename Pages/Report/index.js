import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Report = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.reportText}>Báo cáo</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          style={styles.profileImage}
          source={{ uri: "https://via.placeholder.com/63x55" }}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.nameText}>Nguyễn Thị Mến</Text>
          <Text style={styles.amountText}>910.100 đ</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.card}>
          <Text style={styles.cardText}>Tài chính hiện tại</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Tình hình thu chi</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Phân tích thu</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Phân tích chi tiêu</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Theo dõi vay nợ</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Đối tượng thu/ chi</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Chuyến đi/ Sự kiện</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Phân tích tài chính</Text>
        </View>
      </View>
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
    padding: 20,
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  batteryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  reportText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 16,
    fontWeight: "700",
  },
  profileSection: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 63,
    height: 55,
    borderRadius: 44,
  },
  profileInfo: {
    marginLeft: 20,
  },
  nameText: {
    fontSize: 13,
    fontWeight: "700",
    color: "black",
  },
  amountText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D9D9D9",
  },
  mainContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-around",
  },
  card: {
    backgroundColor: "#F4F3F3",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.17)", // React Native không hỗ trợ trực tiếp shadow như CSS, dùng elevation thay thế
    elevation: 5,
  },
  cardText: {
    fontSize: 12,
    fontWeight: "700",
    color: "black",
  },
});

export default Report;

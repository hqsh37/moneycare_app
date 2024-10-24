import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "../../../components/Icon";

const FinancialReport = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài chính hiện tại</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="chevron-down-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.financialOverview}>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Tài chính hiện tại</Text>
          <Text style={styles.overviewValue}>1.007.115.109 đ</Text>
        </View>
      </View>

      <View style={styles.financialDetails}>
        {/* Tiền mặt */}
        <View style={styles.assetItem}>
          <Ionicons name="wallet-outline" size={24} color="#FFA500" />
          <Text style={styles.assetText}>Tiền mặt</Text>
          <Text style={styles.assetValue}>7.115.109 đ</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#A9A9A9" />
        </View>

        <View style={styles.assetItem}>
          <Ionicons name="logo-alipay" size={24} color="#FF69B4" />
          <Text style={styles.assetText}>Tài khoản tiết kiệm</Text>
          <Text style={styles.assetValue}>1.000.000 đ</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#A9A9A9" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    backgroundColor: "#1E90FF",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    paddingLeft: 10,
  },
  menuButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  financialOverview: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
  },
  overviewRow: {
    flexDirection: "row", // Đặt các thành phần cùng trên 1 hàng
    justifyContent: "space-between", // Căn hai thành phần sang hai đầu
    alignItems: "center", // Căn giữa theo chiều dọc
  },
  overviewLabel: {
    fontSize: 16,
    color: "#666",
  },
  overviewValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#009FDA", // Màu đỏ cho số tiền của "Tài chính hiện tại"
  },
  financialDetails: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  assetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
  },
  assetText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  assetValue: {
    fontSize: 16,
    color: "#1E90FF",
    marginRight: 10,
  },
});

export default FinancialReport;

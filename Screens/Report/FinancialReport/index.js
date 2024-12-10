import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "../../../components/Icon";
import { getAccountData } from "../../../stores/accountStorage";
import { getSavingsData } from "../../../stores/savingStorage";

const FinancialReport = ({ onBack }) => {
  const [sumCash, setSumCash] = useState(0);
  const [savingsAmount, setSavingsAmount] = useState(0);

  useEffect(() => {
    const getdata = async () => {
      const accountDatas = await getAccountData();
      const savings = await getSavingsData();

      if (accountDatas.length > 0) {
        // Tính tổng số tiền chỉ một lần
        const totalCash = accountDatas.reduce(
          (sum, account) => sum + Number(account.amount),
          0
        );
        setSumCash(totalCash);
      } else {
        setSumCash(0); // Đặt sumCash về 0 nếu không có dữ liệu
      }

      if (savings.length > 0) {
        // Tính tổng số tiền chỉ một lần
        const totalSavings = savings.reduce(
          (sum, savings) => sum + Number(savings.amount),
          0
        );
        setSavingsAmount(totalSavings);
      } else {
        setSavingsAmount(0); // Đặt sumCash về 0 nếu không có dữ liệu
      }
    };

    getdata();
  }, []);

  const formatCurrency = (value) => {
    const number = parseInt(value.replace(/[^0-9]/g, ""));
    return isNaN(number) ? "0" : number.toLocaleString("vi-VN");
  };

  const handleAlert = () => {
    Alert.alert(
      "Mô tả",
      "Hiển thị tổng quan về tình hình tài chính cá nhân của bạn. Bao gồm số dư chi tiết trong các ví như tiền mặt, tài khoản ngân hàng, hoặc ví điện tử. Giúp bạn dễ dàng theo dõi tài sản hiện có và quản lý chúng hiệu quả."
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài chính hiện tại</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => handleAlert()}
        >
          <Icon
            iconLib="Ionicons"
            icon="information-circle-outline"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.financialOverview}>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Tài chính hiện tại</Text>
          <Text style={styles.overviewValue}>
            {formatCurrency(sumCash + savingsAmount + "")} đ
          </Text>
        </View>
      </View>

      <View style={styles.financialDetails}>
        {/* Tiền mặt */}
        <View style={styles.assetItem}>
          <Ionicons name="wallet-outline" size={24} color="#FFA500" />
          <Text style={styles.assetText}>Tiền mặt</Text>
          <Text style={styles.assetValue}>
            {formatCurrency(sumCash + "")} đ
          </Text>
        </View>

        <View style={styles.assetItem}>
          <Ionicons name="logo-alipay" size={24} color="#FF69B4" />
          <Text style={styles.assetText}>Tài khoản tiết kiệm</Text>
          <Text style={styles.assetValue}>
            {formatCurrency(savingsAmount + "")} đ
          </Text>
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
    backgroundColor: "#009fda",
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

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "../../../components/Icon";
import HistoryChild from "../../ExpenseAdd/HistoryChild";
import { convertDataTransaction } from "./convertDataTransaction";

function DetailAccountScreen({
  id,
  type,
  name = "Lịch sử ghi",
  onBack = () => {},
}) {
  const [viewDatas, setViewDatas] = useState({});

  useEffect(() => {
    const testfunc = async () => {
      const data = await convertDataTransaction(id, type);

      setViewDatas(data);
    };

    testfunc();
  }, []);

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View></View>
      </View>
      <View style={styles.wrapSum}>
        {/* Tổng thu */}
        <View style={styles.section}>
          <Text style={styles.title}>Tổng thu</Text>
          <Text style={[styles.amount, styles.income]}>
            {formatCurrencyVND(viewDatas.sumColect)}
          </Text>
        </View>
        {/* Tổng chi */}
        <View style={styles.section}>
          <Text style={styles.title}>Tổng chi</Text>
          <Text style={[styles.amount, styles.expense]}>
            {formatCurrencyVND(viewDatas.sumSpend)}
          </Text>
        </View>
      </View>
      <FlatList
        data={viewDatas.transactions}
        renderItem={({ item }) => <HistoryChild data={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#009FDA",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  wrapSum: {
    flexDirection: "row", // Hiển thị theo chiều ngang
    justifyContent: "center", // Cách đều các mục
    padding: 8,
    backgroundColor: "#fff",
    marginTop: 4,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
    backgroundColor: "#fff", // Màu nền (tùy chọn)
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000", // Màu đen cho tiêu đề
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4, // Khoảng cách giữa tiêu đề và số tiền
  },
  income: {
    color: "green", // Màu xanh lá cho "Tổng thu"
  },
  expense: {
    color: "red", // Màu đỏ cho "Tổng chi"
  },
  separation: {
    height: 1,
    width: "100%",
    backgroundColor: "#009fda",
  },
});

export default DetailAccountScreen;

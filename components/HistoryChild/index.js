import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Icon from "../../components/Icon"; // Sử dụng component Icon chung
const HistoryChild = ({ data }) => {
  // Render mỗi mục giao dịch

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const renderTransactionItem = ({ item }) => {
    return (
      <View style={styles.transactionItem}>
        {/* Icon giao dịch */}
        <View style={styles.iconContainer}>
          <Icon
            iconLib={item.iconLib}
            icon={item.icon}
            size={24}
            color="#333"
          />
        </View>

        {/* Tên giao dịch và loại */}
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{item.categoryName}</Text>
          <Text style={styles.transactionType}>
            {item.typeAccount === "cash" ? "Tiền mặt" : "Ngân hàng"}
          </Text>
        </View>

        {/* Số tiền giao dịch */}
        <Text
          style={[
            styles.transactionAmount,
            item.type == "thu" && { color: "green" },
          ]}
        >
          {formatCurrencyVND(item.amount)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị ngày */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{data.date}</Text>
      </View>

      {/* Danh sách các giao dịch */}
      <FlatList
        data={data.transaction}
        renderItem={renderTransactionItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  dateContainer: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009fda",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopColor: "#f0f0f0",
    borderTopWidth: 1,
    paddingBottom: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionType: {
    fontSize: 14,
    color: "gray",
  },
  transactionAmount: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
});

export default HistoryChild;

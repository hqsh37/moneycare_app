import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";

const FinancialReport = ({ data }) => {
  // Helper function to format currency
  const formatCurrency = (value) => {
    return value ? parseInt(value, 10).toLocaleString("vi-VN") + " ₫" : "0 ₫";
  };

  const renderItem = ({ item }) => {
    const total = item.sumCollect - item.sumSpend; // Calculate total
    return (
      <>
        <View style={styles.row}>
          {/* Bên trái: Tháng */}
          <Text style={styles.monthText}>{item.name}</Text>

          {/* Bên phải: Thu, Chi và Tổng */}
          <View style={styles.columnRight}>
            <Text style={styles.collectText}>
              {formatCurrency(item.sumCollect)}
            </Text>
            <Text style={styles.spendText}>
              {formatCurrency(item.sumSpend)}
            </Text>

            <View style={styles.dividerChild}></View>
            <Text
              style={[
                styles.totalText,
                total >= 0 ? styles.positiveTotal : styles.negativeTotal,
              ]}
            >
              {formatCurrency(total)}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row", // Bố cục hàng ngang
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1, // Chiếm toàn bộ không gian bên trái
  },
  columnRight: {
    alignItems: "flex-end", // Canh phải các số liệu
    flex: 1, // Chiếm toàn bộ không gian bên phải
  },
  collectText: {
    color: "green",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  spendText: {
    color: "red",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
  },
  positiveTotal: {
    color: "green",
  },
  negativeTotal: {
    color: "red",
  },
  divider: {
    height: 1,
    backgroundColor: "#d3d3d3",
    marginVertical: 5,
  },
  dividerChild: {
    height: 1,
    width: "60%",
    backgroundColor: "#ddd",
    marginVertical: 5,
  },
});

export default FinancialReport;

import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const accounts = [
  {
    name: "Tiền mặt",
    type: "cash",
  },
  {
    name: "Ngân hàng",
    type: "bank",
  },
];

const DetailSavingScreen = ({ data = {}, onPressClose }) => {
  console.log(data);

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={onPressClose}
        />
        <Text style={styles.headerTitle}>Thêm sổ tiết kiệm</Text>
        <View>
          <Text>{"     "}</Text>
        </View>
      </View>

      <View>
        <View style={styles.balanceContainer}>
          <Text style={styles.label}>Số dư ban đầu</Text>
          <Text style={styles.balance}>{formatCurrencyVND(data.amount)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>tên sổ</Text>
          <Text style={styles.value}>{data.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ngày gửi</Text>
          <Text style={styles.value}>{data.date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Kỳ hạn</Text>
          <Text style={styles.value}>{data.term} Tháng</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Lãi suất</Text>
          <Text style={styles.value}>{data.interestRate}%/năm</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Loại lãi suất</Text>
          <Text style={styles.value}>
            {data.interestType == "don" ? "Lãi đơn" : "Lãi kép"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Trạng thái</Text>
          <Text style={styles.value}>
            {data.status == "active" ? "Chưa tất toán" : "Đã tất toán"}{" "}
          </Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.label}>Tổng tiền tất toán</Text>
          <Text style={styles.balance}>
            {formatCurrencyVND(data.settlementAmount)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#009fda",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  balanceContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  balance: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    color: "#888",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default DetailSavingScreen;

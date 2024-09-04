import { Text, View, StyleSheet } from "react-native";

const SubAccount = () => (
  <View style={styles.balanceContainer}>
    <Text style={styles.balanceText}>Tổng tiền: 7.115.109 đ</Text>
    <Text style={styles.usageText}>Đang sử dụng (910.000 đ)</Text>
    <Text style={styles.nameText}>Nguyễn Thị Mến</Text>
    <Text style={styles.amountText}>910.100 đ</Text>
  </View>
);

const styles = StyleSheet.create({
  balanceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "black",
  },
  usageText: {
    fontSize: 13,
    fontWeight: "700",
    color: "black",
    marginTop: 10,
  },
  nameText: {
    fontSize: 13,
    fontWeight: "700",
    color: "black",
    marginTop: 10,
  },
  amountText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D9D9D9",
    marginTop: 5,
  },
});

export default SubAccount;

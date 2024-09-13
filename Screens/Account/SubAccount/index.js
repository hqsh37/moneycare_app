import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const getIconByType = (type) => {
  switch (type) {
    case "bank":
      return <FontAwesome name="bank" size={35} color="#FFA500" />;
    case "cash":
      return <Ionicons name="cash-outline" size={35} color="#FFA500" />;
    default:
      return <FontAwesome5 name="question" size={35} color="#FFA500" />;
  }
};

const AccountItem = ({ name, amount = 0, type = null }) => {
  return (
    <View style={styles.accountItem}>
      <View style={styles.accountIcon}>{getIconByType(type)}</View>
      <View style={styles.accountDetails}>
        <Text style={styles.accountName}>{name}</Text>
        <Text style={styles.accountAmount}>{amount}</Text>
      </View>
      <MaterialIcons name="more-vert" size={24} color="gray" />
    </View>
  );
};

const SubAccount = () => {
  const accounts = [
    { id: 1, name: "Sang", amount: "910.000 đ", type: "cash" },
    { id: 2, name: "Ngân hàng", amount: "5.000.000 đ", type: "question" },
    { id: 3, name: "Ngân hàng", amount: "5.000.000 đ", type: "bank" },
    { id: 4, name: "Ngân hàng", amount: "5.000.000 đ", type: "question" },
    { id: 5, name: "Ngân hàng", amount: "5.000.000 đ", type: "question" },
    { id: 6, name: "Ngân hàng", amount: "5.000.000 đ", type: "bank" },
    { id: 7, name: "Ngân hàng", amount: "5.000.000 đ", type: "question" },
    { id: 8, name: "Ngân hàng", amount: "5.000.000 đ", type: "bank" },
    { id: 9, name: "Ngân hàng", amount: "5.000.000 đ", type: "question" },
    { id: 10, name: "Ngân hàng", amount: "5.000.000 đ", type: "question" },
    { id: 11, name: "Ngân hàng", amount: "5.000.000 đ", type: "question" },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Tổng tiền: 5.910.000 đ</Text>
      </View>

      {/* Accounts List */}
      <View style={styles.accountList}>
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AccountItem
              name={item.name}
              amount={item.amount}
              type={item.type}
            />
          )}
        />
      </View>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  balanceContainer: {
    backgroundColor: "#fff",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  accountList: {
    flex: 1,
    marginTop: 10,
  },
  accountListTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 2,
  },
  accountIcon: {
    marginRight: 10,
    width: 35,
    alignItems: "center",
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  accountAmount: {
    fontSize: 14,
    color: "gray",
    marginTop: 3,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#009fda",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SubAccount;

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const SubAccountItem = ({ name, amount = 0, IconType, onPress = () => {} }) => {
  return (
    <View style={styles.accountItem}>
      <View style={styles.accountIcon}>{IconType}</View>
      <View style={styles.accountDetails}>
        <Text style={styles.accountName}>{name}</Text>
        <Text style={styles.accountAmount}>{amount}</Text>
      </View>
      <MaterialIcons
        name="more-vert"
        size={24}
        color="gray"
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SubAccountItem;

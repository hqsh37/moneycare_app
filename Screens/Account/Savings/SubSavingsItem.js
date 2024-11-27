import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "../../../components/Icon";

const SubSavingsItem = ({
  date,
  name,
  amount,
  status = "active",
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[styles.savingsItem, status === "closing" && { opacity: 0.6 }]}
      >
        {/* Piggy bank icon */}
        <View style={styles.savingsIcon}>
          <FontAwesome5 name="piggy-bank" size={24} color="#FFA500" />
        </View>

        {/* Savings details */}
        <View style={styles.savingsDetails}>
          <Text style={styles.savingsName}>{name}</Text>
          <Text style={styles.savingsAmount}>{amount}</Text>
        </View>

        {/* Date positioned to the right */}
        <Text style={styles.savingsDate}>{date}</Text>

        {/* More options icon */}
        {status === "active" ? (
          <Icon
            style={{ marginLeft: 8 }}
            iconLib="Ionicons"
            icon="wallet-outline"
            size={22}
            color="green"
          />
        ) : (
          <Icon
            style={{ marginLeft: 8 }}
            iconLib="Ionicons"
            icon="checkmark-done-outline"
            size={22}
            color="gray"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  savingsItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 2,
  },
  savingsIcon: {
    marginRight: 10,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  savingsDetails: {
    flex: 1,
  },
  savingsName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  savingsAmount: {
    fontSize: 14,
    color: "#333",
    marginTop: 3,
  },
  savingsDate: {
    fontSize: 14,
    color: "#000",
    marginLeft: 10,
  },
});

export default SubSavingsItem;

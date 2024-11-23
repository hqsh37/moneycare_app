import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; // Icon for piggy bank

const SubSavingsItem = ({ date, name, amount, onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.savingsItem}>
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
        <MaterialIcons name="more-vert" size={24} color="gray" />
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

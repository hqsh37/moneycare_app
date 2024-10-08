// ActionMenu.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ActionMenu = ({ onUpdate, onRemove, onDetail }) => {
  return (
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.menuItem} onPress={onUpdate}>
        <Ionicons name="pencil-outline" size={24} color="fff" />
        <Text style={styles.menuText}>Sửa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={onRemove}>
        <Ionicons name="trash-outline" size={24} color="fff" />
        <Text style={styles.menuText}>Xóa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={onDetail}>
        <Ionicons name="information-outline" size={24} color="fff" />
        <Text style={styles.menuText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1.5,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: "fff",
  },
});

export default ActionMenu;

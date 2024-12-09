import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

function OptionModal({ isVisible, options, toggleModal, selectOption }) {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => selectOption(item)}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  optionContainer: { flexDirection: "row", padding: 10, alignItems: "center" },
  optionText: { fontSize: 16, marginLeft: 10 },
  mainContent: { flex: 1 },
  moneyInputContainer: { margin: 15 },
  moneyInputLabel: { fontSize: 16, color: "#333", textAlign: "right" },
  moneyInputFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  moneyInputField: {
    flex: 1,
    fontSize: 25,
    color: "#000",
    textAlign: "right",
    paddingVertical: 3,
    fontWeight: "bold",
  },
  moneyInputCurrency: { fontSize: 20, color: "#000", marginLeft: 4 },
  moneyInputUnderline: { height: 1, backgroundColor: "#ddd" },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
});

export default OptionModal;

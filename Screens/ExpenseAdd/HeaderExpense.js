import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function HeaderExpense({
  selectedOption,
  toggleModal,
  onBackPress,
  onConfirm,
}) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="time-outline" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={toggleModal}>
        <Text style={styles.headerButtonText}>{selectedOption}</Text>
        <Ionicons name="chevron-down-outline" size={16} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onConfirm}>
        <Ionicons name="checkmark-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#009fda",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5cc0ff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  headerButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 5,
  },
});

export default HeaderExpense;

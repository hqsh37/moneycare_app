import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Savings = () => (
  <View style={styles.wrapper}>
    <Text>Savings Screen</Text>
    <TouchableOpacity style={styles.fab}>
      <Ionicons name="add" size={30} color="#fff" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default Savings;

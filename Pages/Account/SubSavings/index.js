import { Text, View, StyleSheet } from "react-native";

const SubSavings = () => (
  <View style={styles.wrapper}>
    <Text>Savings Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SubSavings;

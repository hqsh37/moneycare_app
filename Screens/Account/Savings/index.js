import { Text, View, StyleSheet, TouchableOpacity, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ButtonAdd from "../../../components/ButtonAdd";

const Savings = () => (
  <View style={styles.wrapper}>
    <View style={styles.SavingList}>
      <View>
        <Text style={styles.txtEmpty}>Bạn chưa có sổ tiết kiệm nào!</Text>
        <ButtonAdd
          outline
          leftIcon={<Ionicons name="add" color="#009fda" size={20} />}
          style={styles.cusBtnEmpty}
        >
          Thêm sổ tiết kiệm
        </ButtonAdd>
      </View>
    </View>
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
  txtEmpty: {
    color: "#abb3bd",
    fontSize: 16,
  },
  cusBtnEmpty: {
    borderColor: "transparent",
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

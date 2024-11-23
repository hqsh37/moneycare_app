import { Text, View, StyleSheet, TouchableOpacity, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import ButtonAdd from "../ButtonAdd";

const EmptyItem = ({ title, btnTitle, onPress = () => {} }) => (
  <View style={styles.wrapper}>
    <View style={styles.SavingList}>
      <View>
        <Text style={styles.txtEmpty}>{title}</Text>
        <ButtonAdd
          outline
          leftIcon={<Ionicons name="add" color="#009fda" size={20} />}
          style={styles.cusBtnEmpty}
          onPress={onPress}
        >
          {btnTitle}
        </ButtonAdd>
      </View>
    </View>
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
});

export default EmptyItem;

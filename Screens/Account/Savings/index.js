import { StyleSheet, View } from "react-native";
import EmptyItem from "../../../components/EmptyItem";

const Savings = () => {
  return (
    <View style={styles.wrapper}>
      <EmptyItem
        title="Bạn chưa có sổ tiết kiệm nào!"
        btnTitle="Thêm sổ tiết kiệm"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default Savings;

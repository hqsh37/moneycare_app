import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "../../components/Icon";
import HistoryChild from "./HistoryChild";

const fakeData = [
  {
    date: "10/11/2024",
    transaction: [
      {
        amount: 8000,
        icon: "fast-food-outline",
        iconLib: "Ionicons",
        name: "Ăn tiệm",
        typeAccount: "cash",
      },
      {
        amount: 90000,
        icon: "hamburger",
        iconLib: "FontAwesome5",
        name: "Ăn uống",
        typeAccount: "cash",
      },
    ],
  },
  {
    date: "20/10/2024",
    transaction: [
      {
        amount: 10000,
        icon: "medkit",
        iconLib: "Ionicons",
        name: "Sức khỏe",
        typeAccount: "cash",
      },
    ],
  },
  {
    date: "11/10/2024",
    transaction: [
      {
        amount: 1000000,
        icon: "cart-outline",
        iconLib: "Ionicons",
        name: "Đi chợ/siêu thị",
        typeAccount: "bank",
      },
    ],
  },
  {
    date: "10/11/2024",
    transaction: [
      {
        amount: 8000,
        icon: "fast-food-outline",
        iconLib: "Ionicons",
        name: "Ăn tiệm",
        typeAccount: "cash",
      },
      {
        amount: 90000,
        icon: "hamburger",
        iconLib: "FontAwesome5",
        name: "Ăn uống",
        typeAccount: "cash",
      },
    ],
  },
  {
    date: "20/10/2024",
    transaction: [
      {
        amount: 10000,
        icon: "medkit",
        iconLib: "Ionicons",
        name: "Sức khỏe",
        typeAccount: "cash",
      },
    ],
  },
  {
    date: "11/10/2024",
    transaction: [
      {
        amount: 1000000,
        icon: "cart-outline",
        iconLib: "Ionicons",
        name: "Đi chợ/siêu thị",
        typeAccount: "bank",
      },
    ],
  },
  {
    date: "10/11/2024",
    transaction: [
      {
        amount: 8000,
        icon: "fast-food-outline",
        iconLib: "Ionicons",
        name: "Ăn tiệm",
        typeAccount: "cash",
      },
      {
        amount: 90000,
        icon: "hamburger",
        iconLib: "FontAwesome5",
        name: "Ăn uống",
        typeAccount: "cash",
      },
    ],
  },
  {
    date: "20/10/2024",
    transaction: [
      {
        amount: 10000,
        icon: "medkit",
        iconLib: "Ionicons",
        name: "Sức khỏe",
        typeAccount: "cash",
      },
    ],
  },
  {
    date: "11/10/2024",
    transaction: [
      {
        amount: 1000000,
        icon: "cart-outline",
        iconLib: "Ionicons",
        name: "Đi chợ/siêu thị",
        typeAccount: "bank",
      },
    ],
  },
];
function HistoryScreen({ onBack = () => {} }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử ghi</Text>
        <TouchableOpacity>
          <Icon icon="search" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={fakeData}
        renderItem={({ item }) => <HistoryChild data={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00aaff",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  separation: {
    height: 1,
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
});

export default HistoryScreen;

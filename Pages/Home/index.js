import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import Button from "../../components/ButtonAdd";

const Home = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Chào Mến Nguyễn!</Text>
        <View style={styles.headerIcons}>{/* Icons can be placed here */}</View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>Tổng số dư</Text>
          <Image
            style={styles.eyeIcon}
            source={{ uri: "https://via.placeholder.com/18x12" }}
          />
          <Text style={styles.balanceAmount}>1.007.115.109 đ</Text>
        </View>
      </View>

      <View style={styles.subBlock}>
        <Text style={styles.sectionTitle}>Hạn mức chi</Text>
        <View style={styles.cusNoDataText}>
          <Text style={styles.noDataText}>
            Cùng MoneyCare lập ra các hạn mức chi để quản lý chi tiêu tốt hơn
            nhé.
          </Text>
        </View>
        <View style={styles.cusButton}>
          <Button outline small width={150}>
            Thêm hạn mức
          </Button>
        </View>
      </View>

      <View style={styles.subBlock}>
        <Text style={styles.sectionTitle}>Du lịch</Text>
        <View style={styles.cusNoDataText}>
          <Text style={styles.noDataText}>
            Hãy tạo chuyến đi cùng MoneyCare
          </Text>
        </View>
        <View style={styles.cusButton}>
          <Button outline small width={150}>
            Thêm mới
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#009fda",
    padding: 20,
    paddingBottom: 32,
  },
  subBlock: {
    borderBottomColor: "#e6e6e6",
    borderBottomWidth: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: "#D9ECF2",
    fontSize: 13,
    fontWeight: "700",
  },
  battery: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  greeting: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  balanceContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    borderColor: "rgba(108, 193, 226, 0.50)",
    borderWidth: 0.6,
  },
  balanceTitle: {
    color: "#D9D9D9",
    fontSize: 14,
    fontWeight: "600",
  },
  eyeIcon: {
    width: 17.54,
    height: 12,
    position: "absolute",
    right: 16,
    top: 16,
  },
  balanceAmount: {
    color: "#6AADDE",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
  },
  sectionTitle: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 16,
    marginTop: 16,
  },
  subtitle: {
    color: "#D9D9D9",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 16,
    marginTop: 8,
  },
  noDataText: {
    color: "#D9D9D9",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 16,
    marginTop: 8,
    maxWidth: "70%",
    textAlign: "center",
  },
  cusNoDataText: {
    alignItems: "center",
  },
  addText: {
    color: "#56CAE3",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 16,
    marginTop: 8,
    textAlign: "right",
  },
  cusButton: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
});

export default Home;

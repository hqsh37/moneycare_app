import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import Feathericon from "react-native-vector-icons/Feather";

import ButtonAdd from "../../components/ButtonAdd";
import { getTimestamps } from "../../stores/Timestamp";
import { getAccountData } from "../../stores/accountStorage";
import { checkNetworkStatus } from "../../services/asyncDataCloud";
import { asyncDataCloud } from "../../handlers/dataAsyncHandle";

const Home = () => {
  const [hideCash, setHidecash] = useState(false);
  const [name, setName] = useState("bạn");
  const [sumCash, setSumCash] = useState(0);

  useEffect(() => {
    const getdata = async () => {
      await asyncData();
      const user = await getTimestamps();

      const accountDatas = await getAccountData();

      if (accountDatas.length > 0) {
        // Tính tổng số tiền chỉ một lần
        const totalCash = accountDatas.reduce(
          (sum, account) => sum + Number(account.amount),
          0
        );
        setSumCash(totalCash);
        setName(user.lastname);
      } else {
        setSumCash(0); // Đặt sumCash về 0 nếu không có dữ liệu
      }
    };

    getdata();
  }, []);

  const formatCurrency = (value) => {
    const number = parseInt(value.replace(/[^0-9]/g, ""));
    return isNaN(number) ? "0" : number.toLocaleString("vi-VN");
  };

  const asyncData = async () => {
    const isConnected = await checkNetworkStatus();
    if (isConnected) {
      console.log("Device is online");
      await asyncDataCloud();
    } else {
      console.log("Device is offline");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Chào {name}!</Text>
          <Feathericon name="bell" size={22} color={"#fff"} />
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>Tổng số dư</Text>
          <Feathericon
            style={styles.eyeIcon}
            name={hideCash ? "eye-off" : "eye"}
            size={20}
            onPress={() => setHidecash(!hideCash)}
          />
          <Text style={styles.balanceAmount}>
            {hideCash ? "*****" : formatCurrency(sumCash.toString()) + " đ"}
          </Text>
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
          <ButtonAdd outline small width={150}>
            Thêm hạn mức
          </ButtonAdd>
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
          <ButtonAdd outline small width={150}>
            Thêm mới
          </ButtonAdd>
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 32,
  },
  subBlock: {
    borderBottomColor: "#e6e6e6",
    borderBottomWidth: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
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
    justifyContent: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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

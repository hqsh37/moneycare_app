import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  RefreshControl,
} from "react-native";
import Feathericon from "react-native-vector-icons/Feather";

import ButtonAdd from "../../components/ButtonAdd";
import { getTimestamps } from "../../stores/Timestamp";
import { getAccountData } from "../../stores/accountStorage";
import { checkNetworkStatus } from "../../services/asyncDataCloud";
import { asyncDataCloud } from "../../handlers/dataAsyncHandle";
import { BarChart, PieChart } from "react-native-chart-kit";
import { getTransactionData } from "../../stores/transactionStorage";
import Loading from "../../components/Loading";
import DonutChartAuto from "../../components/DonutChartAuto";
import { getSavingsData } from "../../stores/savingStorage";
import Icon from "../../components/Icon";
import { getConfigData, updateConfigData } from "../../stores/configStorage";

const Home = () => {
  const [hideCash, setHidecash] = useState(true);
  const [name, setName] = useState("bạn");
  const [sumCash, setSumCash] = useState(0);
  const [dataChart, setDataChart] = useState([0, 0]);
  const [dataDonut, setDataDonut] = useState([{ label: "Trống", value: 1 }]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getdata();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getdata();
  };

  const getdata = async () => {
    setIsLoading(true);
    await asyncData();
    const user = await getTimestamps();

    const accountDatas = await getAccountData();
    const savingDatas = await getSavingsData();
    const config = await getConfigData();

    if (config?.hideCash) {
      setHidecash(true);
    } else {
      setHidecash(false);
    }

    if (accountDatas.length > 0) {
      // Tính tổng số tiền chỉ một lần
      const totalCash = accountDatas.reduce(
        (sum, account) => sum + Number(account.amount),
        0
      );

      if (savingDatas.length > 0) {
        // Tính tổng số tiền chỉ một lần
        const totalCashSving = savingDatas.reduce(
          (sum, account) => sum + Number(account.amount),
          0
        );
        setDataDonut([
          { label: "Tiền mặt", value: totalCash < 0 ? 1 : totalCash },
          { label: "Tiết kiệm", value: totalCashSving },
        ]);
      } else {
        setDataDonut([
          { label: "Tiền mặt", value: totalCash < 0 ? 1 : totalCash },
          { label: "Tiết kiệm", value: 0 },
        ]);
      }

      setSumCash(totalCash);
      setName(user.lastname);
    } else {
      setSumCash(0);
      setDataDonut([{ label: "Trống", value: 1 }]);
    }

    const transactionDatas = await getTransactionData();

    if (transactionDatas.length > 0) {
      let sumSpend = 0;
      let sumIncome = 0;

      const currentDate = new Date(); // Ngày hiện tại
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      transactionDatas.forEach((transaction) => {
        const transactionDate = new Date(
          transaction.date.split(" ")[0].split("/").reverse().join("-")
        );
        // Tính tổng cho tháng hiện tại
        if (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        ) {
          if (transaction.type == "chi") {
            sumSpend += Number(transaction.amount);
          } else if (transaction.type == "thu") {
            sumIncome += Number(transaction.amount);
          }
        }
      });

      // Cập nhật dữ liệu biểu đồ
      setDataChart([sumSpend, sumIncome]);
    } else {
      setDataChart([0, 0]);
    }
    setIsLoading(false);
    setRefreshing(false);
  };

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

  const hanldeHideCash = async () => {
    setHidecash(!hideCash);
    await updateConfigData({ hideCash: !hideCash });
  };

  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Chào {name}!</Text>
          <Icon
            iconLib="MaterialCommunityIcons"
            icon="sync"
            size={22}
            color={"#fff"}
            onPress={() => getdata()}
          />
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>Tổng số dư</Text>
          <Feathericon
            style={styles.eyeIcon}
            name={hideCash ? "eye-off" : "eye"}
            size={20}
            onPress={() => hanldeHideCash()}
          />
          <Text style={styles.balanceAmount}>
            {hideCash ? "*****" : formatCurrencyVND(sumCash.toString())}
          </Text>
        </View>
      </View>

      <View style={styles.subBlock}>
        <Text style={styles.sectionTitle}>Thu chi tháng này</Text>
        {isLoading ? (
          <Loading />
        ) : (
          <View style={styles.chartView}>
            <BarChart
              data={{
                labels: ["Chi", "Thu"],
                datasets: [
                  {
                    data: dataChart.map((i) => i / 1000000),
                  },
                ],
              }}
              width={Dimensions.get("window").width / 2} // Chiều rộng biểu đồ
              height={220} // Chiều cao biểu đồ
              yAxisSuffix="tr" // Hậu tố trục Y
              fromZero={true} // Bắt đầu trục Y từ 0
              yAxisInterval={1} // Khoảng cách giữa các giá trị trên trục Y
              chartConfig={{
                backgroundGradientFrom: "#f0f8ff", // Nền xanh dương nhạt
                backgroundGradientTo: "#f0f8ff",
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Màu cột
                labelColor: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Màu chữ nhãn
              }}
              style={{
                marginVertical: 8,
              }}
            />

            {hideCash ? (
              <View style={styles.detailAnalysis}>
                <Text style={styles.amountIncome}>***** ₫</Text>
                <Text style={styles.amountSpend}>***** ₫</Text>
                <Text style={styles.sumAmount}>***** ₫</Text>
              </View>
            ) : (
              <View style={styles.detailAnalysis}>
                <Text style={styles.amountIncome}>
                  {formatCurrencyVND(dataChart[1] + "")}
                </Text>
                <Text style={styles.amountSpend}>
                  {formatCurrencyVND(dataChart[0] + "")}
                </Text>
                <Text style={styles.sumAmount}>
                  {formatCurrencyVND(dataChart[1] - dataChart[0] + "")}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={styles.subBlock}>
        <Text style={styles.sectionTitle}>Tài chính hiện tại</Text>
        {isLoading ? (
          <Loading />
        ) : (
          <View
            style={[
              styles.chartView,
              {
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <DonutChartAuto data={dataDonut} />
          </View>
        )}
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
    backgroundColor: "#f0f8ff",
    margin: 8,
    minHeight: 280,
  },
  chartView: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  detailAnalysis: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: 25,
    marginBottom: 30,
  },
  amountSpend: {
    fontSize: 18,
    color: "red",
    marginBottom: 4,
  },
  amountIncome: {
    fontSize: 18,
    color: "green",
  },
  sumAmount: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#d3d3d3",
    paddingTop: 4,
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
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
    marginTop: 16,
  },
});

export default Home;

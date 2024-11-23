import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LineChart } from "react-native-chart-kit";

import FinancialReport from "./FinancialReport";
import YearPicker from "../../../components/YearPicker";
import { getTransactionData } from "../../../stores/transactionStorage";

const screenWidth = Dimensions.get("window").width;

const IncomeExpenseReport = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState("HIỆN TẠI");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedRange, setSelectedRange] = useState([
    new Date().getFullYear() - 5,
    new Date().getFullYear(),
  ]);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [chartData, setChartData] = useState(null);

  const [currentData, setCurrentData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const dataTransactions = await getTransactionData();
      const dataConverted = convertToYearMonthSummary(dataTransactions);
      setTransactions(dataConverted);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (transactions) {
      handleSetData();
    }
  }, [selectedTab, selectedYear, selectedRange, transactions]);

  const handleSetData = () => {
    if (!transactions) return;

    if (selectedTab === "HIỆN TẠI") {
      const currentDataPrepare = prepareCurrentData(transactions);
      setCurrentData(currentDataPrepare);

      // Prepare chart data
      setChartData({
        labels: currentDataPrepare.map((item) => item.name),
        datasets: [
          {
            data: currentDataPrepare.map((item) => item.sumSpend / 1000000),
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: currentDataPrepare.map((item) => item.sumCollect / 1000000),
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
    } else if (selectedTab === "THÁNG") {
      const monthDataPrepare = [];

      transactions.forEach(({ year, data }) => {
        if (parseInt(year) === selectedYear) {
          monthDataPrepare.push(
            ...data.map(({ month, sumSpend, sumCollect }) => ({
              name: `T${month}`, // Remove "Tháng" prefix
              sumSpend,
              sumCollect,
            }))
          );
        }
      });

      setMonthData(monthDataPrepare);

      setChartData({
        labels: monthDataPrepare.map((item) => item.name),
        datasets: [
          {
            data: monthDataPrepare.map((item) => item.sumSpend / 1000000),
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: monthDataPrepare.map((item) => item.sumCollect / 1000000),
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
    } else if (selectedTab === "NĂM") {
      const yearDataPrepare = [];
      const [yearFrom, yearTo] = selectedRange;

      transactions.forEach(({ year, data }) => {
        const yearInt = parseInt(year);
        if (yearInt >= yearFrom && yearInt <= yearTo) {
          const sumSpend = data.reduce(
            (sum, { sumSpend }) => sum + sumSpend,
            0
          );
          const sumCollect = data.reduce(
            (sum, { sumCollect }) => sum + sumCollect,
            0
          );

          yearDataPrepare.push({
            name: `${year}`, // Remove any "Tháng" prefix
            sumSpend,
            sumCollect,
          });
        }
      });

      setYearData(yearDataPrepare);

      setChartData({
        labels: yearDataPrepare.map((item) => item.name),
        datasets: [
          {
            data: yearDataPrepare.map((item) => item.sumSpend / 1000000),
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: yearDataPrepare.map((item) => item.sumCollect / 1000000),
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
    } else {
      setChartData(null);
    }
  };

  function prepareCurrentData(transactions) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
    const currentQuarter = Math.floor((currentMonth - 1) / 3) + 1;

    let monthData = { sumSpend: 0, sumCollect: 0 };
    let quarterData = { sumSpend: 0, sumCollect: 0 };
    let yearData = { sumSpend: 0, sumCollect: 0 };

    transactions.forEach(({ year, data }) => {
      if (parseInt(year) === currentYear) {
        data.forEach(({ month, sumSpend, sumCollect }) => {
          const monthInt = parseInt(month);

          // Year data
          yearData.sumSpend += sumSpend;
          yearData.sumCollect += sumCollect;

          // Quarter data
          const monthQuarter = Math.floor((monthInt - 1) / 3) + 1;
          if (monthQuarter === currentQuarter) {
            quarterData.sumSpend += sumSpend;
            quarterData.sumCollect += sumCollect;
          }

          // Month data
          if (monthInt === currentMonth) {
            monthData.sumSpend += sumSpend;
            monthData.sumCollect += sumCollect;
          }
        });
      }
    });

    return [
      { name: "Tháng", ...monthData },
      { name: "Quý", ...quarterData },
      { name: "Năm", ...yearData },
    ];
  }

  function convertToYearMonthSummary(data) {
    const yearMonthSummary = {};

    data.forEach((item) => {
      const amount = parseInt(item.amount, 10);
      const [day, month, year] = item.date.split(" ")[0].split("/");
      const type = item.type; // "thu" (collect) hoặc "chi" (spend)

      if (!yearMonthSummary[year]) {
        yearMonthSummary[year] = {};
      }

      if (!yearMonthSummary[year][month]) {
        yearMonthSummary[year][month] = { sumSpend: 0, sumCollect: 0 };
      }

      if (type === "chi") {
        yearMonthSummary[year][month].sumSpend += amount;
      } else if (type === "thu") {
        yearMonthSummary[year][month].sumCollect += amount;
      }
    });

    const result = Object.keys(yearMonthSummary).map((year) => {
      const monthlyData = Object.keys(yearMonthSummary[year])
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((month) => ({
          month,
          sumSpend: yearMonthSummary[year][month].sumSpend,
          sumCollect: yearMonthSummary[year][month].sumCollect,
        }));
      return {
        year,
        data: monthlyData,
      };
    });

    return result;
  }

  const handleYearSave = (yearOrRange) => {
    if (selectedTab === "THÁNG") {
      setSelectedYear(yearOrRange);
    } else if (selectedTab === "NĂM") {
      setSelectedRange(yearOrRange);
    }
    setShowYearPicker(false);
  };

  const renderContent = () => {
    if (!chartData || chartData.labels.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Chưa có dữ liệu</Text>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartLabel}>(Đơn vị: Triệu)</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix="M"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          fromZero
          verticalLabelRotation={30}
          segments={5}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Thanh tiêu đề */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tình hình thu chi</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Tabs */}
        <View style={styles.tabs}>
          {["HIỆN TẠI", "THÁNG", "NĂM"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hiển thị năm (chỉ cho tab "THÁNG" và "NĂM") */}
        {selectedTab !== "HIỆN TẠI" && (
          <View style={styles.dateContainer}>
            <TouchableOpacity onPress={() => setShowYearPicker(true)}>
              <View style={styles.dateRow}>
                <Icon name="calendar-outline" size={24} color="#A9A9A9" />
                <Text style={styles.dateText}>
                  {selectedTab === "THÁNG"
                    ? `${selectedYear}`
                    : `${selectedRange[0]} - ${selectedRange[1]}`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Nội dung hiển thị */}
        {renderContent()}

        <FinancialReport
          data={
            selectedTab === "HIỆN TẠI"
              ? currentData
              : selectedTab === "THÁNG"
              ? monthData
              : yearData
          }
          tab={selectedTab}
        />

        {/* YearPicker */}
        {selectedTab !== "HIỆN TẠI" && (
          <YearPicker
            isVisible={showYearPicker}
            onClose={() => setShowYearPicker(false)}
            onSave={handleYearSave}
            mode={selectedTab === "THÁNG" ? "single" : "range"}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, width: "100%", backgroundColor: "#F0F8FF" },
  container: { flex: 1, backgroundColor: "#F0F8FF" },
  header: {
    backgroundColor: "#009fda",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { paddingLeft: 10 },
  shareButton: { paddingRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#009fda",
    paddingTop: 10,
  },
  tabItem: { paddingHorizontal: 20 },
  tabText: { fontSize: 16, color: "#fff" },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#FFFFFF" },
  noDataContainer: { alignItems: "center", marginVertical: 20 },
  noDataText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  chartContainer: { padding: 20, backgroundColor: "#FFFFFF" },
  chartLabel: { fontSize: 14, color: "#666", marginBottom: 5 },
  dateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFF",
  },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateText: { fontSize: 18, fontWeight: "bold", color: "#000", marginLeft: 10 },
});

export default IncomeExpenseReport;

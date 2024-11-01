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
import DateTimePicker from "@react-native-community/datetimepicker"; // Thư viện chọn ngày tháng
import { LineChart } from "react-native-chart-kit"; // Thư viện biểu đồ

const screenWidth = Dimensions.get("window").width;

const IncomeExpenseReport = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState("HIỆN TẠI"); // Quản lý tab được chọn
  const [selectedDate, setSelectedDate] = useState(new Date()); // Quản lý thời gian hiện tại
  const [showPicker, setShowPicker] = useState(false); // Trạng thái hiển thị DateTimePicker
  const [chartData, setChartData] = useState(null); // Quản lý dữ liệu biểu đồ

  // Hàm áp cứng dữ liệu cho các tab
  const fetchChartData = async (tab, date) => {
    let labels = [];
    let datasets = [];
    let data = [];

    if (tab === "HIỆN TẠI") {
      labels = [`${date.getDate()}/${date.getMonth() + 1}`];
      data = [20]; // Áp cứng dữ liệu cho ngày hiện tại (20 triệu)
    } else if (tab === "THÁNG") {
      labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]; // Các tháng
      data = [50, 100, 150, 200, 250, 500, 700, 800, 900, 1000, 1100, 5000]; // Dữ liệu cố định theo từng tháng
    } else if (tab === "NĂM") {
      labels = [
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
      ]; // 10 năm gần nhất
      data = [500, 1000, 2000, 3000, 4000, 3500, 3000, 2500, 1500, 1000]; // Dữ liệu cố định theo từng năm
    }

    datasets = [
      {
        data: data,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Màu đỏ cho dữ liệu
        strokeWidth: 2, // Độ dày của đường biểu đồ
      },
    ];

    setChartData({ labels, datasets });
  };

  // Gọi hàm lấy dữ liệu khi người dùng chọn tab hoặc thay đổi ngày tháng
  useEffect(() => {
    fetchChartData(selectedTab, selectedDate);
  }, [selectedTab, selectedDate]);

  // Hàm để hiển thị DateTimePicker
  const onShowPicker = () => {
    setShowPicker(true);
  };

  // Hàm xử lý khi chọn ngày tháng
  const onChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date); // Cập nhật ngày tháng được chọn
    }
  };

  // Hàm render nội dung biểu đồ hoặc hiển thị thông báo nếu không có dữ liệu
  const renderContent = () => {
    if (!chartData) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Chưa có dữ liệu</Text>
        </View>
      );
    }

    // Trục Y cho từng tab
    const yAxisValues =
      selectedTab === "THÁNG"
        ? ["0", "50M", "100M", "150M", "200M", "250M", "500M", "1B", "5B"]
        : selectedTab === "NĂM"
        ? ["0", "500M", "1B", "2B", "3B", "4B"]
        : [
            "0",
            "10M",
            "20M",
            "30M",
            "40M",
            "50M",
            "60M",
            "70M",
            "80M",
            "90M",
            "1B",
          ];

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartLabel}>(Đơn vị: Triệu)</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40} // Chiều rộng biểu đồ
          height={220}
          yAxisLabel=""
          yAxisSuffix="M" // Đơn vị triệu cho trục tung
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2, // Làm tròn số liệu
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
            yLabelsOffset: 10, // Đẩy nhãn trục Y ra xa một chút
          }}
          fromZero // Bắt đầu từ 0
          verticalLabelRotation={30}
          segments={yAxisValues.length - 1} // Số mốc trên trục Y
          yLabels={yAxisValues} // Các mốc cứng trên trục Y
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Thanh tiêu đề (Header) */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon
              name="arrow-back-outline"
              size={24}
              color="#fff"
              onPress={onBack}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tình hình thu chi</Text>

          {/* Nút chia sẻ */}
          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tabs lựa chọn thời gian */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              selectedTab === "HIỆN TẠI" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("HIỆN TẠI")}
          >
            <Text style={styles.tabText}>HIỆN TẠI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabItem,
              selectedTab === "THÁNG" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("THÁNG")}
          >
            <Text style={styles.tabText}>THÁNG</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, selectedTab === "NĂM" && styles.activeTab]}
            onPress={() => setSelectedTab("NĂM")}
          >
            <Text style={styles.tabText}>NĂM</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị năm/tháng/ngày cho tab HIỆN TẠI */}
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={onShowPicker}>
            <View style={styles.dateRow}>
              <Icon name="calendar-outline" size={24} color="#A9A9A9" />
              <Text style={styles.dateText}>
                {selectedTab === "NĂM"
                  ? selectedDate.getFullYear()
                  : selectedTab === "THÁNG"
                  ? `${
                      selectedDate.getMonth() + 1
                    }/${selectedDate.getFullYear()}`
                  : `${selectedDate.getDate()}/${
                      selectedDate.getMonth() + 1
                    }/${selectedDate.getFullYear()}`}
              </Text>

              {/* Nút Cài đặt ngay cạnh ngày */}
              <TouchableOpacity style={styles.settingsButton}>
                <Icon name="settings-outline" size={24} color="#A9A9A9" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Nội dung hiển thị dựa trên tab đã chọn */}
        {renderContent()}

        {/* DateTimePicker */}
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode={selectedTab === "NĂM" ? "year" : "date"}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// Định nghĩa các style cho giao diện
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  header: {
    backgroundColor: "#1E90FF",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    paddingLeft: 10,
  },
  shareButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
  },
  tabItem: {
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 16,
    color: "#fff",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FFFFFF",
  },
  chartContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  chartLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "#A9A9A9",
  },
  dateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFF",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
    marginRight: 10,
  },
});

export default IncomeExpenseReport;

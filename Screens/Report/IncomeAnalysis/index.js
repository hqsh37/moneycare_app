import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LineChart } from "react-native-chart-kit";

const IncomeAnalysis = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState("NGÀY");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Hàm xử lý khi chọn ngày bắt đầu
  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
  };

  // Hàm xử lý khi chọn ngày kết thúc
  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
  };

  // Hàm để render nội dung dựa trên tab được chọn
  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.filterSection}>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            style={styles.filterItem}
          >
            <Icon name="calendar-outline" size={24} color="#666" />
            <Text style={styles.filterText}>
              Ngày bắt đầu: {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {/* Bộ lọc ngày kết thúc */}
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            style={styles.filterItem}
          >
            <Icon name="calendar-outline" size={24} color="#666" />
            <Text style={styles.filterText}>
              Ngày kết thúc: {endDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {/* Bộ lọc hạng mục chi */}
          <View style={styles.filterItem}>
            <Icon name="fast-food-outline" size={24} color="#FFA500" />
            <Text style={styles.filterText}>Tất cả hạng mục chi</Text>
          </View>

          {/* Bộ lọc tài khoản */}
          <View style={styles.filterItem}>
            <Icon name="card-outline" size={24} color="#666" />
            <Text style={styles.filterText}>Tất cả tài khoản</Text>
          </View>
        </View>

        {/* Hiển thị DatePicker nếu cần */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}

        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: ["", "", "", "", "", ""], // Bỏ tiêu đề trục X
              datasets: [
                {
                  data: [5000, 10000, 7500, 12000, 11000, 15000],
                },
              ],
            }}
            width={Dimensions.get("window").width - 32} // Chiều rộng biểu đồ
            height={220} // Chiều cao biểu đồ
            yAxisLabel="₫" // Tiền tố cho trục Y
            yAxisSuffix="k" // Hậu tố cho trục Y
            chartConfig={{
              backgroundColor: "#f0f8ff",
              backgroundGradientFrom: "#f0f8ff", // Gradient từ màu xanh dương nhạt
              backgroundGradientTo: "#f0f8ff", // Gradient đến màu xanh dương nhạt
              decimalPlaces: 0, // Không hiển thị số thập phân
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Đường xanh dương nhạt
              labelColor: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Màu trục
              propsForDots: {
                r: "4", // Kích thước điểm
                strokeWidth: "2",
                stroke: "#007bff",
              },
            }}
            withDots={true} // Hiển thị các điểm trên biểu đồ
            withInnerLines={false} // Ẩn đường kẻ trong
            style={{
              marginTop: 20,
            }}
          />
        </View>

        {/* Thông tin tổng kết */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tổng chi tiêu</Text>
            <Text style={styles.summaryValue}>0 đ</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Trung bình chi/ngày</Text>
            <Text style={styles.summaryValue}>0 đ</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Thanh tiêu đề (Header) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phân tích chi tiêu</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-social-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs lựa chọn thời gian */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === "NGÀY" && styles.activeTab]}
          onPress={() => setSelectedTab("NGÀY")}
        >
          <Text style={styles.tabText}>NGÀY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === "THÁNG" && styles.activeTab]}
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

      {/* Render content chose */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
    width: "100%",
  },
  header: {
    backgroundColor: "#009fda",
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
    backgroundColor: "#009fda",
    paddingTop: 10,
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
    borderBottomColor: "#FFFFFF", // Đánh dấu tab đang chọn
  },
  contentContainer: {
    flex: 1,
  },
  filterSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  filterText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#666",
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: {
    fontSize: 16,
    color: "#A9A9A9",
  },
  summary: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E90FF",
  },
});

export default IncomeAnalysis;

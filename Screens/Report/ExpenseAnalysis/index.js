import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

const ExpenseAnalysis = ({ onBack }) => {
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

        {/* Biểu đồ trống */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartText}>Không có dữ liệu</Text>
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
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === "QUÝ" && styles.activeTab]}
          onPress={() => setSelectedTab("QUÝ")}
        >
          <Text style={styles.tabText}>QUÝ</Text>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
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

export default ExpenseAnalysis;

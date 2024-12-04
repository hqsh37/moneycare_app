import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LineChart } from "react-native-chart-kit";
import AccountAdd from "./AccountAdd";
import CategoryAdd from "./CategoryAdd";
import Icon from "../../../components/Icon";
import { getTransactionData } from "../../../stores/transactionStorage";

const IncomeAnalysis = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState("NGÀY");
  const [selectedOption, setSelectedOption] = useState("Thu tiền");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    name: "Tất cả hạng mục",
    icon: "pricetag-outline",
    iconLib: "Ionicons",
  });
  const [selectedAccount, setSelectedAccount] = useState({
    id: 0,
    name: "Tất cả tài khoản",
    type: "cash",
  });
  const [cash, setCash] = useState(0);
  const [dataChart, setdataChart] = useState([{ date: "", amount: 0 }]);

  // Visible toggle modal
  const [modalVisibleCate, setModalVisibleCate] = useState(false);
  const [modalVisibleAcc, setModalVisibleAcc] = useState(false);

  useEffect(() => {
    // Get the current date
    const today = new Date();

    // Get the start date of the current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get the end date of the current month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Set state for start and end dates
    setStartDate(startOfMonth);
    setEndDate(endOfMonth);
  }, []);

  useEffect(() => {
    handleLoadData();
  }, [selectedCategory, selectedAccount, startDate, endDate, selectedTab]);

  function convertToDate(dateString) {
    const [day, month, year, hours, minutes] = dateString.split(/[\s/,:]+/); // Split by space, slash, and colon
    return new Date(year, month - 1, day, hours, minutes); // months are 0-indexed
  }

  const handleLoadData = async () => {
    const data = await getTransactionData();

    let filteredData;
    let sumCash = 0;

    filteredData = data.filter((transaction) => {
      // Convert transaction date to Date object
      const date = convertToDate(transaction.date);

      const isType = transaction.type == "thu";

      // Check if the transaction is within the selected range
      const isDateInRange = date >= startDate && date <= endDate;

      // Check if the categoryId should be filtered
      const isCategoryValid =
        selectedCategory.id === 0 ||
        transaction.categoryId == selectedCategory.id;

      // Check if the accountId should be filtered
      const isAccountValid =
        selectedAccount.id === 0 || transaction.accountId == selectedAccount.id;

      // Determine if the transaction is valid based on all filters
      const isFilterValid =
        isDateInRange && isCategoryValid && isAccountValid && isType;

      // If the transaction passes the filters, proceed with further logic
      if (isFilterValid) {
        // Add the amount to the sum and chart preparation data
        sumCash += Number(transaction.amount);
      }

      return isFilterValid;
    });

    // Update the state with the results
    setCash(sumCash);

    if (filteredData.length > 0) {
      // Convert the data
      if (selectedTab === "NGÀY") {
        const result = convertData(filteredData);
        setdataChart(result);
      } else if (selectedTab === "THÁNG") {
        const result = convertDataByMonth(filteredData);
        setdataChart(result);
      } else {
        const result = convertDataByYear(filteredData);
        setdataChart(result);
      }
    } else {
      setdataChart([{ date: "", amount: 0 }]);
    }
  };

  const convertData = (data) => {
    // Initialize an empty object to group the data by exact date
    const groupedData = {};

    data.forEach((item) => {
      // Extract the date (DD/MM/YYYY format)
      const date = item.date.split(" ")[0]; // "DD/MM/YYYY"

      // Initialize the amount for this date if it doesn't exist
      if (!groupedData[date]) {
        groupedData[date] = 0;
      }

      // Add the transaction amount to the total for this date
      groupedData[date] += Number(item.amount);
    });

    // Convert the grouped data into the desired array format [{ date, amount }]
    return Object.keys(groupedData).map((date) => ({
      date: "",
      amount: groupedData[date],
    }));
  };

  // Function to convert the data into the desired format grouped by month
  const convertDataByMonth = (data) => {
    // Initialize an empty object to group the data by month
    const groupedData = {};

    data.forEach((item) => {
      // Extract the month and year from the date (MM/YYYY format)
      const date = item.date.split(" ")[0]; // "DD/MM/YYYY"
      const [day, month, year] = date.split("/"); // Split the date into day, month, and year
      const monthYear = `${month}/${year}`; // Combine month and year into a "MM/YYYY" format

      // Initialize the amount for this monthYear if it doesn't exist
      if (!groupedData[monthYear]) {
        groupedData[monthYear] = 0;
      }

      // Add the transaction amount to the total for this month
      groupedData[monthYear] += Number(item.amount);
    });

    // Convert the grouped data into the desired array format [{ date, amount }]
    return Object.keys(groupedData).map((monthYear) => ({
      date: monthYear.slice(0, 2),
      amount: groupedData[monthYear],
    }));
  };

  // Function to convert the data into the desired format grouped by year
  const convertDataByYear = (data) => {
    // Initialize an empty object to group the data by year
    const groupedData = {};

    data.forEach((item) => {
      // Extract the year from the date (YYYY format)
      const date = item.date.split(" ")[0]; // "DD/MM/YYYY"
      const [day, month, year] = date.split("/"); // Split the date into day, month, and year
      const yearOnly = year; // Extract the year part

      // Initialize the amount for this year if it doesn't exist
      if (!groupedData[yearOnly]) {
        groupedData[yearOnly] = 0;
      }

      // Add the transaction amount to the total for this year
      groupedData[yearOnly] += Number(item.amount);
    });

    // Convert the grouped data into the desired array format [{ date, amount }]
    return Object.keys(groupedData).map((yearOnly) => ({
      date: yearOnly,
      amount: groupedData[yearOnly],
    }));
  };

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

  // func handle categories
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // func handle account
  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
            <Icon
              iconLib="Ionicons"
              icon="calendar-outline"
              size={24}
              color="#666"
            />
            <Text style={styles.filterText}>
              Ngày bắt đầu: {startDate.toLocaleDateString("en-GB")}
            </Text>
          </TouchableOpacity>

          {/* Bộ lọc ngày kết thúc */}
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            style={styles.filterItem}
          >
            <Icon
              iconLib="Ionicons"
              icon="calendar-outline"
              size={24}
              color="#666"
            />
            <Text style={styles.filterText}>
              Ngày kết thúc: {endDate.toLocaleDateString("en-GB")}
            </Text>
          </TouchableOpacity>

          {/* Tài khoản */}
          <TouchableOpacity
            style={styles.transactionRow}
            onPress={() => setModalVisibleAcc(true)}
          >
            {selectedAccount.type === "cash" ? (
              <Icon
                iconLib="Ionicons"
                icon="cash-outline"
                size={24}
                color="#333"
                style={styles.transactionIcon}
              />
            ) : (
              <Icon
                iconLib="FontAwesome"
                icon="bank"
                size={24}
                color="#333"
                style={styles.transactionIcon}
              />
            )}
            <View style={styles.transactionContent}>
              <Text style={styles.transactionLabel}>
                {selectedAccount.name}
              </Text>

              <Icon
                iconLib="Ionicons"
                icon="chevron-forward"
                size={20}
                color="#aaa"
              />
            </View>
          </TouchableOpacity>

          <View style={styles.transactionDivider} />

          {/* Hạng mục */}
          <TouchableOpacity
            style={styles.transactionRow}
            onPress={() => setModalVisibleCate(true)}
          >
            <Icon
              iconLib={selectedCategory.iconLib}
              icon={selectedCategory.icon}
              size={24}
              color="#333"
              style={styles.transactionIcon}
            />
            <View style={styles.transactionContent}>
              <Text style={styles.transactionLabel}>
                {selectedCategory.name}
              </Text>
              <Icon
                iconLib="Ionicons"
                icon="chevron-forward"
                size={20}
                color="#aaa"
              />
            </View>
          </TouchableOpacity>
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
              labels: dataChart.map((i) => i.date), // Bỏ tiêu đề trục X
              datasets: [
                {
                  data: dataChart.map((i) => i.amount),
                },
              ],
            }}
            width={Dimensions.get("window").width - 32} // Chiều rộng biểu đồ
            height={220} // Chiều cao biểu đồ
            yAxisLabel="₫" // Tiền tố cho trục Y
            yAxisSuffix="k" // Hậu tố cho trục Y
            chartConfig={{
              backgroundColor: "#f0f8ff",
              backgroundGradientFrom: "#f0f8ff",
              backgroundGradientTo: "#f0f8ff",
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
            <Text style={styles.summaryValue}>
              {formatCurrencyVND(cash + "")}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Trung bình chi/ngày</Text>
            <Text style={styles.summaryValue}>
              {formatCurrencyVND(cash / +dataChart.length + "")}
            </Text>
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
          <Icon
            iconLib="Ionicons"
            icon="arrow-back-outline"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phân tích thu</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon
            iconLib="Ionicons"
            icon="share-social-outline"
            size={24}
            color="#fff"
          />
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

      {/* Modal Accounts */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleAcc}
        onRequestClose={() => setModalVisibleAcc(false)}
      >
        <AccountAdd
          onBack={() => {
            setModalVisibleAcc(false);
          }}
          selectedAccount={selectedAccount}
          handleAccountSelect={handleAccountSelect}
        />
      </Modal>

      {/* Modal Category */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleCate}
        onRequestClose={() => setModalVisibleCate(false)}
      >
        <CategoryAdd
          onBack={() => {
            setModalVisibleCate(false);
          }}
          type={selectedOption}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
        />
      </Modal>
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
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  transactionIcon: { width: 30, textAlign: "center", marginRight: 8 },
  transactionContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionLabel: { fontSize: 16, color: "#333" },
  transactionValue: { fontSize: 16, color: "#333" },
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

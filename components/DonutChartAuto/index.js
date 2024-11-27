import React from "react";
import { View, StyleSheet, Dimensions, Text, FlatList } from "react-native";
import PieChart from "react-native-pie-chart";

const generateTrendyColors = (count) => {
  const predefinedChartColors = [
    "#4CAF50",
    "#FF5722",
    "#2196F3",
    "#FFC107",
    "#9C27B0",
    "#E91E63",
    "#00BCD4",
    "#8BC34A",
    "#FF9800",
    "#607D8B",
  ];

  const trendyColors = [];
  for (let i = 0; i < count; i++) {
    if (i < predefinedChartColors.length) {
      // Sử dụng màu định sẵn trước
      trendyColors.push(predefinedChartColors[i]);
    } else {
      // Sau đó thêm màu ngẫu nhiên
      const hue = Math.floor(Math.random() * 360);
      const saturation = 40 + Math.floor(Math.random() * 30);
      const lightness = 60 + Math.floor(Math.random() * 20);
      trendyColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
  }
  return trendyColors;
};

const DonutChartAuto = ({ data }) => {
  // Tổng giá trị
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Tự động tạo màu sắc
  const sliceColors = generateTrendyColors(data.length);

  // Tạo mảng dữ liệu biểu đồ
  const series = data.map((item) => item.value);

  return (
    <View style={styles.container}>
      <PieChart
        widthAndHeight={Dimensions.get("window").width / 2 - 20} // Kích thước biểu đồ
        series={series} // Dữ liệu giá trị
        sliceColor={sliceColors} // Màu tự động
        doughnut={true} // Tạo Donut
        coverRadius={0.6} // Tỷ lệ lỗ giữa
        coverFill={"#fff"}
      />
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.legendItem}>
            <View
              style={[styles.colorBox, { backgroundColor: sliceColors[index] }]}
            />
            <Text style={styles.legendText}>
              {item.label} ({((item.value / total) * 100).toFixed(2)}%)
            </Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

// Dữ liệu mẫu
const sampleData = [{ label: "Trống", value: 1 }];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff", // Nền sáng hơn
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333", // Màu chữ tối hơn
  },
  legendItem: {
    width: Dimensions.get("window").width / 2 - 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 8,
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 4, // Bo góc ô màu
  },
  legendText: {
    fontSize: 14,
    color: "#555", // Màu chữ dịu nhẹ hơn
  },
});

export default ({ data = sampleData }) => <DonutChartAuto data={data} />;

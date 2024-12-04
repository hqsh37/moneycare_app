import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Sitemap = ({ onBack = () => {} }) => {
  const [activeIndex, setActiveIndex] = useState(null); // To track active accordion section

  const data = [
    {
      title: "Trang chủ",
      children: [{ title: "Giao diện trang chủ" }],
    },
    {
      title: "Tài khoản",
      children: [
        { title: "Thêm tài khoản" },
        { title: "Sửa tài khoản" },
        { title: "Xóa tài khoản" },
        { title: "Thêm sổ tiết kiệm" },
        { title: "Sửa sổ tiết kiệm" },
        { title: "Xóa sổ tiết kiệm" },
      ],
    },
    {
      title: "Báo cáo",
      children: [
        { title: "Báo cáo tài chính" },
        { title: "Tình hình thu chi" },
        { title: "Phân tích chi tiêu" },
        { title: "Phân tích thu" },
        { title: "Quản lý hạng mục" },
        { title: "Lập kế hoạch dự thu" },
        { title: "Lập kế hoạch dự chi" },
      ],
    },
    {
      title: "Thêm",
      children: [
        { title: "Đăng xuất" },
        { title: "Giới thiệu bạn bè" },
        { title: "Hồ sơ" },
        { title: "Cài đặt" },
      ],
    },
    {
      title: "Đăng nhập",
      children: [{ title: "Đăng ký" }, { title: "Quên Mật khẩu" }],
    },
  ];

  const handleAccordionToggle = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close if already open
    } else {
      setActiveIndex(index); // Open new section
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Site Map</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-social-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {data.map((item, index) => (
          <View key={index} style={styles.sitemapItem}>
            {/* Parent Item - Accordion Header */}
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                activeIndex === index && styles.accordionHeaderActive,
              ]}
              onPress={() => handleAccordionToggle(index)}
            >
              <Text
                style={[
                  styles.accordionText,
                  activeIndex === index && styles.accordionTextActive,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>

            {/* Child Items - Show when the accordion section is active */}
            {activeIndex === index && item.children.length > 0 && (
              <View style={styles.accordionContent}>
                {item.children.map((child, idx) => (
                  <TouchableOpacity key={idx} style={styles.childItem}>
                    <Text style={styles.childItemText}>{child.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f4f4f9", // Light background color
  },
  header: {
    backgroundColor: "#3b9fdb", // Blue header background
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd", // Slight border for separation
  },
  backButton: { paddingLeft: 10 },
  shareButton: { paddingRight: 10 },
  content: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  sitemapItem: {
    marginBottom: 20,
  },
  accordionHeader: {
    backgroundColor: "#fff", // Light background for parent item
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    shadowColor: "#000", // Slight shadow for separation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4, // Android shadow effect
  },
  accordionHeaderActive: {
    backgroundColor: "#009fda", // Active background color for accordion header
    borderColor: "#0078a0", // Darker border when active
  },
  accordionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  accordionTextActive: {
    color: "#fff", // Change text color when active
  },
  accordionContent: {
    paddingLeft: 20,
    backgroundColor: "#f8f8f8", // Slightly darker background for child items area
    borderRadius: 8,
    paddingVertical: 10,
  },
  childItem: {
    paddingVertical: 8,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: "#ffffff", // Background for child item
    borderWidth: 1,
    borderColor: "#ddd",
  },
  childItemText: {
    fontSize: 14,
    color: "#4c6ef5", // Light blue color for child items
    fontWeight: "600",
    paddingLeft: 10,
  },
  noItemsText: {
    fontSize: 14,
    color: "#999",
    paddingVertical: 5,
  },
});

export default Sitemap;

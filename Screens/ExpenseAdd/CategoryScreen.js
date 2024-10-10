import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const CategoryScreen = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("Chi tiền");
  const [selectedCategory, setSelectedCategory] = useState("Ăn uống");
  const [expandedCategory, setExpandedCategory] = useState(null); // Hạng mục cha đang mở

  // Danh sách hạng mục với biểu tượng (icon) từ FontAwesome5 hoặc Ionicons
  const categories = [
    {
      id: 1,
      name: "Ăn uống",
      icon: "hamburger",
      iconLib: "FontAwesome5",
      children: [
        { id: 31, name: "Xe máy", icon: "motorcycle", iconLib: "FontAwesome5" },
        { id: 32, name: "Taxi", icon: "taxi", iconLib: "FontAwesome5" },
      ],
    },
    {
      id: 2,
      name: "Đi chợ/siêu thị",
      icon: "shopping-cart",
      iconLib: "FontAwesome5",
      children: [
        { id: 31, name: "Xe máy", icon: "motorcycle", iconLib: "FontAwesome5" },
        { id: 32, name: "Taxi", icon: "taxi", iconLib: "FontAwesome5" },
      ],
    },
    {
      id: 3,
      name: "Đi lại",
      icon: "car",
      iconLib: "FontAwesome5",
      children: [
        { id: 31, name: "Xe máy", icon: "motorcycle", iconLib: "FontAwesome5" },
        { id: 32, name: "Taxi", icon: "taxi", iconLib: "FontAwesome5" },
      ],
    },
  ];

  // Chuyển tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Chọn hạng mục
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Mở rộng hạng mục cha khi nhấn vào mũi tên
  const handleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const renderCategoryItem = ({ item }) => {
    const isSelected = selectedCategory === item.name;

    // Kiểm tra nếu có hạng mục con
    if (item.children && item.children.length > 0) {
      return (
        <View>
          {/* Hạng mục cha */}
          <View style={styles.categoryItem}>
            {/* Mũi tên bên trái */}
            <TouchableOpacity onPress={() => handleExpandCategory(item.id)}>
              <Ionicons
                name={
                  expandedCategory === item.id ? "chevron-up" : "chevron-down"
                }
                size={20}
                color="gray"
                style={styles.iconArrow}
              />
            </TouchableOpacity>

            {/* Biểu tượng hạng mục cha */}
            <FontAwesome5
              name={item.icon}
              size={24}
              color="#FFA500"
              style={styles.icon}
            />

            {/* Tên hạng mục cha */}
            <TouchableOpacity
              style={styles.categoryTextContainer}
              onPress={() => handleCategorySelect(item.name)}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
              {isSelected && (
                <Ionicons name="checkmark" size={20} color="blue" />
              )}
            </TouchableOpacity>
          </View>

          {/* Hạng mục con */}
          {expandedCategory === item.id &&
            item.children.map((child) => (
              <TouchableOpacity
                key={child.id}
                style={styles.childCategoryItem}
                onPress={() => handleCategorySelect(child.name)}
              >
                <FontAwesome5
                  name={child.icon}
                  size={20}
                  color="gray"
                  style={styles.icon}
                />
                <Text style={styles.categoryText}>{child.name}</Text>
              </TouchableOpacity>
            ))}
        </View>
      );
    }

    // Hạng mục không có mục con
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => handleCategorySelect(item.name)}
      >
        <FontAwesome5
          name={item.icon}
          size={24}
          color="#FFA500"
          style={styles.icon}
        />
        <Text style={styles.categoryText}>{item.name}</Text>
        {isSelected && <Ionicons name="checkmark" size={20} color="blue" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#fff" onPress={onBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý hạng mục</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === "Chi tiền" && styles.activeTab]}
          onPress={() => handleTabChange("Chi tiền")}
        >
          <Text style={styles.tabText}>Chi tiền</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === "Thu tiền" && styles.activeTab]}
          onPress={() => handleTabChange("Thu tiền")}
        >
          <Text style={styles.tabText}>Thu tiền</Text>
        </TouchableOpacity>
      </View>

      {/* Tìm kiếm */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm theo tên hạng mục"
      />

      {/* Danh sách hạng mục */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#00aaff",
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#00aaff",
  },
  tabText: {
    fontSize: 16,
    color: "#000",
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    margin: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingLeft: 10,
  },
  childCategoryItem: {
    paddingLeft: 45,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  iconArrow: {
    marginRight: 15,
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  categoryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
  },
});

export default CategoryScreen;

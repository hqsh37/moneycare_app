import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import Icon from "../../components/Icon";
import { renderCategoryItem } from "../../components/categoryRender";
import { categorySpend, categoryCollect } from "../Report/CategoryScreen/data";
import {
  getCategorySpend,
  saveCategorySpend,
} from "../../stores/categorySpend";
import {
  getCategoryCollect,
  saveCategoryCollect,
} from "../../stores/categoryCollect";

const CategoryAdd = ({
  type = "Chi tiền",
  selectedCategory,
  handleCategorySelect = () => {},
  onBack,
}) => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (type == "Chi tiền") {
        const dataSpendLocal = await getCategorySpend();
        if (dataSpendLocal.length === 0) {
          console.log("Dữ liệu chi tiêu chưa có, lưu dữ liệu mẫu");
          await saveCategorySpend(categorySpend);
          setCategories(categorySpend);
        } else {
          setCategories(dataSpendLocal);
        }
      } else {
        const dataCollectLocal = await getCategoryCollect();
        if (dataCollectLocal.length === 0) {
          console.log("Dữ liệu thu nhập chưa có, lưu dữ liệu mẫu");
          await saveCategoryCollect(categoryCollect);
          setCategories(categoryCollect);
        } else {
          setCategories(dataCollectLocal);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [type, refresh]);

  const handleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const onRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm hạng mục</Text>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="check" iconLib="AntDesign" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm theo tên hạng mục"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={categories}
        renderItem={({ item }) =>
          renderCategoryItem({
            item,
            selectedCategory,
            expandedCategory,
            handleExpandCategory,
            handleCategorySelect,
          })
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#00aaff",
  },
  headerTitle: { fontSize: 18, color: "#fff" },
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
  icon: { marginRight: 15 },
  categoryText: { fontSize: 16 },
});

export default CategoryAdd;

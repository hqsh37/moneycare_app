import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  RefreshControl,
} from "react-native";

import { useDebounce } from "../../../hooks";
import Icon from "../../../components/Icon";
import UpdateCategory from "./UpdateCategory";
import { renderCategoryItem } from "../../../components/categoryRender";
import CreateCategory from "./CreateCategory";
import {
  getCategorySpend,
  saveCategorySpend,
} from "../../../stores/categorySpend";
import {
  getCategoryCollect,
  saveCategoryCollect,
} from "../../../stores/categoryCollect";
import { categorySpend, categoryCollect } from "./data";
import Loading from "../../../components/Loading";
import Toast from "react-native-toast-message";
import { asyncDataCloud } from "../../../handlers/dataAsyncHandle";
import { checkNetworkStatus } from "../../../services/asyncDataCloud";

const CategoryScreen = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState({
    id: 1,
    name: "Chi tiền",
    type: "chi",
  });
  const [selectedCategory, setSelectedCategory] = useState({
    id: 1,
    name: "Ăn uống",
    icon: "hamburger",
    iconLib: "FontAwesome5",
  });
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoriesThu, setCategoriesThu] = useState([]);
  const [categoriesChi, setCategoriesChi] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      await asyncData();
      // Tải dữ liệu chi tiêu (Spend)
      const dataSpendLocal = await getCategorySpend();
      if (dataSpendLocal.length === 0) {
        console.log("Dữ liệu chi tiêu chưa có, lưu dữ liệu mẫu");
        await saveCategorySpend(categorySpend);

        // lấy dữ liệu nếu không có(cần sử lý)
        setCategoriesChi(categorySpend);
      } else {
        setCategoriesChi(dataSpendLocal);
      }

      // Tải dữ liệu thu nhập (Collect)
      const dataCollectLocal = await getCategoryCollect();
      if (dataCollectLocal.length === 0) {
        console.log("Dữ liệu thu nhập chưa có, lưu dữ liệu mẫu");
        await saveCategoryCollect(categoryCollect);

        // lấy dữ liệu nếu không có(cần sử lý)
        setCategoriesThu(categoryCollect);
      } else {
        setCategoriesThu(dataCollectLocal);
      }
      handleSetCategotyForTab();
      setIsLoading(false);
    };
    loadData();
  }, [refresh]);

  useEffect(() => {
    handleSetCategotyForTab();
  }, [activeTab]);

  const handleSetCategotyForTab = () => {
    if (activeTab.name === "Chi tiền") {
      setCategories(categoriesChi);
      setOriginalCategories(flattenCategories(categoriesChi));
    } else {
      setCategories(categoriesThu);
      setOriginalCategories(flattenCategories(categoriesThu));
    }
  };

  const flattenCategories = (categories) => {
    const flattened = [];
    categories.forEach((category) => {
      flattened.push({
        id: category.id,
        name: category.name,
        icon: category.icon,
        iconLib: category.iconLib,
      });
      if (category.children) {
        category.children.forEach((child) => {
          flattened.push({
            id: child.id,
            name: child.name,
            icon: child.icon,
            iconLib: child.iconLib,
          });
        });
      }
    });
    return flattened;
  };

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  useEffect(() => {
    if (!search) {
      setCategories(
        activeTab.name === "Chi tiền" ? categoriesChi : categoriesThu
      );
      return;
    }
    const filteredCategories = originalCategories.filter((category) => {
      const categoryNameNoTones = removeVietnameseTones(
        category.name.toLowerCase()
      );
      const searchNoTones = removeVietnameseTones(debouncedValue.toLowerCase());
      return categoryNameNoTones.includes(searchNoTones);
    });
    setCategories(filteredCategories);
  }, [debouncedValue, originalCategories]);

  const handleTabChange = (tabName) => {
    const tabInfo =
      tabName === "Chi tiền"
        ? { id: 1, name: "Chi tiền", type: "chi" }
        : { id: 2, name: "Thu tiền", type: "thu" };
    setActiveTab(tabInfo);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const onRefresh = () => {
    setRefresh(!refresh);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý hạng mục</Text>
        <TouchableOpacity>
          <Icon
            icon="edit"
            iconLib="AntDesign"
            size={24}
            color="#fff"
            onPress={() => {
              setModalVisibleUpdate(true);
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab.name === "Chi tiền" && styles.activeTab,
          ]}
          onPress={() => handleTabChange("Chi tiền")}
        >
          <Text style={styles.tabText}>Chi tiền</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab.name === "Thu tiền" && styles.activeTab,
          ]}
          onPress={() => handleTabChange("Thu tiền")}
        >
          <Text style={styles.tabText}>Thu tiền</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm theo tên hạng mục"
        value={search}
        onChangeText={setSearch}
      />

      {isLoading ? (
        <Loading />
      ) : (
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
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisibleCreate(true)}
      >
        <Icon iconLib={"Ionicons"} icon="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal update */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleUpdate}
        onRequestClose={() => setModalVisibleUpdate(false)}
      >
        <UpdateCategory
          title={
            activeTab.name === "Chi tiền"
              ? "Sửa hạng mục chi"
              : "Sửa hạng mục thu"
          }
          item={selectedCategory}
          onBack={() => {
            setModalVisibleUpdate(false);
          }}
          onSuccess={() => {
            setModalVisibleUpdate(false);
            setRefresh(!refresh);
            Toast.show({
              type: "success",
              text1: "Sửa hạng mục thành công!",
            });
          }}
          onDelSuccess={() => {
            setModalVisibleUpdate(false);
            setRefresh(!refresh);
            Toast.show({
              type: "success",
              text1: "Xoá hạng mục thành công!",
            });
          }}
          isParent={selectedCategory?.children ? false : true}
          tab={activeTab.type}
        />
      </Modal>
      {/* Modal create */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleCreate}
        onRequestClose={() => setModalVisibleCreate(false)}
      >
        <CreateCategory
          title="Thêm hạng mục"
          onBack={() => {
            setModalVisibleCreate(false);
          }}
          onSuccess={() => {
            setModalVisibleCreate(false);
            setRefresh(!refresh);
            Toast.show({
              type: "success",
              text1: "Thêm hạng mục thành công!",
            });
          }}
          tab={activeTab.type}
        />
      </Modal>

      <Toast />
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
    backgroundColor: "#009fda",
  },
  headerTitle: { fontSize: 18, color: "#fff" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  tabItem: { paddingVertical: 10, paddingHorizontal: 20 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#00aaff" },
  tabText: { fontSize: 16, color: "#000" },
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
    paddingRight: 15,
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
  icon: { marginRight: 15 },
  categoryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryText: { flex: 1, fontSize: 16 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#009fda",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CategoryScreen;

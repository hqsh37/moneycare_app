import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import Icon from "../../../components/Icon";
import CategoryParent from "./CategoryParent";
import IconSelector from "./IconSelector";
import {
  getCategorySpend,
  saveCategorySpend,
} from "../../../stores/categorySpend";
import {
  getCategoryCollect,
  saveCategoryCollect,
} from "../../../stores/categoryCollect";
import { iconList } from "./data";
import Toast from "react-native-toast-message";
import { addHandleAsyncData } from "../../../services/asyncData";
import ConfirmationModal from "../../../components/ConfirmationModal";

function UpdateCategory({
  title,
  item,
  tab = "chi",
  isParent = false,
  onBack = false,
  onSuccess = false,
  onDelSuccess = false,
}) {
  const [categoryName, setCategoryName] = useState(item.name);
  const [categoryIcon, setCategoryIcon] = useState({
    icon: item.icon,
    iconLib: item.iconLib,
  });
  const [categoryParent, setCategoryParent] = useState({
    id: 0,
    name: "",
    icon: "question",
    iconLib: "AntDesign",
  });
  const [modalVisibleCategory, setModalVisibleCategory] = useState(false);
  const [modalVisibleIcon, setModalVisibleIcon] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);
  const [categoryParents, setCategoryParents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryDesc, setCategoryDesc] = useState(item.desc);
  const [action, setAtion] = useState("update");

  useEffect(() => {
    const loadData = async () => {
      if (tab === "chi") {
        // Tải dữ liệu chi tiêu (Spend)
        const dataSpendLocal = await getCategorySpend();
        if (dataSpendLocal.length !== 0) {
          setCategoryParents(flattenCategoryParent(dataSpendLocal));
          setCategories(dataSpendLocal);
          setCategoryParent(findParentCategory(item, dataSpendLocal));
        }
      } else if (tab === "thu") {
        // Tải dữ liệu thu nhập (Collect)
        const dataCollectLocal = await getCategoryCollect();
        if (dataCollectLocal.length !== 0) {
          setCategoryParents(flattenCategoryParent(dataCollectLocal));
          setCategories(dataCollectLocal);
          setCategoryParent(findParentCategory(item, dataCollectLocal));
        }
      }
    };

    loadData();
  }, [tab, item]); // Thêm phụ thuộc `tab` và `item`

  console.log(item);

  const findParentCategory = (item, categories) => {
    for (let category of categories) {
      if (category?.children) {
        const childCategory = category.children.find(
          (child) => child.id === item.id
        );
        if (childCategory) {
          return category; // Trả về category cha nếu tìm thấy item trong children
        }
      }
    }
    return {
      id: 0,
      name: "",
      icon: "question",
      iconLib: "AntDesign",
    };
  };

  const handleCategorySelect = (category) => {
    setCategoryParent(category);
  };

  const handleIconSelect = (selectedIcon) => {
    setCategoryIcon(selectedIcon);
  };

  const flattenCategoryParent = (categories) => {
    const flattened = [];
    categories.forEach((category) => {
      flattened.push({
        id: category.id,
        name: category.name,
        icon: category.icon,
        iconLib: category.iconLib,
      });
    });
    return flattened;
  };

  const handleUpdateCategory = (categories, parentId, newChild) => {
    const categoryNew = categories || [];

    for (let category of categoryNew) {
      if (category.id === parentId) {
        if (category.children) {
          const childIndex = category.children.findIndex(
            (child) => child.id === newChild.id
          );

          if (childIndex !== -1) {
            category.children[childIndex] = {
              ...category.children[childIndex],
              ...newChild,
            };
          } else {
            category.children.push(newChild);
          }
        } else {
          category.children = [newChild];
        }
      }
    }

    return categoryNew;
  };

  const handleUpdateCategoryParent = (categories, category) => {
    return categories.map((cat) => {
      if (cat.id === category.id) {
        return {
          ...cat,
          name: category.name || cat.name,
          icon: category.icon || cat.icon,
          iconLib: category.iconLib || cat.iconLib,
          desc: category.desc || cat.desc,
        };
      }
      return cat;
    });
  };

  const handleDelCategoryParent = (categories, category) => {
    return categories.filter((cat) => cat.id !== category.id);
  };

  const handleStorageData = async (data) => {
    try {
      // Kiểm tra và lưu chi tiêu
      if (tab === "chi") {
        await saveCategorySpend(data);
      }

      // Kiểm tra và lưu thu nhập
      if (tab === "thu") {
        await saveCategoryCollect(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleStorageDataDel = async (data) => {
    try {
      // Kiểm tra và lưu chi tiêu
      if (tab === "chi") {
        await saveCategorySpend(data);
      }

      // Kiểm tra và lưu thu nhập
      if (tab === "thu") {
        await saveCategoryCollect(data);
      }
      onDelSuccess();
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleAsyncData = async ({ type, tbl, id, data }) => {
    try {
      addHandleAsyncData({ type, tbl, id, data });
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleDelCategory = (categories = [], parentId, childcate) => {
    return categories.map((category) => {
      if (category.id === parentId && category.children) {
        category.children = category.children.filter(
          (cat) => cat.id !== childcate.id
        );
      }
      return category;
    });
  };

  console.log(item);

  // Hàm xử lý lưu danh mục
  const handleSave = () => {
    const categoryPrepare = {
      id: item.id,
      name: categoryName,
      ...categoryIcon,
    };

    if (item?.ReplaceId) {
      categoryPrepare.ReplaceId = item.id;
      categoryPrepare.id = item.ReplaceId;
    }

    console.log(categoryPrepare);

    if (categoryDesc) {
      categoryPrepare.desc = categoryDesc;
    }

    console.log(categoryPrepare);

    if (categoryName === "") {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập tên hạng mục",
      });
      return;
    }
    if (categoryParent.id === 0) {
      handleAsyncData({
        type: "update",
        tbl: "category",
        id: categoryPrepare.id,
        data: {
          ...categoryPrepare,
          type: tab,
          categoryParentId: 0,
        },
      });
      handleStorageData(
        handleUpdateCategoryParent(categories, categoryPrepare)
      );
    } else {
      // Nếu có cha, thêm vào danh mục cha và lưu lại
      addHandleAsyncData({
        type: "update",
        tbl: "category",
        id: categoryPrepare.id,
        data: {
          ...categoryPrepare,
          type: tab,
          categoryParentId: categoryParent.id,
        },
      });
      handleStorageData(
        handleUpdateCategory(categories, categoryParent.id, categoryPrepare)
      );
    }
  };

  const handleRemoveConfirm = () => {
    const categoryPrepare = {
      id: item.id,
      name: categoryName,
      ...categoryIcon,
    };

    // if (item?.ReplaceId) {
    //   categoryPrepare.ReplaceId = item.ReplaceId;
    // }

    if (categoryParent.id === 0) {
      handleAsyncData({
        type: "delete",
        tbl: "category",
        id: item.id,
      });
      handleStorageDataDel(
        handleDelCategoryParent(categories, categoryPrepare)
      );
    } else {
      // Nếu có cha, thêm vào danh mục cha và lưu lại
      addHandleAsyncData({
        type: "delete",
        tbl: "category",
        id: item.id,
      });
      handleStorageDataDel(
        handleDelCategory(categories, categoryParent.id, categoryPrepare)
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={() => handleSave()}>
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chọn icon */}
      <View style={styles.mainContent}>
        <View style={styles.iconSection}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setModalVisibleIcon(true)}
          >
            <Icon
              icon={categoryIcon.icon}
              iconLib={categoryIcon.iconLib}
              size={40}
              color="#FFA500"
            />
            <Text style={styles.iconLabel}>Chọn icon</Text>
          </TouchableOpacity>
          <View style={styles.iconText}>
            <TextInput
              style={styles.input}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Nhập tên hạng mục"
            />
          </View>
        </View>

        {/* Chọn hạng mục cha */}
        {isParent ? (
          <TouchableOpacity
            style={styles.iconSection}
            onPress={() => setModalVisibleCategory(true)}
          >
            <View style={styles.iconContainer}>
              <Icon
                icon={categoryParent.icon}
                iconLib={categoryParent.iconLib}
                size={40}
                color="#FFA500"
              />
            </View>
            <View style={styles.iconText}>
              <Text style={styles.iconLabel}>Chọn hạng mục cha</Text>
              <Text style={styles.txthangmuc}>{categoryParent.name}</Text>
            </View>
            <Icon icon="right" iconLib="AntDesign" size={25} color="#ccc" />
          </TouchableOpacity>
        ) : (
          <></>
        )}

        {/* Diễn giải */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diễn giải</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập diễn giải"
            value={categoryDesc}
            onChangeText={setCategoryDesc}
          />
        </View>

        {/* Nút hành động */}
        <View style={styles.actionButtons}>
          {isParent ? (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setModalVisibleRemove(true)}
            >
              <Icon iconLib="Ionicons" icon="trash" size={24} color="red" />
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSave()}
          >
            <Icon iconLib="Ionicons" icon="save" size={24} color="#fff" />
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Modal category */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleCategory}
        onRequestClose={() => setModalVisibleCategory(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setModalVisibleCategory(false)}>
              <Icon
                icon="arrow-back"
                iconLib="Ionicons"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thêm hạng mục cha</Text>
            <TouchableOpacity>
              <Icon
                icon="checkmark"
                iconLib="Ionicons"
                size={24}
                color="#fff"
                onPress={() => {
                  setModalVisibleCategory(false);
                }}
              />
            </TouchableOpacity>
          </View>
          <CategoryParent
            items={[
              {
                id: 0,
                name: "Hạng mục cha",
                icon: "question",
                iconLib: "AntDesign",
              },
              ...categoryParents,
            ]}
            selectedCategory={categoryParent}
            handleCategorySelect={handleCategorySelect}
          />
        </View>
      </Modal>
      {/* Modal icon */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleIcon}
        onRequestClose={() => setModalVisibleIcon(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setModalVisibleIcon(false)}>
              <Icon
                icon="arrow-back"
                iconLib="Ionicons"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thêm hạng mục</Text>
            <TouchableOpacity>
              <Icon
                icon="checkmark"
                iconLib="Ionicons"
                size={24}
                color="#fff"
                onPress={() => setModalVisibleIcon(false)}
              />
            </TouchableOpacity>
          </View>
          <IconSelector iconList={iconList} onIconSelect={handleIconSelect} />
        </View>
      </Modal>
      {/* Modal Remove */}
      <ConfirmationModal
        isVisible={modalVisibleRemove}
        toggleModal={() => {
          setModalVisibleRemove(false);
        }}
        onConfirm={() => {
          handleRemoveConfirm();
        }}
      />

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00aaff",
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
  },
  mainContent: {
    paddingHorizontal: 15,
  },
  iconSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
  },
  iconLabel: {
    color: "gray",
    fontSize: 12,
  },
  iconText: {
    flex: 1,
  },
  inputGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 0.45,
    justifyContent: "center",
  },
  deleteText: {
    color: "red",
    marginLeft: 5,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00aaff",
    borderRadius: 5,
    padding: 10,
    flex: 0.45,
    justifyContent: "center",
  },
  saveText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
});

export default UpdateCategory;

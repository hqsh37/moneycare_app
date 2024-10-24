import { storeData, getData, removeData } from "../utils/storage";

const FILE_NAME = "category_spend_data";
const FILE_NAMEUPDATE = "category_spend_dataupdate";

// Lưu danh mục chi tiêu
export const saveCategorySpend = async (categories) => {
  try {
    await storeData(FILE_NAME, { categories });
    console.log("Category spend data saved successfully.");
  } catch (error) {
    console.error("Error saving category spend data:", error);
  }
};

// Đọc danh mục chi tiêu (trả về mảng rỗng nếu không có dữ liệu)
export const getCategorySpend = async () => {
  try {
    const data = await getData(FILE_NAME);
    // Nếu không có dữ liệu, trả về mảng rỗng
    return data?.categories || [];
  } catch (error) {
    console.error("Error getting category spend data:", error);
    return [];
  }
};

// Cập nhật danh mục chi tiêu
export const updateCategorySpend = async (newData) => {
  try {
    await storeData(FILE_NAME, newData);
    console.log("Category spend data updated successfully.");
  } catch (error) {
    console.error("Error updating category spend data:", error);
  }
};

// Xóa file danh mục chi tiêu
export const deleteCategorySpend = async () => {
  try {
    await removeData(FILE_NAME);
    console.log("Category spend data deleted successfully.");
  } catch (error) {
    console.error("Error deleting category spend data:", error);
  }
};

// Lấy một danh mục theo id (trả về null nếu không tìm thấy)
export const getCategorySpendById = async (id) => {
  try {
    const data = await getData(FILE_NAME);
    const categories = data?.categories || [];

    const findCategory = (categories, id) => {
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.children) {
          const child = findCategory(category.children, id);
          if (child) return child;
        }
      }
      return null;
    };

    return findCategory(categories, id);
  } catch (error) {
    console.error("Error getting category by ID:", error);
    return null;
  }
};

import { storeData, getData, removeData } from "../utils/storage";

const FILE_NAME = "category_collect_data";

// Lưu toàn bộ danh mục với children
export const saveCategoryCollect = async (categories) => {
  await storeData(FILE_NAME, { categories });
};

// Đọc danh mục (trả về mảng rỗng nếu không có dữ liệu)
export const getCategoryCollect = async () => {
  const data = await getData(FILE_NAME);
  // Nếu chưa có dữ liệu, trả về mảng rỗng
  return data?.categories || [];
};

// Cập nhật danh mục
export const updateCategoryCollect = async (newData) => {
  await storeData(FILE_NAME, newData);
};

// Xóa file danh mục
export const deleteCategoryCollect = async () => {
  await removeData(FILE_NAME);
};

// Lấy một danh mục theo id (trả về null nếu không tìm thấy)
export const getCategoryCollectById = async (id) => {
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
};

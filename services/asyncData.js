import AsyncStorage from "@react-native-async-storage/async-storage";

// Key lưu dữ liệu hành động trong AsyncStorage
const ACTIONS_KEY = "ASYNC_DATA_ACTIONS";

// Hàm lưu dữ liệu vào AsyncStorage
const saveDataAsync = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log("Dữ liệu đã được lưu");
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
  }
};

// Hàm đọc dữ liệu từ AsyncStorage
const readDataAsync = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  }
};

// Kiểm tra nếu ID là số
const isNumeric = (value) => {
  return !isNaN(value);
};

export const addHandleAsyncData = async ({ type, tbl, id, data }) => {
  try {
    const existingActions = (await readDataAsync(ACTIONS_KEY)) || [];

    // Nếu type là 'delete', kiểm tra điều kiện trùng id và tbl
    if (type === "delete") {
      // Xóa các hành động có id và tbl trùng với hành động hiện tại
      const filteredActions = existingActions.filter(
        (action) => !(action.id === id && action.tbl === tbl)
      );

      // Không thêm vào nếu id là dạng 'tbl_intRand'
      if (!isNumeric(id)) {
        console.log("Không thêm hành động với id không phải dạng số:", id);
        await saveDataAsync(ACTIONS_KEY, filteredActions);
        return;
      }

      // Thêm hành động 'delete' mới vào danh sách
      const newAction = {
        type,
        tbl,
        id,
        data,
      };

      const updatedActions = [...filteredActions, newAction];

      await saveDataAsync(ACTIONS_KEY, updatedActions);
      console.log("Hành động 'delete' mới đã được thêm:", newAction);
    } else {
      // Nếu không phải 'delete', thêm hành động bình thường
      const newAction = {
        type,
        tbl,
        id,
        data,
      };

      const updatedActions = [...existingActions, newAction];
      await saveDataAsync(ACTIONS_KEY, updatedActions);
      console.log("Hành động mới đã được thêm:", newAction);
    }
  } catch (error) {
    console.error("Lỗi khi thêm hành động:", error);
  }
};

// Hàm lấy toàn bộ danh sách hành động
export const getAllAsyncDataActions = async () => {
  try {
    const actions = await readDataAsync(ACTIONS_KEY);
    return actions || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hành động:", error);
  }
};

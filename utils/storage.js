import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log("Dữ liệu đã được lưu");
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
  }
};

export const getData = async (key) => {
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

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Dữ liệu đã được xóa");
  } catch (error) {
    console.error("Lỗi khi xóa dữ liệu:", error);
  }
};

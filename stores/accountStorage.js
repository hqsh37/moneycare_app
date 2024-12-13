import { storeData, getData, removeData } from "../utils/storage";

const ACCOUNT_FILE_NAME = "account_data";

// Save all account data
export const saveAccountData = async (accounts) => {
  await storeData(ACCOUNT_FILE_NAME, { accounts });
  return true;
};

// Get account data (returns an empty array if there's no data)
export const getAccountData = async () => {
  const data = await getData(ACCOUNT_FILE_NAME);
  return data?.accounts || [];
};

export const updateAccountData = async (newData) => {
  await storeData(ACCOUNT_FILE_NAME, [...getAccountData(), newData]);
  console.log("Updated account data", [...getAccountData(), newData]);
};

export const getAccountWithId = async (id) => {
  try {
    const data = await getAccountData();

    // Tìm đối tượng với id
    const result = data.find((obj) => obj.id == id);

    return result || {};
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    return 0;
  }
};

export const updateAmountById = async (id, amount, type = "plus") => {
  try {
    // Lấy dữ liệu hiện tại
    const data = await getAccountData();

    // Chuyển đổi amount về dạng số
    const numericAmount = Number(amount);

    // Tìm đối tượng theo id
    const index = data.findIndex((item) => item.id == id);

    if (index !== -1) {
      // Chuyển amount hiện tại về số
      const currentAmount = Number(data[index].amount);

      // Cập nhật amount dựa trên type
      if (type === "plus") {
        data[index].amount = (currentAmount + numericAmount).toString();
      } else if (type === "minus") {
        if (currentAmount - numericAmount <= 0) {
          return false;
        }
        data[index].amount = (currentAmount - numericAmount).toString();
      } else {
        console.error(`Invalid type: ${type}. Must be "plus" or "minus".`);
        return null;
      }

      // Lưu lại dữ liệu đã chỉnh sửa
      await saveAccountData(data);

      // Trả về đối tượng đã được cập nhật
      return data[index];
    } else {
      console.error(`Item with id: ${id} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

// Delete account data
export const deleteAccountData = async () => {
  await removeData(ACCOUNT_FILE_NAME);
};

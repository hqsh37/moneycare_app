import { storeData, getData, removeData } from "../utils/storage";

const SAVINGS_FILE_NAME = "savings_data";

// Save all savings data
export const saveSavingsData = async (savings) => {
  await storeData(SAVINGS_FILE_NAME, { savings });
  return true;
};

// Get savings data (returns an empty array if there's no data)
export const getSavingsData = async () => {
  const data = await getData(SAVINGS_FILE_NAME);
  return data?.savings || [];
};

// Update savings data
export const updateSavingsData = async (newData) => {
  await storeData(SAVINGS_FILE_NAME, newData);
};

// Delete savings data
export const deleteSavingsData = async () => {
  await removeData(SAVINGS_FILE_NAME);
};

export const isAccountInSavings = async (id) => {
  try {
    // Lấy dữ liệu savings
    const savings = await getSavingsData();

    // Kiểm tra nếu savings không phải là mảng
    if (!Array.isArray(savings)) {
      console.error("Transaction data is not an array:", savings);
      return false;
    }

    // Kiểm tra accountId có tồn tại hay không
    const exists = savings.some((saving) => saving.accountId == id);

    return exists; // Trả về true hoặc false
  } catch (error) {
    console.error("Error checking accountId in transactions:", error);
    return false;
  }
};

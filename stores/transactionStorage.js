import { storeData, getData, removeData } from "../utils/storage";

const TRANSACTION_FILE_NAME = "transaction_data";

// Save all transaction data
export const saveTransactionData = async (transactions) => {
  await storeData(TRANSACTION_FILE_NAME, { transactions });
  return true;
};

// Get transaction data (returns an empty array if there's no data)
export const getTransactionData = async () => {
  const data = await getData(TRANSACTION_FILE_NAME);
  return data?.transactions || [];
};

export const isAccountInTransactions = async (id) => {
  try {
    // Lấy dữ liệu TransactionData
    const transactionData = await getTransactionData();

    // Kiểm tra nếu transactionData không phải là mảng
    if (!Array.isArray(transactionData)) {
      console.error("Transaction data is not an array:", transactionData);
      return false;
    }

    // Kiểm tra accountId có tồn tại hay không
    const exists = transactionData.some(
      (transaction) => transaction.accountId == id
    );

    return exists; // Trả về true hoặc false
  } catch (error) {
    console.error("Error checking accountId in transactions:", error);
    return false;
  }
};

// Update transaction data
export const updateTransactionData = async (newData) => {
  await storeData(TRANSACTION_FILE_NAME, newData);
};

// Delete transaction data
export const deleteTransactionData = async () => {
  await removeData(TRANSACTION_FILE_NAME);
};

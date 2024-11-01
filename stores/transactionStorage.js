import { storeData, getData, removeData } from "../utils/storage";

const TRANSACTION_FILE_NAME = "transaction_data";

// Save all transaction data
export const saveTransactionData = async (transactions) => {
  await storeData(TRANSACTION_FILE_NAME, { transactions });
};

// Get transaction data (returns an empty array if there's no data)
export const getTransactionData = async () => {
  const data = await getData(TRANSACTION_FILE_NAME);
  return data?.transactions || [];
};

// Update transaction data
export const updateTransactionData = async (newData) => {
  await storeData(TRANSACTION_FILE_NAME, newData);
};

// Delete transaction data
export const deleteTransactionData = async () => {
  await removeData(TRANSACTION_FILE_NAME);
};

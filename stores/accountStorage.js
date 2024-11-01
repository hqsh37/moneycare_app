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

// Delete account data
export const deleteAccountData = async () => {
  await removeData(ACCOUNT_FILE_NAME);
};

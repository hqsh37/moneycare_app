import { storeData, getData, removeData } from "../utils/storage";

const ALERT_FILE_NAME = "spending_alert_data";

// Save all spending alert data
export const saveSpendingAlertData = async (alert) => {
  await storeData(ALERT_FILE_NAME, { alert });
  return true;
};

// Get spending alert data (returns an empty array if there's no data)
export const getSpendingAlertData = async () => {
  const data = await getData(ALERT_FILE_NAME);
  return data?.alert || [];
};

// Delete spending alert data
export const deleteSpendingAlertData = async () => {
  await removeData(ALERT_FILE_NAME);
};

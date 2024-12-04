import { storeData, getData, removeData } from "../utils/storage";

const REMINDER_FILE_NAME = "reminder_data";

// Save all reminder data
export const saveReminderData = async (reminder) => {
  await storeData(REMINDER_FILE_NAME, { reminder });
  return true;
};

// Get reminder data (returns an empty array if there's no data)
export const getReminderData = async () => {
  const data = await getData(REMINDER_FILE_NAME);
  return data?.reminder || [];
};

// Delete reminder data
export const deleteReminderData = async () => {
  await removeData(REMINDER_FILE_NAME);
};

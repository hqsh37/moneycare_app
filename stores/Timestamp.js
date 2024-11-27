import { storeData, getData, removeData } from "../utils/storage";

const TIMESTAMP_FILE = "sync_timestamps";

// Function to save multiple timestamps at once
export const saveTimestamps = async (timestamps) => {
  try {
    // Get current data or initialize to an empty object if none exists
    const currentData = (await getData(TIMESTAMP_FILE)) || {};

    // Merge new timestamps with existing data
    const updatedData = { ...currentData, ...timestamps };

    // Save the updated data back to storage
    await storeData(TIMESTAMP_FILE, updatedData);
    console.log("Timestamps saved successfully:", updatedData);
  } catch (error) {
    console.error("Error saving timestamps:", error);
  }
};

// Retrieve all timestamps from storage
export const getTimestamps = async () => {
  try {
    const data = (await getData(TIMESTAMP_FILE)) || {};

    return {
      categoryAt: data.categoryAt || null,
      accountAt: data.accountAt || null,
      transactionAt: data.transactionAt || null,
      savingsAt: data.savingsAt || null,
      email: data.email || null,
      firstname: data.firstname || null,
      lastname: data.lastname || null,
    };
  } catch (error) {
    console.error("Error retrieving timestamps:", error);
    return {
      categoryAt: null,
      accountAt: null,
      transactionAt: null,
      savingsAt: null,
    };
  }
};

// Delete all timestamps (optional if needed)
export const deleteTimestamps = async () => {
  try {
    await removeData(TIMESTAMP_FILE);
    console.log("All timestamps removed successfully.");
  } catch (error) {
    console.error("Error deleting timestamps:", error);
  }
};

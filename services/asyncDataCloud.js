import NetInfo from "@react-native-community/netinfo";

import api from "../utils/api";
import { saveTimestamps, getTimestamps } from "../stores/Timestamp";
import {
  convertCategoriesWithReplace,
  getListCategory,
  getListCategoryDefault,
} from "./category";
import { saveCategorySpend } from "../stores/categorySpend";
import { saveCategoryCollect } from "../stores/categoryCollect";
import { convertDataAccount, getListAccounts } from "./account";
import { saveAccountData } from "../stores/accountStorage";

export const asyncDataAction = async (actionList) => {
  try {
    // Send `actionList` directly as JSON data
    const response = await api.post(
      "/async-cloud",
      JSON.stringify(actionList),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error during async data action:", error);
    throw error;
  }
};

export const syncDataWithTimestamps = async (newTimestamps) => {
  try {
    // Step 1: Get current timestamps stored in local storage
    const storedTimestamps = await getTimestamps();

    // Step 2: Determine which timestamps have changed
    const updates = {
      categoryAt: newTimestamps.categoryAt !== storedTimestamps.categoryAt,
      accountAt: newTimestamps.accountAt !== storedTimestamps.accountAt,
      transactionAt:
        newTimestamps.transactionAt !== storedTimestamps.transactionAt,
    };

    // Step 3: Update local data based on which timestamps have changed
    if (updates.categoryAt) {
      const categoryDataDefault = await getListCategoryDefault();
      const categoryData = await getListCategory();

      const categoryConert = convertCategoriesWithReplace([
        ...categoryDataDefault,
        ...(categoryData ? categoryData : []),
      ]);

      await saveCategorySpend(categoryConert.chi);
      await saveCategoryCollect(categoryConert.thu);

      console.log("Updating category data...");
    }
    if (updates.accountAt) {
      const accounts = await getListAccounts();
      if (accounts) {
        await saveAccountData(convertDataAccount(accounts));
      }
      console.log("Updating account data...");
    }
    if (updates.transactionAt) {
      console.log("Updating transaction data...");
    }

    // Step 4: After successful updates, save the new timestamps
    await saveTimestamps(newTimestamps);
    console.log("Timestamps updated and saved successfully.");
  } catch (error) {
    console.error("Error during data synchronization:", error);
    // Optional: handle partial success cases or re-attempt synchronization
  }
};

// Check if the device is connected to the internet
export const checkNetworkStatus = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected;
  } catch (error) {
    console.error("Error checking network status:", error);
    return false;
  }
};

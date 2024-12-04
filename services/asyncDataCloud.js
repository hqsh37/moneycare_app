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
import { deleteAccountData, saveAccountData } from "../stores/accountStorage";
import { convertDataTransactions, getListTransactions } from "./transaction";
import {
  deleteTransactionData,
  saveTransactionData,
} from "../stores/transactionStorage";
import { convertDataSavings, getListSavings } from "./savings";
import { deleteSavingsData, saveSavingsData } from "../stores/savingStorage";

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
      categoryAt:
        newTimestamps.categoryAt === null ||
        newTimestamps.categoryAt !== storedTimestamps.categoryAt,
      accountAt:
        newTimestamps.accountAt === null ||
        newTimestamps.accountAt !== storedTimestamps.accountAt,
      transactionAt:
        newTimestamps.transactionAt === null ||
        newTimestamps.transactionAt !== storedTimestamps.transactionAt,
      savingsAt:
        newTimestamps.savingsAt === null ||
        newTimestamps.savingsAt !== storedTimestamps.savingsAt,
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
      } else {
        await deleteAccountData();
      }
      console.log("Updating account data...");
    }

    if (updates.transactionAt) {
      const transactions = await getListTransactions();

      if (transactions) {
        await saveTransactionData(convertDataTransactions(transactions));
      } else {
        await deleteTransactionData();
      }
      console.log("Updating transaction data...");
    }

    if (updates.savingsAt) {
      const savings = await getListSavings();

      if (savings) {
        await saveSavingsData(convertDataSavings(savings));
      } else {
        await deleteSavingsData();
      }
      console.log("Updating savings data...");
    }

    const allFalse = Object.values(updates).every((value) => value === false);

    if (!allFalse) {
      await saveTimestamps(newTimestamps);
      console.log("Timestamps updated and saved successfully.");
    }

    // Step 4: After successful updates, save the new timestamps
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

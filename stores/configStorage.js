import { storeData, getData, removeData } from "../utils/storage";

const CONFIG_FILE_NAME = "config_data";

/**
 * Save all config data.
 * @param {Object} config - The configuration object to save.
 * @returns {boolean} True if the operation is successful.
 */
export const saveConfigData = async (config) => {
  try {
    await storeData(CONFIG_FILE_NAME, { config });
    return true;
  } catch (error) {
    console.error("Error saving config data:", error);
    return false;
  }
};

/**
 * Get all config data.
 * @returns {Object} The configuration object or an empty object if none exists.
 */
export const getConfigData = async () => {
  try {
    const data = await getData(CONFIG_FILE_NAME);
    return data?.config || {};
  } catch (error) {
    console.error("Error getting config data:", error);
    return {};
  }
};

/**
 * Update existing config data with new values.
 * @param {Object} config - The new configuration values to merge.
 */
export const updateConfigData = async (config) => {
  try {
    const oldConfig = await getConfigData();
    const updatedConfig = { ...oldConfig, ...config };
    await storeData(CONFIG_FILE_NAME, { config: updatedConfig });
  } catch (error) {
    console.error("Error updating config data:", error);
  }
};

/**
 * Delete all config data.
 */
export const deleteConfigData = async () => {
  try {
    await removeData(CONFIG_FILE_NAME);
  } catch (error) {
    console.error("Error deleting config data:", error);
  }
};

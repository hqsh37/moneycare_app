import { storeData, getData, removeData } from "../utils/storage";

const PLAN_FILE_NAME = "spend_income_plan_data";

// Save all plan data
export const saveSpendIncomePlanData = async (plan) => {
  await storeData(PLAN_FILE_NAME, { plan });
  return true;
};

// Get plan data (returns an empty array if there's no data)
export const getSpendIncomePlanData = async () => {
  const data = await getData(PLAN_FILE_NAME);
  return data?.plan || [];
};

// Delete plan data
export const deleteSpendIncomePlanData = async () => {
  await removeData(PLAN_FILE_NAME);
};

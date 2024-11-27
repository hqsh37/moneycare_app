import {
  getAllAsyncDataActions,
  deleteAsyncDataActions,
} from "../services/asyncData";
import {
  asyncDataAction,
  syncDataWithTimestamps,
} from "../services/asyncDataCloud";
import { getInfo } from "../services/auth";

export const asyncDataCloud = async () => {
  const dataLocal = await getAllAsyncDataActions();

  if (dataLocal.length !== 0) {
    // Call the asyncDataAction function
    try {
      const response = await asyncDataAction(dataLocal);
      console.log("Response: ", response);

      if (response?.data && response.status) {
        const timestamps = response.data;
        deleteAsyncDataActions();

        // update data locally
        await syncDataWithTimestamps(timestamps);
      }
    } catch (error) {
      console.error("Failed to complete async data action:", error);
    }
  } else {
    const info = await getInfo();
    await syncDataWithTimestamps(info);
  }
};

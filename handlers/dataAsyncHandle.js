import {
  getAllAsyncDataActions,
  deleteAsyncDataActions,
} from "../services/asyncData";
import {
  asyncDataAction,
  syncDataWithTimestamps,
} from "../services/asyncDataCloud";
import { getInfo } from "../services/auth";
import { deleteTimestamps } from "../stores/Timestamp";

export const asyncDataCloud = async () => {
  const dataLocal = await getAllAsyncDataActions();

  if (dataLocal.length !== 0) {
    // Call the asyncDataAction function
    try {
      const info = await getInfo();
      if (info) {
        deleteAsyncDataActions();
      }

      const response = await asyncDataAction(dataLocal);
      console.log("Response: ", response);

      if (response?.data && response.status) {
        const timestamps = response.data;

        // update data locally
        await syncDataWithTimestamps(timestamps);
      } else {
        await deleteTimestamps();
      }
    } catch (error) {
      console.error("Failed to complete async data action:", error);
    }
  } else {
    const info = await getInfo();
    console.log(info);

    await syncDataWithTimestamps(info);
  }
};

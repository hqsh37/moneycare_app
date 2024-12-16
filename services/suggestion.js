import api from "../utils/api";

export const getSuggestion = async (transactions) => {
  try {
    const response = await api.post("/suggestions", {
      transactions: transactions,
    });
    if ((data = response.data?.data)) {
      return data;
    } else {
      return 0;
    }
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

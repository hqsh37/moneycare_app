import api from "../utils/api";

// Create a new feedback
export const createFeedback = async (email = "", title, content) => {
  const data = {
    email,
    title,
    content,
  };

  try {
    const response = await api.post("/feedback", data);
    if (response.data?.status === "success") {
      return true;
    } else {
      console.log("Unexpected response status:", response.status);
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log("Error data:", error.response.data);
      console.log("Status code:", error.response.status);
    } else if (error.request) {
      console.log("No response received:", error.request);
    } else {
      console.log("Error:", error.message);
    }
    return false;
  }
};

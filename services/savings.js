import api from "../utils/api";

export const getListSavings = async () => {
  try {
    const response = await api.get("/savings");
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

function convertDateFormat(dateStr) {
  // Parse the date string into a Date object
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date)) {
    throw new Error("Invalid date format. Please provide a valid date string.");
  }

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Return the date in DD/MM/YYYY format
  return `${day}/${month}/${year}`;
}

export const convertDataSavings = (array) => {
  return array.map((item) => ({
    id: item.id,
    accountId: item.id_taikhoan,
    amount: item.sodubandau,
    name: item.tenso,
    date: convertDateFormat(item.ngaygui),
    term: item.kyhan,
    interestRate: item.laisuat,
    interestType: item.loailaisuat,
    settlementAmount: item.sotientattoan,
    status: item.trangthai,
  }));
};

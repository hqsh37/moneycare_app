import api from "../utils/api";

export const getListTransactions = async () => {
  try {
    const response = await api.get("/transactions");
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
  // Chuyển đổi chuỗi thành đối tượng Date
  const date = new Date(dateStr);

  // Lấy các thành phần của ngày tháng năm và giờ phút
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Trả về chuỗi với định dạng mới
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export const convertDataTransactions = (array) => {
  return array.map((item) => ({
    id: item.id,
    amount: item.sotien || 0,
    date: convertDateFormat(item.thoigian),
    accountId: item.id_taikhoan,
    categoryId: item.id_hangmuc,
    // image: item.hinhanh || "",
    image: "",
    type: item.loaigiaodich || "chi",
    desc: item.diengiai || "",
  }));
};

import { getAccountData } from "../../stores/accountStorage";
import { getCategoryCollect } from "../../stores/categoryCollect";
import { getCategorySpend } from "../../stores/categorySpend";
import { getTransactionData } from "../../stores/transactionStorage";

export const convertDataTransaction = async () => {
  const transactions = await getTransactionData();

  const accounts = await getAccountData();

  const categorySpend = await getCategorySpend();
  const categoryCollect = await getCategoryCollect();

  const flattenCategories = (categories) => {
    const flattened = [];
    categories.forEach((category) => {
      flattened.push({
        id: category.id,
        name: category.name,
        icon: category.icon,
        iconLib: category.iconLib,
      });
      if (category.children) {
        category.children.forEach((child) => {
          flattened.push({
            id: child.id,
            name: child.name,
            icon: child.icon,
            iconLib: child.iconLib,
          });
        });
      }
    });
    return flattened;
  };

  const categoriesSpendFlatten = flattenCategories(categorySpend);
  const categoriesCollectFlatten = flattenCategories(categoryCollect);

  const categories = [...categoriesCollectFlatten, ...categoriesSpendFlatten];

  const mergeData = (transactions, accounts, categories) => {
    // Nhóm giao dịch theo ngày
    const groupedTransactions = {};

    transactions.forEach((transaction) => {
      // Lấy thông tin tài khoản và danh mục
      const account = accounts.find((acc) => acc.id === transaction.accountId);
      const category = categories.find(
        (cat) => cat.id === Number(transaction.categoryId)
      );

      // Lấy ngày từ transaction (bỏ phần giờ)
      const date = transaction.date.split(" ")[0];

      // Chuẩn bị đối tượng giao dịch
      const transactionData = {
        ...transaction,
        accountName: account ? account.name : "Không xác định",
        categoryName: category ? category.name : "Không xác định",
        typeAccount: account ? account.type : "cash",
        icon: category ? category.icon : "question",
        iconLib: category ? category.iconLib : "FontAwesome5",
      };

      // Nhóm giao dịch theo ngày
      if (!groupedTransactions[date]) {
        groupedTransactions[date] = {
          date,
          transaction: [],
        };
      }

      groupedTransactions[date].transaction.push(transactionData);
    });

    // Chuyển từ đối tượng sang mảng và sắp xếp theo ngày
    return Object.values(groupedTransactions).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  // Thực thi và in kết quả
  const result = mergeData(transactions, accounts, categories);
  return result;
};

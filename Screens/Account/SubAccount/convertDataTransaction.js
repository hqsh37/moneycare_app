import { getAccountData } from "../../../stores/accountStorage";
import { getCategoryCollect } from "../../../stores/categoryCollect";
import { getCategorySpend } from "../../../stores/categorySpend";
import { getTransactionData } from "../../../stores/transactionStorage";

export const convertDataTransaction = async (id = false, type = "cash") => {
  const transactions = await getTransactionData();

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

  const mergeData = (transactions, categories) => {
    var sumSpend = 0;
    var sumColect = 0;
    // Nhóm giao dịch theo ngày
    const groupedTransactions = {};

    transactions.forEach((transaction) => {
      if (transaction.accountId == id) {
        const category = categories.find(
          (cat) => cat.id === Number(transaction.categoryId)
        );

        if (transaction.type === "chi") {
          sumSpend += Number(transaction.amount);
        }

        if (transaction.type === "thu") {
          sumColect += Number(transaction.amount);
        }

        // Lấy ngày từ transaction (bỏ phần giờ)
        const date = transaction.date.split(" ")[0];

        // Chuẩn bị đối tượng giao dịch
        const transactionData = {
          ...transaction,
          accountName: "",
          categoryName: category ? category.name : "Không xác định",
          typeAccount: type,
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
      }
    });

    // Chuyển từ đối tượng sang mảng và sắp xếp theo ngày
    return {
      transactions: Object.values(groupedTransactions).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
      sumColect,
      sumSpend,
    };
  };

  // Thực thi và in kết quả
  const result = mergeData(transactions, categories);
  return result;
};

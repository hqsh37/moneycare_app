import { getAccountData } from "../../../stores/accountStorage";
import { getCategoryCollect } from "../../../stores/categoryCollect";
import { getCategorySpend } from "../../../stores/categorySpend";

export const convertSpendIncomePlanData = async (plans) => {
  // Lấy dữ liệu tài khoản và danh mục
  const accounts = await getAccountData();
  const categorySpend = await getCategorySpend();
  const categoryCollect = await getCategoryCollect();

  // Hàm chuyển đổi danh mục thành danh sách phẳng
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

  // Làm phẳng danh mục
  const categoriesSpendFlatten = flattenCategories(categorySpend);
  const categoriesCollectFlatten = flattenCategories(categoryCollect);
  const categories = [...categoriesSpendFlatten, ...categoriesCollectFlatten];

  // Nhóm kế hoạch theo ngày
  const groupedPlans = {};

  plans.forEach((plan) => {
    const date = plan.date; // Lấy ngày từ plan

    // Tìm tài khoản và danh mục tương ứng
    const account = accounts.find((acc) => acc.id === plan.accountId);
    const category = categories.find(
      (cat) => cat.id === Number(plan.categoryId)
    );

    // Nếu chưa có ngày này trong groupedPlans, khởi tạo
    if (!groupedPlans[date]) {
      groupedPlans[date] = {
        date,
        plans: [],
      };
    }

    // Thêm plan vào danh sách kế hoạch của ngày, kèm thông tin tài khoản và danh mục
    groupedPlans[date].plans.push({
      accountId: plan.accountId,
      accountName: account ? account.name : "Không xác định",
      accountType: account ? account.type : "Không xác định",
      categoryId: plan.categoryId,
      categoryName: category ? category.name : "Không xác định",
      amount: plan.amount,
      date: plan.date,
      desc: plan.desc,
      id: plan.id,
      status: plan.status,
      type: plan.type,
      icon: category ? category.icon : "question",
      iconLib: category ? category.iconLib : "FontAwesome5",
    });
  });

  // Chuyển từ đối tượng sang mảng và chuẩn hóa ngày để sắp xếp
  const sortedGroups = Object.values(groupedPlans).sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);

    // Tạo đối tượng Date từ ngày, tháng, năm
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    return dateA - dateB; // Sắp xếp tăng dần
  });

  return sortedGroups;
};

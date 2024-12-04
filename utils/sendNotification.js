import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

// Cấu hình thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Hàm gửi thông báo
export const sendNotification = async (title, body, data = {}) => {
  try {
    // Yêu cầu quyền thông báo nếu chưa có
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Quyền thông báo đã bị từ chối.");
        return;
      }
    }

    // Gửi thông báo
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Thông báo",
        body: body || "Đây là nội dung thông báo",
        data: data, // Dữ liệu kèm theo (nếu có)
      },
      trigger: { seconds: 1 }, // Gửi sau 1 giây
    });

    console.log("Thông báo đã được gửi.");
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error);
  }
};

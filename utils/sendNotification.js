import * as Notifications from "expo-notifications";

export const sendNotification = async (
  title,
  body,
  data = {},
  trigger = { seconds: 1 }
) => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.log("Quyền thông báo đã bị từ chối.");
        return;
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Thông báo",
        body: body || "Đây là nội dung thông báo",
        data: data, // Dữ liệu kèm theo
      },
      trigger, // Kích hoạt dựa trên tham số truyền vào
    });

    console.log("Thông báo đã được gửi.");
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error);
  }
};

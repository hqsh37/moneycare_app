import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";

const More = () => {
  const [refreshing, setRefreshing] = useState(false);

  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(3000);

  // Hàm này được gọi khi người dùng vuốt xuống để làm mới
  const onRefresh = () => {
    setRefreshing(true);
    // Giả lập hành động tải lại nội dung
    setTimeout(() => {
      setRefreshing(false); // Tắt trạng thái làm mới sau 2 giây
    }, 2000);
  };

  useEffect(() => {
    // Chạy trên các thiết bị thật để kiểm tra thông báo
    Notifications.requestPermissionsAsync();
  }, []);

  const sendLocalNotification = async () => {
    const date = new Date();
    date.setHours(10);
    date.setMinutes(11);
    date.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Thông báo hẹn giờ!",
        body: "Đây là thông báo vào lúc 9:00 sáng.",
      },
      trigger: date,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{ justifyContent: "center", alignItems: "center", height: 600 }}
      >
        <Text>Kéo xuống để làm mới</Text>
      </View>
    </ScrollView>
  );
};

export default More;

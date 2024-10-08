import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";

const More = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Hàm này được gọi khi người dùng vuốt xuống để làm mới
  const onRefresh = () => {
    setRefreshing(true);
    // Giả lập hành động tải lại nội dung
    setTimeout(() => {
      setRefreshing(false); // Tắt trạng thái làm mới sau 2 giây
    }, 2000);
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

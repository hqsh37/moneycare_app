import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "../../../components/Icon";

const InfoUsScreen = ({ onBack = () => {} }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Về chúng tôi</Text>
        <View />
      </View>
      <View style={styles.card}>
        <Image
          source={require("../../../assets/image/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.titleCard}>Money Care</Text>
        <Text style={styles.version}>Phiên bản: 1.0.0.Prd</Text>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.title}>Giới thiệu về Money Care</Text>
        <Text style={styles.paragraph}>
          Trong thời đại hiện nay, khi áp lực cuộc sống gia tăng và nhu cầu chi
          tiêu ngày càng đa dạng, việc quản lý tài chính cá nhân đã trở thành
          một kỹ năng mềm không thể thiếu, đặc biệt đối với giới trẻ. Tuy nhiên,
          nhiều bạn trẻ vẫn chưa tìm được một công cụ hiệu quả để theo dõi thu
          chi, lập kế hoạch tài chính hay phân tích thói quen chi tiêu. Nhận
          thức được thực trạng này, chúng tôi đã phát triển{" "}
          <Text style={styles.highlight}>Money Care</Text>, một ứng dụng quản lý
          tài chính cá nhân hiện đại, được thiết kế đặc biệt dành cho người trẻ.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.highlight}>Money Care</Text> là bước tiến từ phiên
          bản web mà chúng tôi đã phát triển trước đây, với nhiều cải tiến vượt
          bậc nhằm đáp ứng tốt hơn nhu cầu thực tế. Ứng dụng không chỉ đơn thuần
          là công cụ quản lý thu chi, mà còn là trợ lý tài chính toàn diện, giúp
          bạn:
        </Text>
        <Text style={styles.bulletPoint}>
          • Theo dõi thu chi dễ dàng: Ghi lại các khoản thu nhập và chi tiêu
          hàng ngày một cách đơn giản và tiện lợi.
        </Text>
        <Text style={styles.bulletPoint}>
          • Lập kế hoạch tài chính cá nhân: Hỗ trợ người dùng đặt mục tiêu tài
          chính ngắn hạn và dài hạn, từ tiết kiệm đến đầu tư.
        </Text>
        <Text style={styles.bulletPoint}>
          • Phân tích xu hướng chi tiêu: Cung cấp các báo cáo trực quan về thói
          quen chi tiêu, giúp bạn nhận ra điểm mạnh và hạn chế trong cách sử
          dụng tài chính.
        </Text>
        <Text style={styles.bulletPoint}>
          • Đề xuất tối ưu ngân sách: Đưa ra các gợi ý phù hợp để bạn tối ưu hóa
          ngân sách cá nhân, hướng đến sự ổn định và phát triển tài chính.
        </Text>
        <Text style={styles.paragraph}>
          Ứng dụng được xây dựng dựa trên sự quan sát thực tế và phản hồi từ các
          bạn trẻ, kết hợp với những kiến thức chuyên môn và kỹ năng lập trình
          mà chúng tôi đã tích lũy. Với giao diện thân thiện, dễ sử dụng,{" "}
          <Text style={styles.highlight}>Money Care</Text> hướng đến mục tiêu
          giúp người dùng hình thành thói quen quản lý tài chính hiệu quả từ
          sớm. Đồng thời, ứng dụng cũng hoàn toàn miễn phí, mang đến giá trị tối
          đa cho mọi người.
        </Text>
        <Text style={styles.paragraph}>
          Chúng tôi tin rằng, với{" "}
          <Text style={styles.highlight}>Money Care</Text>, việc quản lý tài
          chính sẽ trở nên đơn giản, thuận tiện và thú vị hơn bao giờ hết. Đây
          không chỉ là một công cụ, mà còn là người bạn đồng hành trên hành
          trình chinh phục sự tự do tài chính của bạn.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  mainContent: {
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#009FDA",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginVertical: 30,
    marginHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  titleCard: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: "#666",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 15,
    textAlign: "justify", // Căn đều hai bên
  },
  highlight: {
    color: "#000",
    fontWeight: "bold",
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 10,
    paddingLeft: 10,
    textAlign: "justify", // Căn đều hai bên
  },
});

export default InfoUsScreen;

import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "../../../components/Icon";

const PrivacyPolicyScreen = ({ onBack = () => {} }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chính sách bảo mật</Text>
        <View />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          Moneycare đã phát triển ứng dụng Money Care dưới dạng ứng dụng miễn
          phí. Dịch vụ này được Moneycare cung cấp miễn phí và dành để sử dụng
          như hiện tại, mà không yêu cầu bất kỳ khoản phí nào từ người dùng.
        </Text>
        <Text style={styles.text}>
          Trang này được sử dụng để thông báo cho người dùng rằng ứng dụng không
          thu thập, lưu trữ, hoặc chia sẻ bất kỳ thông tin cá nhân nào.
          Moneycare cam kết tôn trọng quyền riêng tư và bảo vệ dữ liệu của người
          dùng.
        </Text>

        <Text style={styles.subHeader}>Thu thập và Sử dụng Thông tin</Text>
        <Text style={styles.text}>
          Ứng dụng Money Care không thu thập bất kỳ thông tin cá nhân nào của
          bạn. Tất cả các hoạt động trong ứng dụng đều diễn ra trên thiết bị của
          bạn, và dữ liệu của bạn sẽ không được gửi hoặc lưu trữ trên bất kỳ máy
          chủ nào.
        </Text>

        <Text style={styles.subHeader}>Dữ liệu Nhật ký</Text>
        <Text style={styles.text}>
          Chúng tôi không thu thập hoặc lưu trữ dữ liệu nhật ký. Mọi hoạt động
          hoặc lỗi xảy ra trong ứng dụng đều được xử lý trực tiếp trên thiết bị
          của bạn, và không có thông tin nào được chia sẻ với Moneycare hoặc bên
          thứ ba.
        </Text>

        <Text style={styles.subHeader}>Cookies</Text>
        <Text style={styles.text}>
          Ứng dụng Money Care không sử dụng cookie hoặc bất kỳ công nghệ theo
          dõi nào. Người dùng có thể yên tâm rằng dữ liệu và hoạt động của họ
          không bị theo dõi hoặc lưu trữ.
        </Text>

        <Text style={styles.subHeader}>Bảo mật</Text>
        <Text style={styles.text}>
          Chúng tôi cam kết đảm bảo rằng ứng dụng an toàn khi sử dụng. Vì ứng
          dụng không thu thập hoặc lưu trữ bất kỳ thông tin nào, người dùng
          không cần lo ngại về các vấn đề liên quan đến bảo mật dữ liệu cá nhân.
        </Text>

        <Text style={styles.subHeader}>Quyền riêng tư của trẻ em</Text>
        <Text style={styles.text}>
          Ứng dụng Money Care phù hợp với mọi đối tượng, bao gồm cả trẻ em, vì
          chúng tôi không thu thập bất kỳ thông tin cá nhân nào từ người dùng.
        </Text>

        <Text style={styles.subHeader}>Liên hệ</Text>
        <Text style={styles.text}>
          Nếu bạn có bất kỳ câu hỏi nào về ứng dụng Money Care, vui lòng liên hệ
          với chúng tôi qua email tại: hqsh37@gmail.com hoặc
          hqsh37@moneycare.io.vn.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
  content: {
    marginTop: 6,
    paddingBottom: 20,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "justify",
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
});

export default PrivacyPolicyScreen;

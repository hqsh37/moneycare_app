import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "../../../components/Icon";

const TermsAndConditionScreen = ({ onBack = () => {} }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Điều khoản sử dụng</Text>
        <View />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Nội dung chính sách */}
        <Text style={styles.sectionTitle}>1. Quyền sở hữu trí tuệ</Text>
        <Text style={styles.text}>
          Bạn <Text style={styles.bold}>không được phép</Text> sao chép, sửa đổi
          ứng dụng, bất kỳ phần nào của ứng dụng hoặc nhãn hiệu của chúng tôi
          dưới bất kỳ hình thức nào. Bạn{" "}
          <Text style={styles.bold}>không được phép</Text> cố gắng truy xuất mã
          nguồn của ứng dụng, dịch ứng dụng sang ngôn ngữ khác hoặc tạo các
          phiên bản phái sinh. Ứng dụng và tất cả các nhãn hiệu, bản quyền,
          quyền cơ sở dữ liệu và các quyền sở hữu trí tuệ khác liên quan đến ứng
          dụng đều thuộc về <Text style={styles.bold}>Moneycare</Text>.
        </Text>

        <Text style={styles.sectionTitle}>2. Cam kết và trách nhiệm</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Moneycare</Text> cam kết đảm bảo rằng ứng
          dụng luôn hữu ích và hiệu quả nhất có thể. Ứng dụng hoàn toàn miễn phí
          và chúng tôi không có dự định áp dụng bất kỳ khoản phí nào trong tương
          lai. Bạn có thể yên tâm sử dụng các dịch vụ mà không lo ngại về chi
          phí.
        </Text>

        <Text style={styles.sectionTitle}>
          3. Lưu trữ và bảo vệ dữ liệu cá nhân
        </Text>
        <Text style={styles.text}>
          Ứng dụng <Text style={styles.bold}>Money Care</Text> lưu trữ và xử lý
          dữ liệu cá nhân mà bạn đã cung cấp để cung cấp dịch vụ. Trách nhiệm
          của bạn là giữ cho điện thoại và quyền truy cập vào ứng dụng được bảo
          mật. Chúng tôi khuyến nghị bạn{" "}
          <Text style={styles.bold}>không jailbreak hoặc root thiết bị</Text>,
          vì việc này có thể:
        </Text>
        <Text style={styles.text}>
          {"\u2022"} Làm cho thiết bị của bạn dễ bị tấn công bởi mã độc/phần mềm
          độc hại.
        </Text>
        <Text style={styles.text}>
          {"\u2022"} Ảnh hưởng đến tính năng bảo mật của thiết bị.
        </Text>
        <Text style={styles.text}>
          {"\u2022"} Làm ứng dụng Money Care hoạt động không đúng hoặc hoàn toàn
          không hoạt động.
        </Text>

        <Text style={styles.sectionTitle}>4. Dịch vụ của bên thứ ba</Text>
        <Text style={styles.text}>
          Ứng dụng có sử dụng dịch vụ của bên thứ ba. Các dịch vụ này sẽ tuân
          theo các điều khoản và điều kiện riêng của họ.
        </Text>

        <Text style={styles.sectionTitle}>5. Liên hệ</Text>
        <Text style={styles.text}>
          Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào liên quan đến chính sách
          bảo mật này, vui lòng liên hệ với chúng tôi qua email:{" "}
          <Text style={styles.bold}>hqsh37@moneycare.io.vn</Text>.
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
  text: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "justify",
  },
  bold: {
    fontWeight: "bold",
    color: "#333",
  },
});

export default TermsAndConditionScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import Icon from "../../../components/Icon";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";
import TermsAndConditionScreen from "./TermsAndConditionScreen";
import InfoUsScreen from "./InfoUsScreen";
import ChangePasswordScreen from "./ChangePasswordScreen";
import ReminderScreen from "./ReminderScreen";
import FeedbackModal from "./FeedbackModal";

const SettingScreen = ({ onBack = () => {} }) => {
  const [modalVisiblePolicy, setModalVisiblePolicy] = useState(false);
  const [modalVisibleTerm, setModalVisibleTerm] = useState(false);
  const [modalVisibleInfo, setModalVisibleInfo] = useState(false);
  const [modalVisibleChangePass, setModalVisibleChangePass] = useState(false);
  const [modalVisibleReminder, setModalVisibleReminder] = useState(false);
  const [modalVisibleFeedback, setModalVisibleFeedback] = useState(false);

  const menuItems = [
    {
      id: "1",
      title: "Nhắc nhở nhập liệu",
      icon: "alarm-outline", // Biểu tượng đồng hồ báo thức
      onPress: () => setModalVisibleReminder(true),
    },
    {
      id: "2",
      title: "Đổi mật khẩu",
      icon: "key-outline", // Biểu tượng chìa khóa
      onPress: () => setModalVisibleChangePass(true),
    },
    {
      id: "3",
      title: "Về chúng tôi",
      icon: "information-circle-outline", // Biểu tượng thông tin
      onPress: () => setModalVisibleInfo(true),
    },
    {
      id: "4",
      title: "Điều khoản sử dụng",
      icon: "document-text-outline", // Biểu tượng tài liệu
      onPress: () => setModalVisibleTerm(true),
    },
    {
      id: "5",
      title: "Chính sách bảo mật",
      icon: "shield-checkmark-outline", // Biểu tượng khiên bảo mật
      onPress: () => setModalVisiblePolicy(true),
    },
    {
      id: "6",
      title: "Nhận xét",
      icon: "chatbubble-ellipses-outline", // Biểu tượng nhận xét/chat
      onPress: () => setModalVisibleFeedback(true),
    },
  ];

  // Render từng mục trong menu
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <Icon
        iconLib="Ionicons"
        icon={item.icon}
        size={24}
        color="#009FDA"
        style={styles.menuIcon}
      />
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View />
      </View>

      {/* Danh sách thông tin */}
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuContainer}
      />

      {/* Modal Privacy and Policy */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisiblePolicy}
        onRequestClose={() => setModalVisiblePolicy(false)}
      >
        <PrivacyPolicyScreen onBack={() => setModalVisiblePolicy(false)} />
      </Modal>

      {/* Modal Term and Condition */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleTerm}
        onRequestClose={() => setModalVisibleTerm(false)}
      >
        <TermsAndConditionScreen onBack={() => setModalVisibleTerm(false)} />
      </Modal>

      {/* Modal Infomation about us*/}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleInfo}
        onRequestClose={() => setModalVisibleInfo(false)}
      >
        <InfoUsScreen onBack={() => setModalVisibleInfo(false)} />
      </Modal>

      {/* Modal change password*/}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleChangePass}
        onRequestClose={() => setModalVisibleChangePass(false)}
      >
        <ChangePasswordScreen onBack={() => setModalVisibleChangePass(false)} />
      </Modal>

      {/* Modal reminder*/}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleReminder}
        onRequestClose={() => setModalVisibleReminder(false)}
      >
        <ReminderScreen onBack={() => setModalVisibleReminder(false)} />
      </Modal>

      {/* Modal Feedback*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleFeedback}
        onRequestClose={() => setModalVisibleFeedback(false)}
      >
        <FeedbackModal onBack={() => setModalVisibleFeedback(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF", // Nền trắng
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
    paddingVertical: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Đường phân cách
  },
  label: {
    fontSize: 16,
    color: "#333", // Màu chữ đậm
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    color: "#666", // Màu chữ nhạt hơn cho giá trị
    marginRight: 10,
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Màu đường phân cách
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333", // Màu chữ tối
  },
});

export default SettingScreen;

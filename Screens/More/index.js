import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  Linking,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ConfirmationModal from "../../components/ConfirmationModal";
import { AuthContext } from "../../utils/AuthContext";
import ProfileScreen from "./ProfileScreen";
import SettingScreen from "./SettingScreen";

const More = () => {
  const [modalVisibleLogout, setModalVisibleLogout] = useState(false);
  const [modalVisibleProfile, setModalVisibleProfile] = useState(false);
  const [modalVisibleSetting, setModalVisibleSetting] = useState(false);
  const { logoutAuthContext } = useContext(AuthContext);
  const userName = "Hoàng Quang Sang";

  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url); // Mở URL
      } else {
        Alert.alert("Lỗi", "Không thể mở liên kết: " + url);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi: " + error.message);
    }
  };

  // Dữ liệu menu
  const menuItems = [
    {
      id: "1",
      title: "Giới thiệu cho bạn bè",
      icon: "thumbs-up-outline",
      onPress: () => openLink("https://github.com/hqsh37/moneycare_app"),
    },
    {
      id: "2",
      title: "Hồ sơ cá nhân",
      icon: "person-outline",
      onPress: () => setModalVisibleProfile(true),
    },
    {
      id: "3",
      title: "Cài đặt",
      icon: "settings-outline",
      onPress: () => setModalVisibleSetting(true),
    },
    {
      id: "4",
      title: "Đăng xuất",
      icon: "log-out-outline",
      onPress: () => setModalVisibleLogout(true),
    },
  ];

  // Render từng mục trong menu
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <Icon
        name={item.icon}
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
        <Text style={styles.headerText}>Xem thêm</Text>
      </View>

      <View style={styles.card}>
        <Image
          source={require("../../assets/image/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Money Care</Text>
        <Text style={styles.version}>Phiên bản: 1.0.0.Prd</Text>
      </View>

      {/* Menu tính năng */}
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuContainer}
      />

      {/* Modal Profile */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleProfile}
        onRequestClose={() => setModalVisibleProfile(false)}
      >
        <ProfileScreen onBack={() => setModalVisibleProfile(false)} />
      </Modal>

      {/* Modal Profile */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleSetting}
        onRequestClose={() => setModalVisibleSetting(false)}
      >
        <SettingScreen onBack={() => setModalVisibleSetting(false)} />
      </Modal>

      {/* Modal logout */}
      <ConfirmationModal
        isVisible={modalVisibleLogout}
        toggleModal={() => {
          setModalVisibleLogout(false);
        }}
        onConfirm={logoutAuthContext}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF", // Nền trắng
  },
  header: {
    backgroundColor: "#009FDA", // Màu header
    paddingVertical: 15,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: "#666",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Màu chữ tối
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

export default More;

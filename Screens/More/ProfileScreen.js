import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "../../components/Icon";
import { getTimestamps } from "../../stores/Timestamp";

const ProfileScreen = ({ onBack = () => {} }) => {
  const [fisrtName, setFisrtName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    const handleGetData = async () => {
      try {
        const datas = await getTimestamps();
        setFisrtName(datas.firstname || ""); // Thêm giá trị mặc định
        setLastName(datas.lastname || "");
        setEmail(datas.email || "");
      } catch (error) {
        console.error("Error fetching timestamps:", error);
      }
    };

    handleGetData();
  }, []);

  const profileData = [
    { id: "1", label: "Họ", value: fisrtName },
    { id: "2", label: "Tên", value: lastName },
    { id: "3", label: "Email", value: email },
  ];

  const renderProfileItem = ({ id, label, value }) => (
    <TouchableOpacity key={id} style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <View />
      </View>

      {/* Danh sách thông tin */}
      <View style={styles.content}>{profileData.map(renderProfileItem)}</View>
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
});

export default ProfileScreen;

import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AddReminderModal from "./AddReminderModal";
import Toast from "react-native-toast-message";
import {
  getSpendingAlertData,
  saveSpendingAlertData,
} from "../../../stores/spendingAlertStorage";
import UpdateAlertModal from "./UpdateAlertModal";
import ConfirmationModal from "../../../components/ConfirmationModal";

const SpendingAlert = ({ idAccount, onBack = () => {} }) => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const storedReminders = await getSpendingAlertData();
      setAlerts(storedReminders.filter((r) => r.idAccount === idAccount));
    } catch (error) {
      console.error("Error loading reminders:", error);
    }
  };

  const handleSave = async (alert) => {
    const dataOld = await getSpendingAlertData();

    const data = [...dataOld, { idAccount: idAccount, ...alert }];

    await saveSpendingAlertData(data);
  };

  const handleAddReminder = (alert) => {
    if (isFinite(idAccount)) {
      handleSave(alert);
    } else {
      Toast.show({
        text1: "Lỗi",
        text2: "Không thể thêm cảnh báo chi tiêu cho tài khoản này",
        type: "error",
      });
    }
  };

  const handleUpdateReminder = async (updatedAlert) => {
    try {
      const dataOld = (await getSpendingAlertData()) || [];

      // Cập nhật dữ liệu
      const updatedData = dataOld.map((item) =>
        item.idAccount === idAccount && item.amount === selectedAlert.amount
          ? { ...item, ...updatedAlert }
          : item
      );

      await saveSpendingAlertData(updatedData);
      setAlerts(updatedData.filter((r) => r.idAccount === idAccount)); // Cập nhật danh sách
      setModalVisibleUpdate(false);
      Toast.show({
        text1: "Thành công",
        text2: "Cập nhật cảnh báo chi tiêu thành công.",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating data:", error);
      Toast.show({
        text1: "Lỗi",
        text2: "Không thể cập nhật cảnh báo.",
        type: "error",
      });
    }
  };

  const handleUpdate = (alert) => {
    setModalVisibleUpdate(true);
    setSelectedAlert(alert);
  };

  const handleRemoveConfirm = async () => {
    try {
      const dataOld = (await getSpendingAlertData()) || [];

      // Cập nhật dữ liệu
      const updatedData = dataOld.map((item) =>
        item.idAccount === idAccount && item.amount === selectedAlert.amount
          ? { ...item, ...updatedAlert }
          : item
      );

      await saveSpendingAlertData(updatedData);
      setAlerts(updatedData.filter((r) => r.idAccount === idAccount)); // Cập nhật danh sách
      setModalVisibleUpdate(false);
      Toast.show({
        text1: "Thành công",
        text2: "Cập nhật cảnh báo chi tiêu thành công.",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating data:", error);
      Toast.show({
        text1: "Lỗi",
        text2: "Không thể cập nhật cảnh báo.",
        type: "error",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cảnh báo chi tiêu</Text>
        <View />
      </View>

      {/* Content */}
      {alerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="document-outline" size={60} color="#666" />
          <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          renderItem={({ item }) => (
            <View style={styles.reminderItem}>
              <TouchableOpacity onPress={() => handleUpdate(item)}>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTitle}>{item.title}</Text>
                  <Text style={styles.amount}>
                    Số tiền: {item.amount.toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginVertical: "auto", alignItems: "center" }}
                onPress={() => setModalVisibleRemove(true)}
              >
                <Icon name="trash-outline" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      <Toast />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Thêm</Text>
      </TouchableOpacity>

      {/* Add Reminder Modal */}
      <AddReminderModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddReminder}
        idAccount={idAccount}
      />

      {/* Add Reminder Modal */}
      <UpdateAlertModal
        visible={isModalVisibleUpdate}
        onClose={() => setModalVisibleUpdate(false)}
        onAdd={handleUpdateReminder}
        data={selectedAlert}
      />

      {/* Modal Remove */}
      <ConfirmationModal
        isVisible={modalVisibleRemove}
        toggleModal={() => {
          setModalVisibleRemove(false);
        }}
        onConfirm={() => {
          handleRemoveConfirm();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  reminderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Align items at the top
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  reminderContent: {
    flex: 1, // Allow content to take up available space
    paddingRight: 10, // Space to prevent overlap with delete icon
  },
  reminderTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  amount: {
    fontSize: 14,
    color: "#AAA",
  },
  addButton: {
    backgroundColor: "#009FDA",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default SpendingAlert;

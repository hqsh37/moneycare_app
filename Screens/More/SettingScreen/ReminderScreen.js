import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AddReminderModal from "./AddReminderModal";
import {
  saveReminderData,
  getReminderData,
} from "../../../stores/reminderStorage";
import * as Notifications from "expo-notifications";
import Icon from "../../../components/Icon";

const ReminderScreen = ({ onBack = () => {} }) => {
  const [reminders, setReminders] = useState([]); // List of reminders
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  // Load reminders when the component mounts
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const storedReminders = await getReminderData();
        setReminders(storedReminders || []);
      } catch (error) {
        console.error("Error loading reminders:", error);
      }
    };

    loadReminders();
  }, []);

  // Save reminders when they change, except on first render
  useEffect(() => {
    const saveReminders = async () => {
      try {
        await saveReminderData(reminders);
      } catch (error) {
        console.error("Error saving reminders:", error);
      }
    };

    if (isFirst) {
      setIsFirst(false);
    } else {
      saveReminders();
    }
  }, [reminders]);

  // Configure notifications
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Notification permissions are required."
        );
      }
    };

    requestPermissions();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  // Schedule notification and return notificationId
  const scheduleNotification = useCallback(async (reminder) => {
    try {
      // Parse the time from the reminder
      const reminderTime = new Date(reminder.time);

      // Get current time
      const now = new Date();

      // Set the first trigger time to today at the specified hour and minute
      let firstTrigger = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        reminderTime.getHours(),
        reminderTime.getMinutes(),
        0,
        0
      );

      // If the time has already passed today, set the trigger to tomorrow
      if (firstTrigger <= now) {
        firstTrigger.setDate(firstTrigger.getDate() + 1);
      }

      // Schedule a daily repeating notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lời nhắc nhở 📌",
          body: reminder.title,
        },
        trigger: {
          hour: reminderTime.getHours(),
          minute: reminderTime.getMinutes(),
          repeats: true,
        },
      });

      return notificationId;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return null;
    }
  }, []);

  // Add reminder
  const handleAddReminder = useCallback(
    async (newReminder) => {
      const reminder = {
        id: Date.now().toString(),
        ...newReminder,
      };

      // Schedule notification and get notificationId
      const notificationId = await scheduleNotification(reminder);

      // Save notificationId into the reminder
      reminder.notificationId = notificationId;

      setReminders((prevReminders) => [...prevReminders, reminder]);
    },
    [scheduleNotification]
  );

  // Delete reminder
  const deleteReminder = useCallback(
    async (id) => {
      // Find the reminder to delete
      const reminderToDelete = reminders.find((item) => item.id === id);

      if (reminderToDelete) {
        // Cancel the notification
        if (reminderToDelete.notificationId) {
          try {
            await Notifications.cancelScheduledNotificationAsync(
              reminderToDelete.notificationId
            );
          } catch (error) {
            console.error("Error cancelling notification:", error);
          }
        }

        // Update state
        setReminders((prevReminders) =>
          prevReminders.filter((item) => item.id !== id)
        );
      }
    },
    [reminders]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon
            iconLib="Ionicons"
            icon="arrow-back-outline"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lời nhắc nhở</Text>
        <View />
      </View>

      {/* Content */}
      {reminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            iconLib="Ionicons"
            icon="document-outline"
            size={60}
            color="#666"
          />
          <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          renderItem={({ item }) => (
            <View style={styles.reminderItem}>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderTime}>
                  {`Thời gian: ${new Date(item.time).toLocaleTimeString(
                    "vi-VN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}`}
                </Text>
              </View>
              <TouchableOpacity onPress={() => deleteReminder(item.id)}>
                <Icon
                  iconLib="Ionicons"
                  icon="trash-outline"
                  size={24}
                  color="#FF0000"
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}

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
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  reminderTime: {
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

export default ReminderScreen;

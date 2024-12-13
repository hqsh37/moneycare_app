import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import Icon from "../../../components/Icon";
import SpendIncomePlanUpdate from "./SpendIncomePlanUpdate";
import ConfirmationModal from "../../../components/ConfirmationModal";
import {
  getTransactionData,
  saveTransactionData,
} from "../../../stores/transactionStorage";
import { addHandleAsyncData } from "../../../services/asyncData";
import { updateAmountById } from "../../../stores/accountStorage";
import Toast from "react-native-toast-message";
import {
  getSpendIncomePlanData,
  saveSpendIncomePlanData,
} from "../../../stores/spendIncomePlanStorage";
const HistoryChild = ({ data, onReload = () => {} }) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleConfirm, setModalVisibleConfirm] = useState(false);
  const getRandomId = () => `account_${Math.floor(Math.random() * 9999999)}`;

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const resetTimeToday = () => {
    const resetDate = new Date();
    resetDate.setHours(0, 0, 0, 0);
    return resetDate;
  };

  const convertToDate = (dateString) => {
    // Phân tách chuỗi ngày
    const [day, month, year] = dateString.split("/").map(Number);

    // Tạo đối tượng Date (lưu ý: tháng bắt đầu từ 0, nên cần -1)
    return new Date(year, month - 1, day);
  };

  const prepareTransactionData = () => ({
    id: getRandomId(),
    amount: selectedItem.amount,
    date: `${selectedItem.date} 00:00`,
    accountId: selectedItem.accountId,
    categoryId: selectedItem.categoryId,
    image: "",
    type: selectedItem.type,
    desc: selectedItem.desc,
  });

  const handleCreateLoading = async () => {
    const transactionPrepare = prepareTransactionData();

    try {
      const dataOld = await getTransactionData();
      await saveTransactionData([...dataOld, transactionPrepare]);
      await addHandleAsyncData({
        type: "create",
        tbl: "transaction",
        id: transactionPrepare.id,
        data: transactionPrepare,
      });
      await addHandleAsyncData({
        type: "update",
        tbl: "amount",
        id: transactionPrepare.accountId,
        data: {
          id: transactionPrepare.accountId,
          amount:
            transactionPrepare.type == "chi"
              ? "-" + transactionPrepare.amount
              : transactionPrepare.amount,
        },
      });
      await updateAmountById(
        transactionPrepare.accountId,
        transactionPrepare.amount,
        transactionPrepare.type == "chi" ? "minus" : "plus"
      );
      return true;
    } catch (error) {
      console.error("Error creating transaction:", error);
      return false;
    }
  };

  const handleDataRemove = (dataOld, alertId) => {
    const index = dataOld.findIndex((item) => item.id === alertId);
    if (index !== -1) {
      dataOld.splice(index, 1);
    }
    return dataOld;
  };

  // Handle Toast Message save
  const handleSave = async () => {
    // Lưu dữ liệu
    const result = await handleCreateLoading();

    // Hiển thị thông báo và reset nếu thành công
    if (result) {
      try {
        const dataOld = await getSpendIncomePlanData();

        // Cập nhật dữ liệu
        const updatedData = handleDataRemove(dataOld, selectedItem.id);

        await saveSpendIncomePlanData(updatedData);

        Toast.show({
          text1: "Thành công",
          text2: "Đã Ghi thành công.",
          type: "success",
        });

        setModalVisibleConfirm(false);
        onReload();
      } catch (error) {
        console.error("Error updating data:", error);
        Toast.show({
          text1: "Lỗi",
          text2: "Không thể xóa dự chi/dự thu.",
          type: "error",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra",
        text2: "Vui lòng thử lại sau.",
      });
    }
  };
  const handleConfirm = () => {
    handleSave();
  };

  const renderTransactionItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => {
          setSelectedItem(item);
          setModalVisibleUpdate(true);
        }}
      >
        {/* Icon giao dịch */}
        <View style={styles.iconContainer}>
          <Icon
            iconLib={item.iconLib}
            icon={item.icon}
            size={24}
            color="#333"
          />
        </View>

        {/* Tên giao dịch và loại */}
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{item.categoryName}</Text>
          <Text style={styles.transactionType}>
            {item.typeAccount === "cash" ? "Tiền mặt" : "Ngân hàng"}
          </Text>
        </View>

        <View style={styles.viewAmount}>
          {/* Số tiền giao dịch */}
          <Text
            style={[
              styles.transactionAmount,
              item.type == "thu" && { color: "green" },
            ]}
          >
            {formatCurrencyVND(item.amount)}
          </Text>

          <TouchableOpacity
            onPress={() => {
              setModalVisibleConfirm(true);
              setSelectedItem(item);
            }}
          >
            <Icon
              iconLib="Ionicons"
              icon="checkmark"
              size={28}
              color="#333"
              style={{ padding: 8, color: "#009fda" }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị ngày */}
      <View style={styles.dateContainer}>
        <Text
          style={[
            styles.dateText,
            resetTimeToday() > convertToDate(data.date) && { color: "red" },
          ]}
        >
          {data.date}
        </Text>
      </View>

      {/* Danh sách các giao dịch */}
      <FlatList
        data={data.plans}
        renderItem={renderTransactionItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Modal update */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleUpdate}
        onRequestClose={() => setModalVisibleUpdate(false)}
      >
        <SpendIncomePlanUpdate
          onBack={() => setModalVisibleUpdate(false)}
          datas={selectedItem}
          onReload={() => onReload()}
        />
      </Modal>

      {/* Modal confirm */}
      <ConfirmationModal
        isVisible={modalVisibleConfirm}
        toggleModal={() => {
          setModalVisibleConfirm(false);
        }}
        onConfirm={() => {
          handleConfirm();
        }}
        content="Bạn đã thực hiện khoản dự thu/dự chi này!"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  dateContainer: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009fda",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopColor: "#f0f0f0",
    borderTopWidth: 1,
    paddingBottom: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionType: {
    fontSize: 14,
    color: "gray",
  },
  viewAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionAmount: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginVertical: "auto",
  },
});

export default HistoryChild;

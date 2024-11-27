import {
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { default as ModalNew } from "react-native-modal";
import Toast from "react-native-toast-message";

import { checkNetworkStatus } from "../../../services/asyncDataCloud";
import { asyncDataCloud } from "../../../handlers/dataAsyncHandle";
import { getSavingsData, saveSavingsData } from "../../../stores/savingStorage";
import { useDebounce } from "../../../hooks";
import ConfirmationModal from "../../../components/ConfirmationModal";
import EmptyItem from "../../../components/EmptyItem";
import Icon from "../../../components/Icon";
import Loading from "../../../components/Loading";
import SubSavingsItem from "./SubSavingsItem";
import AddSavingScreen from "./AddSavingScreen";
import ActionMenu from "./ActionMenu";
import UpdateSavingScreen from "./UpdateSavingScreen";
import { addHandleAsyncData } from "../../../services/asyncData";
import DetailSavingScreen from "./DetailSavingScreen";

const Savings = ({ textSearch = "" }) => {
  const [savings, setSavings] = useState([]);
  const [filteredSavings, setFilteredSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleDetail, setModalVisibleDetail] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);
  const [modalVisibleClosings, setModalVisibleClosings] = useState(false);
  const [isAcctionMenu, setAcctionMenu] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedValue = useDebounce(textSearch, 500);

  useEffect(() => {
    fetchSavings();
  }, []);

  useEffect(() => {
    filterSavings();
  }, [debouncedValue, savings]);

  const fetchSavings = async () => {
    await asyncData();
    setIsLoading(true);

    const savingsDta = await getSavingsData();

    setSavings(savingsDta);

    // Calculate total savings
    const total = savingsDta.reduce(
      (sum, saving) => sum + Number(saving.amount),
      0
    );
    setTotalSavings(total);

    setIsLoading(false);
  };

  const filterSavings = () => {
    const lowerSearch = removeVietnameseTones(debouncedValue);
    const filtered = savings.filter((saving) =>
      removeVietnameseTones(saving.name.toLowerCase()).includes(lowerSearch)
    );
    setFilteredSavings(filtered);
  };

  const removeVietnameseTones = (str) => {
    if (str) {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .trim();
    } else {
      return "";
    }
  };

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const onRefresh = () => {
    fetchSavings();
  };

  const handleDataRemove = async (dataOld, accountId) => {
    const index = dataOld.findIndex((item) => item.id === accountId);
    if (index !== -1) {
      dataOld.splice(index, 1);
    }
    return dataOld;
  };

  const handleRemoving = async (savingsId) => {
    try {
      await addHandleAsyncData({
        type: "delete",
        tbl: "savings",
        id: savingsId,
      });

      const dataOld = await getSavingsData();

      const storageData = await saveSavingsData(
        handleDataRemove(dataOld, savingsId)
      );

      return storageData;
    } catch (error) {
      console.error("Error creating account:", error);
      return false;
    }
  };

  const handleRemoveSaving = async () => {
    try {
      const success = await handleRemoving(selectedSaving.id);
      if (success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Tài khoản đã xoá thành công!",
        });
        onRefresh();

        // Cập nhật danh sách tài khoản
        const updateSavings = savings.filter(
          (saving) => saving.id !== selectedSaving.id
        );
        setSavings(updateSavings);
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Xoá thất bại, vui lòng thử lại!",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại!",
      });
    }
    setModalVisibleRemove(false);
  };

  const handleDataUpdate = (dataOld, savingsPrepare) =>
    dataOld.map((cat) =>
      cat.id === savingsPrepare.id ? { ...cat, ...savingsPrepare } : cat
    );

  const handleclosing = async (savingsId) => {
    const savingsPrepare = {
      id: savingsId,
      status: "closing",
    };

    try {
      const dataOld = await getSavingsData();
      const updatedData = await saveSavingsData(
        handleDataUpdate(dataOld, savingsPrepare)
      );
      await addHandleAsyncData({
        type: "update",
        tbl: "savings",
        id: savingsPrepare.id,
        data: savingsPrepare,
      });
      return updatedData;
    } catch (error) {
      console.error("Error creating account:", error);
      return false;
    }
  };

  const handleClosingSaving = async () => {
    try {
      const success = await handleclosing(selectedSaving.id);
      if (success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Tài khoản đã xoá thành công!",
        });
        onRefresh();

        // Cập nhật danh sách tài khoản
        const updateSavings = savings.filter(
          (saving) => saving.id !== selectedSaving.id
        );
        setSavings(updateSavings);
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Xoá thất bại, vui lòng thử lại!",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại!",
      });
    }
    setModalVisibleClosings(false);
  };

  const asyncData = async () => {
    const isConnected = await checkNetworkStatus();
    if (isConnected) {
      console.log("Device is online");
      await asyncDataCloud();
    } else {
      console.log("Device is offline");
    }
  };

  function addMonthsToDate(dateStr, monthsToAdd) {
    // Split the input string into day, month, and year
    const [day, month, year] = dateStr.split("/").map(Number);

    // Create a Date object from the input values
    const date = new Date(year, month - 1, day);

    // Add the specified number of months
    date.setMonth(date.getMonth() + monthsToAdd);

    // Adjust the day if it exceeds the number of days in the resulting month
    if (day > new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
      date.setDate(
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      );
    }

    // Extract the updated day, month, and year
    const newDay = String(date.getDate()).padStart(2, "0");
    const newMonth = String(date.getMonth() + 1).padStart(2, "0");
    const newYear = date.getFullYear();

    // Return the updated date in DD/MM/YYYY format
    return `${newDay}/${newMonth}/${newYear}`;
  }

  const handleClosing = () => {
    setAcctionMenu(false);
    setModalVisibleClosings(true);
  };

  const handleRemove = () => {
    setAcctionMenu(false);
    setModalVisibleRemove(true);
  };
  const handleUpdate = () => {
    setAcctionMenu(false);
    setModalVisibleUpdate(true);
  };

  const handleDetail = () => {
    setAcctionMenu(false);
    setModalVisibleDetail(true);
  };
  return (
    <View style={styles.wrapper}>
      {savings.length === 0 || isLoading ? (
        isLoading ? (
          <Loading />
        ) : (
          <EmptyItem
            title="Bạn chưa có sổ tiết kiệm nào!"
            btnTitle="Thêm sổ tiết kiệm"
            onPress={() => setModalVisibleCreate(true)}
          />
        )
      ) : (
        <>
          {/* Display Total Savings */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              Tổng tiền: {formatCurrencyVND(totalSavings)}
            </Text>
          </View>

          {/* Savings List */}
          <View style={styles.accountList}>
            <FlatList
              data={filteredSavings}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => (
                <SubSavingsItem
                  name={item.name}
                  status={item.status}
                  amount={formatCurrencyVND(item.amount)}
                  date={addMonthsToDate(item.date, Number(item.term))}
                  onPress={() => {
                    setSelectedSaving(item);
                    setAcctionMenu(true);
                  }}
                />
              )}
            />
          </View>
        </>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisibleCreate(true)}
      >
        <Icon iconLib="Ionicons" icon="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Toast />

      {/* Add Savings Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleCreate}
        onRequestClose={() => setModalVisibleCreate(false)}
      >
        <AddSavingScreen
          onPressClose={() => {
            setModalVisibleCreate(false);
            onRefresh();
          }}
        />
      </Modal>

      {/* Modal tongle menu action */}
      <ModalNew
        isVisible={isAcctionMenu}
        style={styles.modal}
        onBackdropPress={() => setAcctionMenu(false)}
      >
        <ActionMenu
          onClosing={handleClosing}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
          onDetail={handleDetail}
          view={
            selectedSaving && selectedSaving.status === "closing"
              ? "less"
              : "full"
          }
        />
      </ModalNew>

      {/* Update Savings Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleUpdate}
        onRequestClose={() => setModalVisibleUpdate(false)}
      >
        <UpdateSavingScreen
          onPressClose={() => {
            setModalVisibleUpdate(false);
            onRefresh();
          }}
          data={selectedSaving}
        />
      </Modal>

      {/* Detail Savings Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleDetail}
        onRequestClose={() => setModalVisibleDetail(false)}
      >
        <DetailSavingScreen
          onPressClose={() => {
            setModalVisibleDetail(false);
          }}
          data={selectedSaving}
        />
      </Modal>

      {/* Remove Confirmation Modal */}
      <ConfirmationModal
        isVisible={modalVisibleRemove}
        toggleModal={() => setModalVisibleRemove(false)}
        onConfirm={handleRemoveSaving}
        content={`Bạn có chắc muốn xóa sổ tiết kiệm ${
          selectedSaving ? '"' + selectedSaving.name + '"' : "này"
        } ?`}
      />

      {/* Closings Confirmation Modal */}
      <ConfirmationModal
        isVisible={modalVisibleClosings}
        toggleModal={() => setModalVisibleClosings(false)}
        onConfirm={handleClosingSaving}
        content={`Bạn có chắc muốn tất toán sổ tiết kiệm ${
          selectedSaving ? '"' + selectedSaving.name + '"' : "này"
        } ?`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  balanceContainer: {
    backgroundColor: "#fff",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  accountList: {
    flex: 1,
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#009fda",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});

export default Savings;

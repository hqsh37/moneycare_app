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
import EmptyItem from "../../../components/EmptyItem";
import AddSavingScreen from "./AddSavingScreen";
import Icon from "../../../components/Icon";
import SubSavingsItem from "./SubSavingsItem";
import ConfirmationModal from "../../../components/ConfirmationModal";
import Toast from "react-native-toast-message";
import { useDebounce } from "../../../hooks";
import { checkNetworkStatus } from "../../../services/asyncDataCloud";
import { asyncDataCloud } from "../../../handlers/dataAsyncHandle";
import { getSavingsData } from "../../../stores/savingStorage";
import Loading from "../../../components/Loading";

const Savings = ({ textSearch = "" }) => {
  const [savings, setSavings] = useState([]);
  const [filteredSavings, setFilteredSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const lowerSearch = removeVietnameseTones(debouncedValue.toLowerCase());
    const filtered = savings.filter((saving) =>
      removeVietnameseTones(saving.name.toLowerCase()).includes(lowerSearch)
    );
    setFilteredSavings(filtered);
  };

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .trim();
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

  const handleRemoveSaving = async () => {
    setModalVisibleRemove(false);
    setSavings((prev) => prev.filter((item) => item.id !== selectedSaving.id));
    Toast.show({
      type: "success",
      text1: "Thành công",
      text2: "Sổ tiết kiệm đã xoá thành công!",
    });
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
                  amount={formatCurrencyVND(item.amount)}
                  date={addMonthsToDate(item.date, Number(item.term))}
                  onPress={() => {
                    setSelectedSaving(item);
                    setModalVisibleRemove(true);
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

      {/* Remove Confirmation Modal */}
      <ConfirmationModal
        isVisible={modalVisibleRemove}
        toggleModal={() => setModalVisibleRemove(false)}
        onConfirm={handleRemoveSaving}
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
});

export default Savings;

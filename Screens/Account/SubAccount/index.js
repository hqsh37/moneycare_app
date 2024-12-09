import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { default as ModalNew } from "react-native-modal";
import Toast from "react-native-toast-message";

import ActionMenu from "./ActionMenu";
import SubAccountItem from "../../../components/SubAcountItem";
import EmptyItem from "../../../components/EmptyItem";
import AddAccountScreen from "./AddAccountScreen";
import UpdateAccountScreen from "./UpdateAccountScreen";
import ConfirmationModal from "../../../components/ConfirmationModal";
import Loading from "../../../components/Loading";
import {
  getAccountData,
  saveAccountData,
} from "../../../stores/accountStorage";
import { checkNetworkStatus } from "../../../services/asyncDataCloud";
import { asyncDataCloud } from "../../../handlers/dataAsyncHandle";
import { addHandleAsyncData } from "../../../services/asyncData";
import { useDebounce } from "../../../hooks";
import DetailAccountScreen from "./DetailAccountScreen";
import SpendingAlert from "./SpendingAlert";
import { isAccountInTransactions } from "../../../stores/transactionStorage";
import { isAccountInSavings } from "../../../stores/savingStorage";

const SubAccount = ({ textSearch = "" }) => {
  const [accounts, setAccounts] = useState([]);
  const [accountViews, setAccountViews] = useState([]);
  const [sumCash, setSumCash] = useState(0);
  const [isAcctionMenu, setAcctionMenu] = useState(false);
  const [acctionAccount, setAcctionAccount] = useState({});
  const [reload, setReload] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const debouncedValue = useDebounce(textSearch, 500);
  // modal visibility
  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleDetail, setModalVisibleDetail] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);
  const [modalVisibleAlert, setModalVisibleAlert] = useState(false);
  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const handleGetAccounts = async () => {
      setIsloading(true);
      await asyncData();
      const accountDatas = await getAccountData();

      if (accountDatas.length > 0) {
        // Tính tổng số tiền chỉ một lần
        const totalCash = accountDatas.reduce(
          (sum, account) => sum + Number(account.amount),
          0
        );
        setSumCash(totalCash);
        setAccounts(accountDatas);
        if (accountViews) {
          setAccountViews(accountDatas);
        }
      } else {
        setAccounts([]);
        setSumCash(0); // Đặt sumCash về 0 nếu không có dữ liệu
      }

      setIsloading(false);
    };

    handleGetAccounts();
  }, [reload]);

  useEffect(() => {
    const filteredAccounts = accounts.filter((account) => {
      const accountNameNoTones = removeVietnameseTones(
        account.name.toLowerCase()
      );
      const searchNoTones = removeVietnameseTones(debouncedValue);
      return accountNameNoTones.includes(searchNoTones);
    });
    setAccountViews(filteredAccounts);
  }, [debouncedValue]);

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

  const getIconByType = (type) => {
    switch (type) {
      case "bank":
        return <FontAwesome name="bank" size={35} color="#FFA500" />;
      case "cash":
        return <Ionicons name="cash-outline" size={35} color="#FFA500" />;
      default:
        return <FontAwesome5 name="question" size={35} color="#FFA500" />;
    }
  };

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Menu actions Accounts
  const toggleModal = (item) => {
    setAcctionMenu(!isAcctionMenu);
    setAcctionAccount(item);
  };

  const toggleModal1 = () => {
    setAcctionMenu(!isAcctionMenu);
  };

  // Update Account
  const handleUpdateAccount = () => {
    setModalVisibleUpdate(true);
  };

  // Remove Account
  const handleRemoveAccount = () => {
    setModalVisibleRemove(true);
  };

  const handleDataRemove = async (dataOld, accountId) => {
    const index = dataOld.findIndex((item) => item.id === accountId);
    if (index !== -1) {
      dataOld.splice(index, 1);
    }
    return dataOld;
  };

  const handleRemoving = async (accountId) => {
    try {
      const isAvailableinTransactions = await isAccountInTransactions(
        accountId
      );
      const isAvailableinSavings = await isAccountInSavings(accountId);

      if (isAvailableinTransactions) {
        Toast.show({
          type: "error",
          text1: "Thông báo",
          text2: "Tài khoản đang có giao dịch, không thể xoá!",
        });
        return false;
      }

      if (isAvailableinSavings) {
        Toast.show({
          type: "error",
          text1: "Thông báo",
          text2: "Tài khoản đang sử dụng sổ tiết kiệm, không thể xoá!",
        });
        return false;
      }

      await addHandleAsyncData({
        type: "delete",
        tbl: "account",
        id: accountId,
      });

      const dataOld = await getAccountData();

      const storageData = await saveAccountData(
        handleDataRemove(dataOld, accountId)
      );

      return storageData;
    } catch (error) {
      console.error("Error creating account:", error);
      return false;
    }
  };

  // Confirm and Remove Account
  const handleRemoveConfirm = async () => {
    setModalVisibleRemove(false);

    try {
      const success = await handleRemoving(acctionAccount.id);
      if (success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Tài khoản đã xoá thành công!",
        });
        setReload(!reload);

        // Cập nhật danh sách tài khoản
        const updatedAccounts = accounts.filter(
          (account) => account.id !== acctionAccount.id
        );
        setAccounts(updatedAccounts);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại!",
      });
    }

    setAcctionMenu(false);
  };

  // Detail Account
  const handleDetailAccount = () => {
    setAcctionMenu(!isAcctionMenu);
    setModalVisibleDetail(true);
  };

  // Detail Account
  const handleAlert = () => {
    setAcctionMenu(!isAcctionMenu);
    setModalVisibleAlert(true);
  };

  // Hàm này được gọi khi người dùng vuốt xuống để làm mới
  const onRefresh = () => {
    setReload(!reload);
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

  return (
    <View style={styles.wrapper}>
      {accounts.length === 0 || isloading ? (
        isloading ? (
          <Loading />
        ) : (
          <>
            <EmptyItem
              title="Bạn chưa có tài khoản nào!"
              btnTitle="Thêm tài khoản"
              onPress={() => setModalVisibleCreate(true)}
            />

            {/* Nút thêm tài khoản */}
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setModalVisibleCreate(true)}
            >
              <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Modal hiển thị màn hình AddAccountScreen */}
            <Modal
              animationType="slide"
              transparent={false}
              visible={modalVisibleCreate}
              onRequestClose={() => setModalVisibleCreate(false)}
            >
              <AddAccountScreen
                onPressClose={() => setModalVisibleCreate(false)}
              />
            </Modal>
          </>
        )
      ) : (
        <>
          {/* Hiển thị tổng tiền */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              Tổng tiền: {formatCurrencyVND(sumCash)}
            </Text>
          </View>

          <View style={styles.accountList}>
            <FlatList
              data={accountViews}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={<RefreshControl onRefresh={onRefresh} />}
              renderItem={({ item }) => {
                const IconType = getIconByType(item.type);
                return (
                  <SubAccountItem
                    name={item.name}
                    amount={formatCurrencyVND(item.amount)}
                    IconType={IconType}
                    onPress={() => toggleModal(item)}
                  />
                );
              }}
            />
          </View>

          {/* Nút thêm tài khoản */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisibleCreate(true)}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>

          {/* Modal tongle menu action */}
          <ModalNew
            isVisible={isAcctionMenu}
            style={styles.modal}
            onBackdropPress={() => setAcctionMenu(false)}
          >
            <ActionMenu
              onUpdate={handleUpdateAccount}
              onRemove={handleRemoveAccount}
              onDetail={handleDetailAccount}
              onAlert={handleAlert}
            />
          </ModalNew>
          {/* Modal Update */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisibleUpdate}
            onRequestClose={() => setModalVisibleUpdate(false)}
          >
            <UpdateAccountScreen
              onPressClose={() => {
                setModalVisibleUpdate(false);
                setAcctionMenu(false);
                setReload(!reload);
              }}
              name={acctionAccount.name}
              balance={acctionAccount.amount}
              id={acctionAccount.id}
              type={acctionAccount.type}
              descOld={acctionAccount.desc}
            />
          </Modal>

          {/* Modal Detail */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisibleDetail}
            onRequestClose={() => setModalVisibleDetail(false)}
          >
            <DetailAccountScreen
              onBack={() => {
                setModalVisibleDetail(false);
                setAcctionMenu(false);
                setReload(!reload);
              }}
              id={acctionAccount.id}
              type={acctionAccount.type}
              name={acctionAccount.name}
            />
          </Modal>

          {/* Modal Spend Alert */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisibleAlert}
            onRequestClose={() => setModalVisibleAlert(false)}
          >
            <SpendingAlert
              onBack={() => setModalVisibleAlert(false)}
              idAccount={acctionAccount.id}
            />
          </Modal>

          {/* Modal Remove */}
          <ConfirmationModal
            isVisible={modalVisibleRemove}
            toggleModal={() => {
              setModalVisibleRemove(false);
              setAcctionMenu(false);
            }}
            onConfirm={() => {
              handleRemoveConfirm();
            }}
          />
        </>
      )}
      {/* Modal hiển thị màn hình AddAccountScreen */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleCreate}
        onRequestClose={() => setModalVisibleCreate(false)}
      >
        <AddAccountScreen
          onPressClose={() => {
            setModalVisibleCreate(false);
            onRefresh();
          }}
        />
      </Modal>
      <Toast />
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
    justifyContent: "flex-end", // Hiển thị modal từ dưới lên
    margin: 0,
  },
});

export default SubAccount;

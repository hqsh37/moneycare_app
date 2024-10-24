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
import { getListAccounts, removeAaccount } from "../../../services/account";
import EmptyItem from "../../../components/EmptyItem";
import AddAccountScreen from "./AddAccountScreen";
import UpdateAccountScreen from "./UpdateAccountScreen";
import ConfirmationModal from "../../../components/ConfirmationModal";
import Loading from "../../../components/Loading";

const accountStorages = [];

const SubAccount = () => {
  const [accounts, setAccounts] = useState(accountStorages);
  const [sumCash, setSumCash] = useState(0);
  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);
  const [isAcctionMenu, setAcctionMenu] = useState(false);
  const [acctionAccount, setAcctionAccount] = useState({});
  const [reload, setReload] = useState(false);
  const [isloading, setIsloading] = useState(false);

  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(3000);

  useEffect(() => {
    const hanldeGetAccounts = async () => {
      setIsloading(true);
      const accountNews = [];
      const accountDatas = await getListAccounts();
      if (accountDatas) {
        setSumCash(0);
        accountDatas.forEach((account) => {
          setSumCash((pre) => pre + Number(account.sotien));
          accountNews.push({
            id: account.id,
            name: account.tentaikhoan,
            amount: account.sotien,
            type: account.loaitaikhoan,
            desc: account.diengiai,
          });
        });
        setAccounts(accountNews);
      } else if (accountDatas === 0) {
        setAccounts([]);
      }
      setIsloading(false);
    };

    hanldeGetAccounts();
  }, [reload]);

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

  // confirm remove account
  const handleRemoveConfirm = () => {
    setModalVisibleRemove(false);

    // handle deleteAccount
    const handleRemoveApi = async () => {
      return await removeAaccount(acctionAccount.id);
    };

    if (handleRemoveApi()) {
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Tài khoản xoá thành công!",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Xoá thất bại, Vui lòng kiểm tra lại!",
      });
    }

    const index = accounts.findIndex(
      (account) => account.id === acctionAccount.id
    );
    if (index !== -1) {
      accounts.splice(index, 1);
      setAccounts([...accounts]);
    }
    setAcctionMenu(false);
  };

  // Update Account
  const handleDetailAccount = () => {
    setAcctionMenu(!isAcctionMenu);
  };

  // Hàm này được gọi khi người dùng vuốt xuống để làm mới
  const onRefresh = () => {
    setReload(!reload);
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
              data={accounts}
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
                setReload(!reload);
              }}
            />
          </Modal>

          {/* Modal tongle menu action */}
          <ModalNew
            isVisible={isAcctionMenu}
            style={styles.modal}
            onBackdropPress={toggleModal1} // Đóng modal khi nhấn ra ngoài
          >
            <ActionMenu
              onUpdate={handleUpdateAccount}
              onRemove={handleRemoveAccount}
              onDetail={handleDetailAccount}
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

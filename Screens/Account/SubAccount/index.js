import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal, // Import Modal từ react-native
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { default as ModalNew } from "react-native-modal";

import ActionMenu from "./ActionMenu";
import SubAccountItem from "../../../components/SubAcountItem";
import { getListAccounts } from "../../../services/account";
import EmptyItem from "../../../components/EmptyItem";
import AddAccountScreen from "./AddAccountScreen";
import UpdateAccountScreen from "./UpdateAccountScreen";
import ConfirmationModal from "../../../components/ConfirmationModal";

const accountStorages = [];

const SubAccount = () => {
  const [accounts, setAccounts] = useState(accountStorages);
  const [sumCash, setSumCash] = useState(0);
  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false);
  const [isAcctionMenu, setAcctionMenu] = useState(false);
  const [acctionAccount, setAcctionAccount] = useState({});

  useEffect(() => {
    const hanldeGetAccounts = async () => {
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
    };

    hanldeGetAccounts();
  }, []);

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
    // Call API remove account
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

  return (
    <View style={styles.wrapper}>
      {accounts.length === 0 ? (
        <EmptyItem
          title="Bạn chưa có tài khoản nào!"
          btnTitle="Thêm tài khoản"
        />
      ) : (
        <>
          {/* Hiển thị tổng tiền */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              Tổng tiền: {formatCurrencyVND(sumCash)}
            </Text>
          </View>

          {/* Danh sách tài khoản */}
          <View style={styles.accountList}>
            <FlatList
              data={accounts}
              keyExtractor={(item) => item.id.toString()}
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
              onPressClose={() => setModalVisibleCreate(false)}
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
            onConfirm={() => handleRemoveConfirm()}
          />
        </>
      )}
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

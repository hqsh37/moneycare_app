import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import Icon from "../../components/Icon";
import { getAccountData } from "./../../stores/accountStorage";
import { checkNetworkStatus } from "../../services/asyncDataCloud";
import { asyncDataCloud } from "../../handlers/dataAsyncHandle";

const AccountAdd = ({
  selectedAccount,
  handleAccountSelect = () => {},
  onBack,
}) => {
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [fisrt, setFisrt] = useState(true);

  // Hàm kiểm tra kết nối mạng và đồng bộ dữ liệu
  const asyncData = async () => {
    const isConnected = await checkNetworkStatus();
    if (isConnected) {
      console.log("Device is online");
      await asyncDataCloud();
    } else {
      console.log("Device is offline");
    }
  };

  useEffect(() => {
    const handleGetAccounts = async () => {
      try {
        setIsLoading(true);
        if (!fisrt) {
          await asyncData();
        }
        const accountDatas = await getAccountData();
        setAccounts(accountDatas);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tài khoản:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handleGetAccounts();
    setFisrt(false);
  }, [refresh]);

  // Hàm làm mới dữ liệu
  const onRefresh = useCallback(() => {
    setRefresh((prev) => !prev);
  }, []);

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Giao diện item tài khoản
  const renderAccountItem = ({ item }) => (
    <TouchableOpacity
      style={styles.accountItem}
      onPress={() => handleAccountSelect(item)}
    >
      {item.type === "cash" ? (
        <Icon
          icon="cash-outline"
          iconLib="Ionicons"
          size={24}
          color="#FFA500"
          style={styles.icon}
        />
      ) : (
        <Icon
          iconLib="FontAwesome"
          icon="bank"
          size={24}
          color="#FFA500"
          style={styles.icon}
        />
      )}
      <View style={styles.accountDetails}>
        <Text style={styles.accountText}>{item.name}</Text>
        <Text style={styles.accountBalance}>
          {formatCurrencyVND(item.amount)}
        </Text>
      </View>
      {selectedAccount && selectedAccount.id === item.id ? (
        <Icon icon="checkmark" iconLib="Ionicons" size={20} color="blue" />
      ) : (
        <></>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm tài khoản</Text>
        <TouchableOpacity>
          <Icon icon="check" iconLib="AntDesign" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm theo tên tài khoản"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={accounts.filter((acc) =>
          acc.name.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={renderAccountItem}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#00aaff",
  },
  headerTitle: { fontSize: 18, color: "#fff" },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    margin: 10,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingLeft: 10,
  },
  selectedItem: {
    backgroundColor: "#e0f7fa",
  },
  icon: { marginRight: 15 },
  accountDetails: { flex: 1 },
  accountText: { fontSize: 16, fontWeight: "bold" },
  accountBalance: { fontSize: 14, color: "#555" },
});

export default AccountAdd;

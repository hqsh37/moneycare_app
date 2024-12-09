import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  RefreshControl,
} from "react-native";
import SpendIncomePlanAdd from "./SpendIncomePlanAdd";
import { getSpendIncomePlanData } from "../../../stores/spendIncomePlanStorage";
import { convertSpendIncomePlanData } from "./convertSpendIncomePlanData";
import { FlatList } from "react-native";
import HistoryChild from "./HistoryChild";
import Icon from "../../../components/Icon";
import Loading from "../../../components/Loading";
import Toast from "react-native-toast-message";

const FinancialReport = ({ onBack }) => {
  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const [plans, setPlans] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toastConfig = {
    custom_warning: (props) => <CustomToast {...props} type="warning" />,
  };

  useEffect(() => {
    const loading = async () => {
      setIsLoading(true);
      await handleLoadData();
      setIsLoading(false);
    };

    loading();
  }, []);

  const handleLoadData = async () => {
    const data = await getSpendIncomePlanData();
    const dataView = await convertSpendIncomePlanData(data);
    setPlans(dataView);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await handleLoadData();
    setRefreshing(false);
  };

  const handleSlectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dự chi/Dự thu</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setModalVisibleCreate(true)}
        >
          <Icon iconLib="Entypo" icon="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loading />
      ) : plans.length > 0 ? (
        <FlatList
          data={plans}
          renderItem={({ item }) => (
            <HistoryChild
              data={item}
              selectedItem={handleSlectItem}
              onReload={() => onRefresh()}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon
            iconLib="Ionicons"
            icon="document-outline"
            size={60}
            color="#666"
          />
          <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
        </View>
      )}

      {/* Modal create */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleCreate}
        onRequestClose={() => setModalVisibleCreate(false)}
      >
        <SpendIncomePlanAdd
          onBack={() => {
            setModalVisibleCreate(false);
          }}
          onReload={() => onRefresh()}
        />
      </Modal>
      <Toast config={toastConfig} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    backgroundColor: "#009fda",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    paddingLeft: 10,
  },
  menuButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default FinancialReport;

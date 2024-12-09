import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import Icon from "../../components/Icon";
import HistoryChild from "./HistoryChild";
import { convertDataTransaction } from "./convertDataTransaction";
import { checkNetworkStatus } from "../../services/asyncDataCloud";
import { asyncDataCloud } from "../../handlers/dataAsyncHandle";
import Loading from "../../components/Loading";

function HistoryScreen({ onBack = () => {} }) {
  const [viewDatas, setViewDatas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await asyncData();
    const data = await convertDataTransaction();
    setViewDatas(data);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true); // Bắt đầu trạng thái làm mới
    await loadData(); // Gọi lại hàm tải dữ liệu
    setRefreshing(false); // Kết thúc trạng thái làm mới
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
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử ghi</Text>
        <View></View>
      </View>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={viewDatas}
          renderItem={({ item }) => <HistoryChild data={item} />}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

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
  separation: {
    height: 1,
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
});

export default HistoryScreen;

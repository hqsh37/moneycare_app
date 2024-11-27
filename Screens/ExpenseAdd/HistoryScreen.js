import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "../../components/Icon";
import HistoryChild from "../../components/HistoryChild";
import { convertDataTransaction } from "./convertDataTransaction";

function HistoryScreen({ onBack = () => {} }) {
  const [viewDatas, setViewDatas] = useState([]);

  useEffect(() => {
    const testfunc = async () => {
      const data = await convertDataTransaction();
      setViewDatas(data);
    };

    testfunc();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử ghi</Text>
        <View></View>
      </View>
      <FlatList
        data={viewDatas}
        renderItem={({ item }) => <HistoryChild data={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
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

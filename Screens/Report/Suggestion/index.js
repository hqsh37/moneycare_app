import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getSuggestion } from "../../../services/suggestion";
import Loading from "../../../components/Loading";
import { convertDataTransaction } from "./convertDataTransaction";

const Suggestion = ({ onBack = () => {} }) => {
  const [comment, setComment] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    handleLoadData();
  }, []);

  const handleLoadData = async () => {
    setLoading(true);
    const transactions = await convertDataTransaction();
    const data = await getSuggestion(JSON.stringify(transactions));
    setComment(data.comment);
    setHint(data.hint);
    setLoading(false);
  };

  const handleGetNewSuggestions = async () => {
    // Gọi lại hàm load data để lấy gợi ý mới
    handleLoadData();
  };

  const handleAlert = () => {
    Alert.alert(
      "Mô tả",
      "Tính năng gợi ý AI sẽ phân tích dữ liệu chi tiêu của bạn và đưa ra lời khuyên cụ thể, giúp bạn quản lý tài chính hiệu quả hơn. Nhờ trí tuệ nhân tạo, bạn nhận được các đề xuất phù hợp với tình hình thực tế, hỗ trợ bạn tiết kiệm và đạt mục tiêu chi tiêu thông minh hơn."
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Icon name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tư vấn AI</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleAlert}>
          <Icon name="information-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={[
            styles.loadingContainer,
            { marginTop: screenHeight / 2 - 140 },
          ]}
        >
          <Loading />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Nhận xét từ AI:</Text>
          <View style={styles.box}>
            <Text>{comment}</Text>
          </View>

          <Text style={styles.sectionTitle}>Gợi ý cho tháng tới:</Text>
          <View style={styles.box}>
            <Text>{hint}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleGetNewSuggestions}
          >
            <Text style={styles.buttonText}>Lấy gợi ý khác</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f4f4f9",
  },
  header: {
    backgroundColor: "#009fda",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  iconButton: {
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#009fda",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default Suggestion;

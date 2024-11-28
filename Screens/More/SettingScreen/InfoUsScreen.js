import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "../../../components/Icon";

const InfoUsScreen = ({ onBack = () => {} }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Icon icon="arrow-back" iconLib="Ionicons" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Về chúng tôi</Text>
        <View />
      </View>
      <View style={styles.card}>
        <Image
          source={require("../../../assets/image/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Money Care</Text>
        <Text style={styles.version}>Phiên bản: 1.0.0.Prd</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginVertical: 30,
    marginHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: "#666",
  },
});

export default InfoUsScreen;

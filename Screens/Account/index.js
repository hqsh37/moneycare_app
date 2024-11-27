import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import SubAccount from "./SubAccount";
import Savings from "./Savings";
import Icon from "../../components/Icon";

const Account = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const [textSearch, setTextSearch] = useState(false);

  const tabData = [
    { name: "Tài Khoản", component: <SubAccount textSearch={textSearch} /> },
    { name: "Sổ Tiết Kiệm", component: <Savings textSearch={textSearch} /> },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.ctrlHeader}>
          {isSearch ? (
            <View style={styles.inputGroup}>
              <TouchableOpacity
                onPress={() => {
                  setIsSearch(false);
                  setTextSearch("");
                }}
              >
                <Icon
                  style={styles.icon}
                  icon="arrow-left"
                  iconLib="FontAwesome6"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Nhập tìm kiếm theo tên..."
                placeholderTextColor="#ccc"
                value={textSearch}
                onChangeText={setTextSearch}
              />
            </View>
          ) : (
            <View style={styles.navHeader}>
              <TouchableOpacity onPress={() => setIsSearch(true)}>
                <Icon
                  style={styles.icon}
                  icon="search"
                  iconLib="FontAwesome"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.textTile}>Tài khoản</Text>
              <Text style={styles.moreOptions}>{"     "} </Text>
            </View>
          )}
        </View>

        <View style={styles.navbar}>
          {tabData.map((tab, index) => (
            <TouchableOpacity
              key={tab.name}
              onPress={() => {
                setSelectedIndex(index);
                setIsSearch(false);
                setTextSearch("");
              }}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedIndex === index && styles.activeTabText,
                ]}
              >
                {tab.name}
              </Text>
              {selectedIndex === index && <View style={styles.underline} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Render selected screen */}
      <View style={styles.screenContainer}>
        {tabData[selectedIndex].component}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#009FDA",
  },
  ctrlHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  navHeader: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  textTile: {
    fontSize: 18,
    color: "#fff",
  },
  moreOptions: {
    fontSize: 20,
    color: "#fff",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  inputGroup: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    paddingRight: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#fff",
  },
  tab: {
    alignItems: "center",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  activeTabText: {
    color: "#FFF",
  },
  underline: {
    marginTop: 5,
    height: 2,
    width: "100%",
    backgroundColor: "#FFF",
  },
  screenContainer: {
    flex: 1,
  },
});

export default Account;

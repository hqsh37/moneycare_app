import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import SubAccount from "./SubAccount";
import SubSavings from "./SubSavings";
import SubAccumulate from "./SubAccumulate";

const Account = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabData = [
    { name: "Tài Khoản", component: SubAccount },
    { name: "Sổ Tiết Kiệm", component: SubSavings },
    { name: "Tích Lũy", component: SubAccumulate },
  ];

  return (
    <View style={styles.container}>
      <View></View>
      <View style={styles.navbar}>
        {tabData.map((tab, index) => {
          const isFocused = selectedIndex === index;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => setSelectedIndex(index)}
              style={styles.tab}
            >
              <Text style={[styles.tabText, isFocused && styles.activeTabText]}>
                {tab.name}
              </Text>
              {isFocused && <View style={styles.underline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.screenContainer}>
        {React.createElement(tabData[selectedIndex].component)}
      </View>

      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  navbar: {
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#009FDA",
  },
  tab: {
    alignItems: "center",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    fontWeight: "700",
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
  balanceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "black",
  },
  usageText: {
    fontSize: 13,
    fontWeight: "700",
    color: "black",
    marginTop: 10,
  },
  nameText: {
    fontSize: 13,
    fontWeight: "700",
    color: "black",
    marginTop: 10,
  },
  amountText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D9D9D9",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#D9D9D9",
    marginVertical: 20,
  },
});

export default Account;

import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import SubAccount from "./SubAccount";
import Savings from "./Savings";

const Account = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabData = [
    { name: "Tài Khoản", component: <SubAccount /> },
    { name: "Sổ Tiết Kiệm", component: <Savings /> },
  ];

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
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
});

export default Account;

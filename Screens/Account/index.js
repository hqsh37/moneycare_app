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
      <View style={styles.header}>
        <View style={styles.ctrlHeader}>
          <View>
            <Text>...</Text>
          </View>
          <Text style={styles.textTile}>Tài khoản</Text>
          <View>
            <Text>...</Text>
          </View>
        </View>
        <View style={styles.navbar}>
          {tabData.map((tab, index) => {
            const isFocused = selectedIndex === index;
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => setSelectedIndex(index)}
                style={styles.tab}
              >
                <Text
                  style={[styles.tabText, isFocused && styles.activeTabText]}
                >
                  {tab.name}
                </Text>
                {isFocused && <View style={styles.underline} />}
              </TouchableOpacity>
            );
          })}
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
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  textTile: {
    fontSize: 18,
    color: "#fff",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
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

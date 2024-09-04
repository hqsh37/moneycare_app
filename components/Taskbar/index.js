import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../../Pages/Home";
import Account from "../../Pages/Account";
import ExpenseAdd from "../../Pages/ExpenseAdd";
import More from "../../Pages/More";
import Report from "../../Pages/Report";

const Tab = createBottomTabNavigator();

const Taskbar = () => {
  const navigations = [
    { name: "Home", component: Home },
    { name: "Account", component: Account },
    { name: "ExpenseAdd", component: ExpenseAdd },
    { name: "Report", component: Report },
    { name: "More", component: More },
  ];

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        {navigations.map((nav, i) => (
          <Tab.Screen name={nav.name} component={nav.component} key={i} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 50,
  },
});

export default Taskbar;

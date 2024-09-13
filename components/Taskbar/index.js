import React, { useRef } from "react";
import { StyleSheet, Animated, Easing } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "../../Screens/Home";
import Account from "../../Screens/Account";
import ExpenseAdd from "../../Screens/ExpenseAdd";
import More from "../../Screens/More";
import Report from "../../Screens/Report";

const Tab = createBottomTabNavigator();

const Taskbar = () => {
  const navigations = [
    { name: "Home", component: Home, icon: "home-outline" },
    { name: "Account", component: Account, icon: "person-outline" },
    {
      name: "ExpenseAdd",
      component: ExpenseAdd,
      icon: "add-circle",
      isPlusIcon: true,
    },
    { name: "Report", component: Report, icon: "bar-chart-outline" },
    { name: "More", component: More, icon: "menu-outline" },
  ];

  // Tạo useRef cho từng tab để giữ giá trị scale riêng biệt
  const scaleValues = useRef(
    navigations.reduce((acc, nav) => {
      acc[nav.name] = new Animated.Value(1);
      return acc;
    }, {})
  ).current;

  const onTabPress = (tabName) => {
    Animated.sequence([
      Animated.timing(scaleValues[tabName], {
        toValue: 1.2,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValues[tabName], {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            const navItem = navigations.find((nav) => nav.name === route.name);
            const iconName = navItem?.icon;

            return (
              <Animated.View
                style={{ transform: [{ scale: scaleValues[route.name] }] }}
              >
                <Ionicons
                  name={iconName}
                  size={navItem?.isPlusIcon ? size + 20 : size}
                  color={color}
                />
              </Animated.View>
            );
          },
          tabBarActiveTintColor: "#009fda",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 55,
            paddingTop: 5,
            paddingBottom: 5,
          },
        })}
      >
        {navigations.map((nav, i) => (
          <Tab.Screen
            name={nav.name}
            component={nav.component}
            key={i}
            options={{
              tabBarLabel: nav.name === "ExpenseAdd" ? () => null : undefined,
            }}
            listeners={{
              tabPress: () => {
                onTabPress(nav.name);
              },
            }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 60,
  },
});

export default Taskbar;

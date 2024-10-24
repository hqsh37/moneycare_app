import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Icon from "../../../components/Icon";

function IconSelector({ iconList, onIconSelect }) {
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleIconSelect = (item) => {
    setSelectedIcon(item);
    onIconSelect(item); // Pass selected icon and iconLib back
  };

  return (
    <View>
      <FlatList
        data={iconList}
        renderItem={({ item }) => {
          const isSelected =
            selectedIcon?.icon === item.icon &&
            selectedIcon?.iconLib === item.iconLib;
          return (
            <TouchableOpacity
              key={item.icon}
              style={styles.iconItem}
              onPress={() => handleIconSelect(item)}
            >
              <Icon
                icon={item.icon}
                iconLib={item.iconLib}
                size={30}
                color={isSelected ? "#00aaff" : "gray"}
                style={styles.icon}
              />
              <Text style={styles.iconText}>{item.icon}</Text>
              {isSelected && (
                <Icon
                  icon="checkmark"
                  iconLib="Ionicons"
                  size={20}
                  color="#00aaff"
                />
              )}
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.icon + item.iconLib}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  icon: { marginRight: 15 },
  iconText: { flex: 1, fontSize: 16 },
});

export default IconSelector;

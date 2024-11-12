import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Icon from "../Icon";

export const renderCategoryItem = ({
  item,
  selectedCategory,
  expandedCategory,
  handleExpandCategory,
  handleCategorySelect,
}) => {
  const isSelected = selectedCategory?.id === item.id;

  if (item.children && item.children.length > 0) {
    return (
      <View>
        <View style={styles.categoryItem}>
          <TouchableOpacity onPress={() => handleExpandCategory(item.id)}>
            <Icon
              icon={
                expandedCategory === item.id ? "chevron-up" : "chevron-down"
              }
              iconLib="Ionicons"
              size={20}
              color="gray"
              style={styles.iconArrow}
            />
          </TouchableOpacity>
          <Icon
            icon={item.icon}
            iconLib={item.iconLib}
            size={24}
            color="#FFA500"
            style={styles.icon}
          />
          <TouchableOpacity
            style={styles.categoryTextContainer}
            onPress={() => handleCategorySelect(item)}
          >
            <Text style={styles.categoryText}>{item.name}</Text>
            {isSelected && (
              <Icon
                icon="checkmark"
                iconLib="Ionicons"
                size={20}
                color="blue"
              />
            )}
          </TouchableOpacity>
        </View>
        {expandedCategory === item.id &&
          item.children.map((child) => {
            const isChildSelected = selectedCategory?.id === child.id;
            return (
              <TouchableOpacity
                key={child.id}
                style={styles.childCategoryItem}
                onPress={() => handleCategorySelect(child)}
              >
                <Icon
                  icon={child.icon}
                  iconLib={child.iconLib}
                  size={20}
                  color="gray"
                  style={styles.icon}
                />
                <Text style={styles.categoryText}>{child.name}</Text>
                {isChildSelected && (
                  <Icon
                    icon="checkmark"
                    iconLib="Ionicons"
                    size={20}
                    color="blue"
                  />
                )}
              </TouchableOpacity>
            );
          })}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item)}
    >
      <Icon
        icon={item.icon}
        iconLib={item.iconLib}
        size={24}
        color="#FFA500"
        style={styles.icon}
      />
      <Text style={styles.categoryText}>{item.name}</Text>
      {isSelected && (
        <Icon icon="checkmark" iconLib="Ionicons" size={20} color="blue" />
      )}
    </TouchableOpacity>
  );
};

// Styles dùng chung cho render
const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingLeft: 10,
  },
  childCategoryItem: {
    paddingLeft: 45,
    paddingRight: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  iconArrow: {
    marginRight: 15,
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { marginRight: 15 },
  categoryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryText: { flex: 1, fontSize: 16 },
});

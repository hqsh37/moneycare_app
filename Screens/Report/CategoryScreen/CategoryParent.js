import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Icon from "../../../components/Icon";

function CategoryParent({ items, selectedCategory, handleCategorySelect }) {
  return (
    <View>
      <FlatList
        data={items}
        renderItem={({ item }) => {
          const isChildSelected = selectedCategory?.id === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.childCategoryItem}
              onPress={() => handleCategorySelect(item)}
            >
              <Icon
                icon={item.icon}
                iconLib={item.iconLib}
                size={20}
                color="gray"
                style={styles.icon}
              />
              <Text style={styles.categoryText}>{item.name}</Text>
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
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  childCategoryItem: {
    paddingLeft: 25,
    paddingRight: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { marginRight: 15 },
  categoryText: { flex: 1, fontSize: 16 },
});

export default CategoryParent;

import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

function ButtonAdd({
  onPress,
  primary = false,
  outline = false,
  small = false,
  large = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  style,
  width, // Thêm thuộc tính width
  ...passProps
}) {
  const buttonStyles = [
    styles.button,
    primary && styles.primary,
    outline && styles.outline,
    small && styles.small,
    large && styles.large,
    disabled && styles.disabled,
    { width }, // Áp dụng width nếu có
    style,
  ];

  const textStyles = [styles.text, outline && styles.outlineText];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={disabled ? null : onPress}
      disabled={disabled}
      {...passProps}
    >
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <Text style={textStyles}>{children}</Text>
      {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "#009fda", // Màu mặc định
  },
  primary: {
    backgroundColor: "#009fda",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#009fda",
  },
  outlineText: {
    color: "#009fda", // Màu chữ cho outline
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default ButtonAdd;

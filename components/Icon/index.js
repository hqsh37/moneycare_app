import React from "react";
import { TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";

function Icon({
  icon,
  iconLib,
  size = 24,
  color = "black",
  style = {},
  onPress = false,
}) {
  const IconComponent = () => {
    switch (iconLib) {
      case "FontAwesome":
        return (
          <FontAwesome name={icon} size={size} color={color} style={style} />
        );
      case "FontAwesome5":
        return (
          <FontAwesome5 name={icon} size={size} color={color} style={style} />
        );
      case "Ionicons":
        return <Ionicons name={icon} size={size} color={color} style={style} />;
      case "FontAwesome6":
        return (
          <FontAwesome6 name={icon} size={size} color={color} style={style} />
        );
      case "MaterialIcons":
        return (
          <MaterialIcons name={icon} size={size} color={color} style={style} />
        );
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={icon}
            size={size}
            color={color}
            style={style}
          />
        );
      case "AntDesign":
        return (
          <AntDesign name={icon} size={size} color={color} style={style} />
        );
      case "Feather":
        return <Feather name={icon} size={size} color={color} style={style} />;
      case "EvilIcons":
        return (
          <EvilIcons name={icon} size={size} color={color} style={style} />
        );
      case "Fontisto":
        return <Fontisto name={icon} size={size} color={color} style={style} />;
      default:
        return null; // Trả về null nếu thư viện biểu tượng không được hỗ trợ
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <IconComponent />
    </TouchableOpacity>
  );
}

export default Icon;

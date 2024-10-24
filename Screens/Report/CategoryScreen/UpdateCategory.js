import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "../../../components/Icon";

function UpdateCategory({
  title,
  item,
  parent = {},
  parents = [],
  onBack = false,
}) {
  const [categoryName, setCategoryName] = useState(item.name);
  const [modalVisibleCategory, setModalVisibleCategory] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={() => console.log("Save pressed")}>
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chọn icon */}
      <View style={styles.mainContent}>
        <View style={styles.iconSection}>
          <TouchableOpacity style={styles.iconContainer}>
            <Icon
              icon={item.icon}
              iconLib={item.iconLib}
              size={40}
              color="#FFA500"
            />
            <Text style={styles.iconLabel}>Chọn icon</Text>
          </TouchableOpacity>
          <View style={styles.iconText}>
            <TextInput
              style={styles.input}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Nhập tên hạng mục"
            />
          </View>
        </View>

        {/* Chọn hạng mục cha */}
        {parent !== false ? (
          <TouchableOpacity
            style={styles.iconSection}
            onPress={() => setModalVisibleCategory(true)}
          >
            <View style={styles.iconContainer}>
              {parent ? (
                <>
                  <Icon
                    icon={parent.icon}
                    iconLib={parent.iconLib}
                    size={40}
                    color="#FFA500"
                  />
                </>
              ) : (
                <Icon
                  icon="question"
                  iconLib="AntDesign"
                  size={40}
                  color="#FFA500"
                />
              )}
            </View>
            <View style={styles.iconText}>
              {parent ? (
                <>
                  <Text style={styles.iconLabel}>Chọn hạng mục cha</Text>
                  <Text style={styles.txthangmuc}>{parent.name}</Text>
                </>
              ) : (
                <Text style={styles.label}>Chọn hạng mục cha</Text>
              )}
            </View>
            <Icon icon="right" iconLib="AntDesign" size={25} color="#ccc" />
          </TouchableOpacity>
        ) : (
          <></>
        )}

        {/* Diễn giải */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diễn giải</Text>
          <TextInput style={styles.input} placeholder="Nhập diễn giải" />
        </View>

        {/* Nút hành động */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons name="trash" size={24} color="red" />
            <Text style={styles.deleteText}>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="save" size={24} color="#fff" />
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Modal category */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisibleCategory}
        onRequestClose={() => setModalVisibleCategory(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Chọn hạng mục</Text>
          <FlatList
            data={parents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setCategoryName(item.name);
                  setModalVisibleCategory(false);
                }}
              >
                <Icon
                  icon={item.icon}
                  iconLib={item.iconLib}
                  size={40}
                  color="#FFA500"
                />
                <Text style={styles.optionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00aaff",
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
  },
  mainContent: {
    paddingHorizontal: 15,
  },
  iconSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
  },
  iconLabel: {
    color: "gray",
    fontSize: 12,
  },
  iconText: {
    flex: 1,
  },
  inputGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 0.45,
    justifyContent: "center",
  },
  deleteText: {
    color: "red",
    marginLeft: 5,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00aaff",
    borderRadius: 5,
    padding: 10,
    flex: 0.45,
    justifyContent: "center",
  },
  saveText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
});

export default UpdateCategory;

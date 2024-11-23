import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CustomToast = ({ text1, text2, props }) => {
  const { data } = props || {};

  return (
    <View style={styles.container}>
      {/* Left colored bar */}
      <View style={styles.borderLeft} />

      {/* Content area */}
      <View style={styles.contentContainer}>
        {text1 ? <Text style={styles.text1}>{text1}</Text> : null}

        {data && Array.isArray(data)
          ? data.map((item, index) => (
              <Text key={index} style={styles.line}>
                <Text style={styles.label}>{item.label}: </Text>
                <Text style={styles.value}>{item.value}</Text>
              </Text>
            ))
          : text2
          ? text2.split("\n").map((line, index) => {
              const regex = /<strong>(.*?)<\/strong>: (.*)/;
              const match = regex.exec(line);

              if (match) {
                const label = match[1];
                const value = match[2];
                return (
                  <Text key={index} style={styles.line}>
                    <Text style={styles.label}>{label}: </Text>
                    <Text style={styles.value}>{value}</Text>
                  </Text>
                );
              } else {
                return (
                  <Text key={index} style={styles.line}>
                    {line}
                  </Text>
                );
              }
            })
          : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "90%",
    minHeight: 60,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  borderLeft: {
    width: 8,
    backgroundColor: "#28a745", // Green color for success
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  text2: {
    fontSize: 14,
    color: "#000",
  },
  line: {
    fontSize: 14,
    color: "#000",
    marginBottom: 2,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    fontWeight: "normal",
  },
});

export default CustomToast;

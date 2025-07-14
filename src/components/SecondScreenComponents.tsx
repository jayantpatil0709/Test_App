import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const Component4 = () => {
  return (
    <View style={styles.component}>
      <Text style={styles.text}>Component 4</Text>
    </View>
  );
};

export const Component5 = () => {
  return (
    <View style={[styles.component, { backgroundColor: "#9575cd" }]}>
      <Text style={styles.text}>Component 5</Text>
    </View>
  );
};

export const Component6 = () => {
  return (
    <View style={[styles.component, { backgroundColor: "#ffb74d" }]}>
      <Text style={styles.text}>Component 6</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  component: {
    padding: 20,
    margin: 10,
    borderRadius: 8,
    backgroundColor: "#4db6ac",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    width: "90%",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

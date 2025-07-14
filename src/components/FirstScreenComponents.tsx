import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const Component1 = () => {
  return (
    <View style={styles.component}>
      <Text style={styles.text}>Component 1</Text>
    </View>
  );
};

export const Component2 = () => {
  return (
    <View style={[styles.component, { backgroundColor: "#e57373" }]}>
      <Text style={styles.text}>Component 2</Text>
    </View>
  );
};

export const Component3 = () => {
  return (
    <View style={[styles.component, { backgroundColor: "#81c784" }]}>
      <Text style={styles.text}>Component 3</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  component: {
    padding: 20,
    margin: 10,
    borderRadius: 8,
    backgroundColor: "#64b5f6",
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

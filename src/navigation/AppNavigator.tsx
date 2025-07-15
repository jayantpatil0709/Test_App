import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import FirstScreen from "../screens/FirstScreen";
import SecondScreen from "../screens/SecondScreen";
import { configureLibraryNavigationRoot } from "@/react-native-product-tour";
import { navigationRef } from "@/react-native-product-tour";

// Define the stack navigator param list types
export type RootStackParamList = {
  FirstScreen: undefined;
  SecondScreen: undefined;
};

// Create the stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

configureLibraryNavigationRoot({
  index: 0,
  routes: [{ name: "FirstScreen" }],
});

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="FirstScreen">
        <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          options={{ title: "First Screen" }}
        />
        <Stack.Screen
          name="SecondScreen"
          component={SecondScreen}
          options={{ title: "Second Screen" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

export const tourConfig = {
  main: {
    screenMap: {
      1: "FirstScreen",
      2: "FirstScreen",
      3: "FirstScreen",
      4: "SecondScreen",
      5: "SecondScreen",
      6: "SecondScreen",
    },
    introModal: {
      screen: "FirstScreen",
      tourKey: "main",
      title: "Welcome to Our Demo App!",
      content: "This guided tour will walk you through all six components across two screens. You'll see different styling techniques and navigation patterns in React Native. Press 'Start Tour' to begin!",
      buttonText: "Start Tour",
    },
    extroModal: {
      screen: "FirstScreen", // The screen where the extro modal will appear
      tourKey: "main",
      title: "Tour Completed!",
      content: "Congratulations! You've successfully explored all six components across both screens. You've learned about different styling approaches and screen navigation in React Native. Feel free to continue exploring the app on your own!",
      buttonText: "Finish",
    },
  },
};

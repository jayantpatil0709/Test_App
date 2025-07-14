import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/colors";

const BeaconLight = ({ size = 10, color = COLORS.primary }) => {
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const opacityAnim1 = useRef(new Animated.Value(1)).current;

  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const opacityAnim2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      const ripple1 = Animated.loop(
        Animated.parallel([
          Animated.timing(scaleAnim1, {
            toValue: 2.5,
            duration: 1800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim1, {
            toValue: 0,
            duration: 1800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      const ripple2 = Animated.loop(
        Animated.sequence([
          Animated.delay(900),
          Animated.parallel([
            Animated.timing(scaleAnim2, {
              toValue: 2.5,
              duration: 3000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim2, {
              toValue: 0,
              duration: 1800,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      );

      ripple1.start();
      ripple2.start();

      return () => {
        ripple1.stop();
        ripple2.stop();
      };
    };

    const cleanup = pulse();
    return cleanup;
  }, []);

  return (
    <View style={styles.container}>
      {/* Ripple 1 */}
      <Animated.View
        style={[
          styles.ripple,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            transform: [{ scale: scaleAnim1 }],
            opacity: opacityAnim1,
          },
        ]}
      />
      {/* Ripple 2 */}
      <Animated.View
        style={[
          styles.ripple,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            transform: [{ scale: scaleAnim2 }],
            opacity: opacityAnim2,
          },
        ]}
      />
      {/* Constant Dot */}
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

export default BeaconLight;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  ripple: {
    position: "absolute",
  },
});

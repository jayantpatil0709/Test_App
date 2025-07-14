import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../assets/styles/tooltip.styles";
import { COLORS } from "../constants/colors";
import { useTour } from "../context/TourContext";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: "top" | "bottom" | "left" | "right" | "auto";
  heading: string;
  content: string;
  stepNumber: number;
  totalSteps: number;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
};

const Tooltip = ({
  x,
  y,
  width,
  height,
  direction,
  heading,
  content,
  stepNumber,
  totalSteps,
  onClose,
  onNext,
  onPrevious,
}: Props) => {
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTooltipSize({ width, height });
  };

  const getSafeDirection = (): typeof direction => {
    const margin = 25;
    const { width: screenWidth, height: screenHeight } =
      Dimensions.get("window");
    const tooltipW = tooltipSize.width || 200;
    const tooltipH = tooltipSize.height || 100;

    const fitsTop = y - tooltipH - margin >= 0;
    const fitsBottom = y + height + tooltipH + margin <= screenHeight;
    const fitsLeft = x - tooltipW - margin >= 0;
    const fitsRight = x + width + tooltipW + margin <= screenWidth;

    switch (direction) {
      case "top":
        if (fitsTop) return "top";
        break;
      case "bottom":
        if (fitsBottom) return "bottom";
        break;
      case "left":
        if (fitsLeft) return "left";
        break;
      case "right":
        if (fitsRight) return "right";
        break;
    }

    if (fitsTop) return "top";
    if (fitsBottom) return "bottom";
    if (fitsLeft) return "left";
    if (fitsRight) return "right";

    return direction;
  };

  const getTooltipPosition = () => {
    const direction = getSafeDirection();
    const margin = 25;
    const { width: screenWidth } = Dimensions.get("window");
    const highlightCenterX = x + width / 2;

    switch (direction) {
      case "top":
        let topLeft = highlightCenterX - tooltipSize.width / 2;
        if (topLeft < margin) topLeft = margin;
        if (topLeft + tooltipSize.width > screenWidth - margin) {
          topLeft = screenWidth - margin - tooltipSize.width;
        }

        return {
          left: topLeft,
          top: y - tooltipSize.height - margin,
        };
      case "bottom":
        let bottomLeft = highlightCenterX - tooltipSize.width / 2;
        if (bottomLeft < margin) bottomLeft = margin;
        if (bottomLeft + tooltipSize.width > screenWidth - margin) {
          bottomLeft = screenWidth - margin - tooltipSize.width;
        }

        return {
          left: bottomLeft,
          top: y + height + margin,
        };
      case "left":
        return {
          left: x - tooltipSize.width - margin - 5,
          top: y + height / 2 - tooltipSize.height / 2,
        };
      case "right":
        return {
          left: x + width + margin + 5,
          top: y + height / 2 - tooltipSize.height / 2,
        };
      default:
        return {};
    }
  };

  const getArrowStyle = (direction: string) => {
    const tooltipStyle = getTooltipPosition();
    const highlightCenterX = x + width / 2;

    switch (direction) {
      case "top":
        const topArrowLeft = highlightCenterX - (tooltipStyle.left || 0) - 10;
        return {
          arrow: {
            position: "absolute",
            left: Math.max(10, Math.min(topArrowLeft, tooltipSize.width - 30)),
            top: tooltipSize.height,
            width: 0,
            height: 0,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderTopWidth: 12,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: COLORS.white,
            borderBottomWidth: 0,
            borderBottomColor: "transparent",
          },
        };
      case "bottom":
        const bottomArrowLeft =
          highlightCenterX - (tooltipStyle.left || 0) - 10;
        return {
          arrow: {
            position: "absolute",
            left: Math.max(
              10,
              Math.min(bottomArrowLeft, tooltipSize.width - 30)
            ),
            top: -12,
            width: 0,
            height: 0,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderBottomWidth: 12,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: COLORS.white,
            borderTopWidth: 0,
            borderTopColor: "transparent",
          },
        };
      case "left":
        return {
          arrow: {
            position: "absolute",
            right: 12,
            top: tooltipSize.height / 2 - 10,
            width: 0,
            height: 0,
            borderTopWidth: 10,
            borderBottomWidth: 10,
            borderLeftWidth: 12,
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderLeftColor: COLORS.white,
            borderRightWidth: 0,
            borderRightColor: "transparent",
          },
        };
      case "right":
        return {
          arrow: {
            position: "absolute",
            left: 12,
            top: tooltipSize.height / 2 - 10,
            width: 0,
            height: 0,
            borderTopWidth: 10,
            borderBottomWidth: 10,
            borderRightWidth: 12,
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderRightColor: COLORS.white,
            borderLeftWidth: 0,
            borderLeftColor: "transparent",
          },
        };
      default:
        return { arrow: {} };
    }
  };
  const { endTour } = useTour();

  const handleDone = () => {
    endTour();
  };

  const tooltipStyle = getTooltipPosition();
  const safeDirection = getSafeDirection();
  const arrowStyle = getArrowStyle(safeDirection);
  return (
    <View style={[styles.tooltipContainer, tooltipStyle]}>
      <View
        style={[styles.tooltipArrowBase, arrowStyle.arrow, { zIndex: 1001 }]}
      />

      <View style={styles.tooltipContent} onLayout={handleLayout}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.tooltipHeading}>{heading}</Text>
        <Text style={styles.tooltipText}>{content}</Text>
        <View style={styles.navButtonContainer}>
          <Text style={styles.tooltipStep}>
            {stepNumber} of {totalSteps}
          </Text>

          <View style={styles.navButtonContainer}>
            {stepNumber > 1 && (
              <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            {stepNumber < totalSteps && (
              <TouchableOpacity onPress={onNext} style={styles.navButton}>
                <Text style={styles.navButtonText}>Next</Text>
              </TouchableOpacity>
            )}

            {stepNumber === totalSteps && (
              <TouchableOpacity
                onPress={() => handleDone()}
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Tooltip;

import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  tooltipContainer: {
    position: "absolute",
    zIndex: 1000,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  tooltipArrowBase: {
    width: 0,
    height: 0,
  },
  tooltipContent: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    minWidth: 200,
    maxWidth: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    position: "relative",
  },
  tooltipHeading: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  tooltipText: {
    color: COLORS.text,
    fontSize: 15,
  },
  tooltipStep: {
    color: COLORS.primary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
    zIndex: 1000,
    backgroundColor: "transparent",
  },
  navButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  navButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 5,
  },
  navButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});

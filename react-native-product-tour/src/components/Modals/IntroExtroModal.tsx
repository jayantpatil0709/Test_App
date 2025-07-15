import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/intro.modal.styles";
import { COLORS } from "../../constants/colors";
import { useTour } from "../../context/TourContext";
import { navigationRef } from "../../utils/Navigation"; // ✅ Use navigationRef

type Props = {
  isVisible: boolean;
  onClose: () => void;
  mode: "intro" | "extro";
  showContinueOption?: boolean;
  modalData: {
    title: string;
    content: string;
    buttonText: string;
    screen?: string;
    tourKey: string;
  };
};

const IntroExtroModal = ({
  isVisible,
  onClose,
  mode,
  showContinueOption = false,
  modalData,
}: Props) => {
  const { startTour, continueTour, setIsTourActive, resetToRoot, setActiveTourKey } = useTour();
  const { title, content, buttonText, screen, tourKey } = modalData;

  const handleNavigate = (screen: string) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(screen as never);
    }
  };

  const handleStartTour = () => {
    onClose();
    startTour(handleNavigate, tourKey);
  };

  const handleContinueTour = () => {
    onClose();
    continueTour(handleNavigate, tourKey);
  };

  const handleFinishTour = () => {
    onClose();
    setIsTourActive(false);
    resetToRoot();
    setActiveTourKey(null);
  };

  const handlePressForClose = () => {
    setActiveTourKey(null);
    setIsTourActive(false);
    onClose();
  };

  const handlePress = () => {
    if (mode === "intro") {
      handleStartTour();
    } else if (mode === "extro") {
      handleFinishTour();
    }
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handlePressForClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.modalText}>{title}</Text>
          <Text style={styles.modalContentText}>{content}</Text>

          {showContinueOption && mode === "intro" ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={[styles.button, { flex: 1, minWidth: "48%" }]}
                onPress={handleContinueTour}
              >
                <Text style={styles.buttonText}>Continue Tour</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    flex: 1,
                    minWidth: "48%",
                    backgroundColor: "#fff",
                    borderColor: "#000",
                    borderWidth: 1,
                  },
                ]}
                onPress={handleStartTour}
              >
                <Text style={[styles.buttonText, { color: COLORS.text }]}>
                  Start New Tour
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default IntroExtroModal;

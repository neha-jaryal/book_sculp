import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Or 'FontAwesome'
import { Colors, Sizes } from "../Constants";
import { TextComponent } from "./TextComponent";
import moment from "moment";

export const BubblesModal = (props) => {
  const {
    showOptionsModal,
    setShowOptionsModal,
    message,
    handleDeleteChat,
    handleDeleteBothChat,
    handleCopy,
    handleEditing,
    optionForBoth,
  } = props;

  const closeModal = () => {
    setShowOptionsModal(false);
  };

  const bubbleOption = [
    {
      label: "Copy",
      icon: "copy-outline",
      color: Colors?.black,
      onPress: handleCopy,
      show: true,
    },
    {
      label: "Delete for me",
      icon: "trash-outline",
      color: Colors?.black,
      onPress: handleDeleteChat,
      show: true,
    },
    {
      label: "Delete from both side",
      icon: "trash-outline",
      color: Colors?.black,
      onPress: handleDeleteBothChat,
      show: optionForBoth,
    },
    {
      label: "Edit",
      icon: "pencil",
      color: Colors?.black,
      onPress: handleEditing,
      show: optionForBoth,
    },
    {
      label: "Close",
      icon: "close-circle",
      color: Colors?.red,
      show: true,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Modal for Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptionsModal}
        onRequestClose={closeModal}
        collapsable={true}
        onMagicTap={closeModal}
        supportedOrientations={["portrait", "landscape"]}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View
              style={styles.modalContainer}
              {...PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderMove: (_, gestureState) => {
                  // Optional: add visual feedback while dragging down
                },
                onPanResponderRelease: (_, gestureState) => {
                  // Swipe down threshold (adjust 100 as needed)
                  if (gestureState.dy > 100) {
                    closeModal();
                  }
                },
              }).panHandlers}
            >
              <TouchableOpacity style={styles.messageBubble}>
                <TextComponent
                  text={message?.text || "This message has no text content"}
                  // color={Colors?.darkgrey}
                  size={Sizes?.xs}
                  fontWeight={"400"}
                  // style={{ width: "55%" }}
                />
                <Text style={styles.timestamp}>
                  {moment(message?.createdAt).format("HH:MM A")}
                </Text>
              </TouchableOpacity>

              {/* <View style={styles.reactionsContainer}>
              {["👍", "❤️", "😂", "😲", "😢", "🙏"].map((emoji, index) => (
                <Text key={index} style={styles.emoji}>
                  {emoji}
                </Text>
              ))}
              <TouchableOpacity style={styles.moreEmoji}>
                <Text>+</Text>
              </TouchableOpacity>
            </View> */}
              {/* Message action buttons */}
              {bubbleOption.map((action, index) =>
                action?.show ? (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalOption}
                    onPress={
                      action.onPress
                        ? action.onPress
                        : () => {
                            setShowOptionsModal(false);
                          }
                    }
                  >
                    <Icon
                      name={action.icon}
                      size={20}
                      color={action.color || "black"}
                    />
                    <Text
                      style={[
                        styles.modalOptionText,
                        action.color && { color: action.color },
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ) : null,
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  messageBubble: {
    backgroundColor: Colors?.lightGray,
    // opacity: 0.9,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 8,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "flex-start",
  },
  timestamp: {
    fontSize: 12,
    color: Colors?.black,
    // position: "absolute",
    // right: 5,
    paddingTop: 10,
    // paddingHorizontal: 5,
    textAlign: "right",
  },
  reactionsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  emoji: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  moreEmoji: {
    fontSize: 24,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 5,
    borderRadius: 15,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors?.white,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginHorizontal: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  modalOptionText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "500",
  },
  closeModalButton: {
    alignItems: "center",
    marginVertical: 15,
  },
  closeModalText: {
    fontSize: 18,
  },
});

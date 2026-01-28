import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
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
      color: Colors?.darkgrey,
      onPress: handleCopy,
      show: true,
    },
    {
      label: "Delete for me",
      icon: "trash-outline",
      color: Colors?.darkgrey,
      onPress: handleDeleteChat,
      show: true,
    },
    {
      label: "Delete from both side",
      icon: "trash-outline",
      color: Colors?.darkgrey,
      onPress: handleDeleteBothChat,
      show: optionForBoth,
    },
    {
      label: "Edit",
      icon: "pencil",
      color: Colors?.darkgrey,
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
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.messageBubble}>
              <TextComponent
                text={message?.text}
                size={Sizes?.l}
                fontWeight="400"
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
                    size={24}
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
              ) : null
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  messageBubble: {
    backgroundColor: Colors?.yellow,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 10,
  },
  timestamp: {
    fontSize: 12,
    color: Colors?.darkgrey,
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
    backgroundColor: "#fff",
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  modalOptionText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "600",
  },
  closeModalButton: {
    alignItems: "center",
    marginTop: 15,
  },
  closeModalText: {
    fontSize: 18,
    color: "gray",
  },
});

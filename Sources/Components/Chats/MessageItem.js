// MessageItem.js
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getData, storageKey } from "../../Utility/Storage";
import { Colors } from "../../Constants";

const MessageItem = ({ message, userId }) => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  //   console.log("currentUser----", currentUser);

  // const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const isCurrentUser = message?.user?._id == userId;
//   console.log("messagemessage----", message);
  const seen = message.status === "seen";

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUser : styles.otherUser,
      ]}
    >
      <Image source={{ uri: message.user.avatar }} style={styles.avatar} />

      <View
        style={{
          ...styles.messageContent,
          backgroundColor: isCurrentUser ? Colors?.themeColor : Colors?.white,
          borderTopLeftRadius: !isCurrentUser ? 0 : 15,
          borderTopRightRadius: isCurrentUser ? 0 : 15,
        }}
      >
        {/* {!isCurrentUser && (
          <Text style={styles.userName}>{message.user.name}</Text>
        )} */}
        <Text
          style={{
            ...styles.messageText,
            color: isCurrentUser ? Colors?.white : Colors?.black,
          }}
        >
          {message.text}
        </Text>
        <View style={styles.footer}>
          <Text
            style={{
              fontSize: 12,
              color: isCurrentUser ? Colors?.white : Colors?.darkgrey,
            }}
          >
            {message.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {isCurrentUser && (
            <Ionicons
              name={
                message.status == "sent" ? "checkmark" : "checkmark-done-sharp"
              }
              style={
                message.status == "sent" || message.status == "delivered"
                  ? styles.tick
                  : styles.tickRead
              }
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-start",
  },
  currentUser: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  otherUser: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  messageContent: {
    maxWidth: "75%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  userName: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors?.themeColor,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 15,
    marginBottom: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 10,
  },

  tick: {
    color: Colors?.white,
    fontSize: 20,
    marginLeft: 5,
    fontWeight: 700,
  },
  tickRead: {
    color: Colors?.pink,
    fontSize: 20,
    marginLeft: 5,
    fontWeight: 700,
  },
});

export default MessageItem;

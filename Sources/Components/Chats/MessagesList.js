// MessagesList.js
import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, Keyboard, StyleSheet, Text, View } from "react-native";
import MessageItem from "./MessageItem"; // Custom Message component
import { ChatContext } from "../../Context/ChatContext";
import { AuthContext } from "../../Context/AuthContext";
import {
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  deleteField,
  serverTimestamp,
  collection,
  getDoc,
  setDoc,
  arrayUnion,
  Timestamp,
  arrayRemove,
  increment,
  writeBatch,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../Utility/Firebase";
import { Colors } from "../../Constants";
import moment from "moment";

const MessagesList = (props) => {
  const { setLoading, userId } = props;
  const [messages, setMessages] = useState([]);
  const [userDeletedMessages, setUserDeletedMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const flatListRef = useRef();

  useEffect(() => {
    //   setLoading(true)
    // Fetch the messages from the "chats" collection
    const unSub = onSnapshot(doc(db, "chats", data?.chatId), (doc) => {
      console.log("onSnapshot calling-----");
      if (doc.exists()) {
        let msgArr = doc.data().messages;
        let filteredMsg = msgArr.filter(
          (msg) => !msg?.deletedFor?.includes(currentUser.uid)
        );
        let messageData = filteredMsg?.map((msg) => {
          return {
            _id: msg._id || msg.id,
            text: msg.text,
            createdAt: msg.date?.toDate(),
            status: msg?.status,
            user: {
              _id: msg.user._id,
              name: msg.user.name,
              avatar:
                msg.user.avatar ||
                "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
            },
          };
        });
        const sortedMessages = messageData.sort(
          (a, b) => b.createdAt - a.createdAt
        );
        setMessages(sortedMessages);
      }
    });

    // Fetch the deleted messages for the current user
    const userRef = doc(db, "users", currentUser.uid);
    const unSubUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserDeletedMessages(doc.data().deletedMessages || []);
      }
    });

    setLoading(false);

    return () => {
      unSub();
      unSubUser();
    };
  }, [data?.chatId, currentUser.uid, setLoading]);

  const formatDate = (date) => {
    return moment(date).format("Do MMM YYYY");
  };

  const groupMessagesWithDateHeader = (messages) => {
    const groupedMessages = [];
    let lastMessageDate = null;

    messages.forEach((msg) => {
      const messageDate = new Date(msg.createdAt);
      const formattedDate = formatDate(messageDate);
      if (formattedDate !== lastMessageDate) {
        groupedMessages.push({
          date: formattedDate,
          messages: [msg],
        });
      } else {
        groupedMessages[groupedMessages.length - 1].messages.push(msg);
      }
      lastMessageDate = formattedDate;
    });

    return groupedMessages;
  };

  const messageList = messages.filter(
    (message) => !userDeletedMessages.includes(message._id)
  );
  const groupedMessages = groupMessagesWithDateHeader(messageList.reverse());
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  return (
    <View style={styles.container}>
      <FlatList
        data={groupedMessages}
        ref={flatListRef}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.dateTitle}>{item.date}</Text>
            <FlatList
              ref={flatListRef}
              data={item.messages}
              renderItem={({ item, index }) => (
                <MessageItem message={item} key={item._id} userId={userId} />
              )}
              keyExtractor={(item) => item._id.toString()}
               
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>

    // <FlatList
    //   data={groupedMessages?.message}
    //   renderItem={({ ele }) => (
    //     <MessageItem message={ele} key={ele._id} userId={userId} />
    //   )}
    //   keyExtractor={(item) => item._id.toString()}
    //   inverted
    // />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 5,
    color: "#888",
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: "flex-start",
  },
  sender: {
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
  },
  receiver: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  messageContent: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 15,
    maxWidth: "80%",
  },
  senderMessage: {
    backgroundColor: "#0078D4", // Blue color for sender
    color: "#fff",
  },
  receiverMessage: {
    backgroundColor: "#f2f2f2", // Light gray for receiver
  },
  userName: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  dateTitle: {
    fontSize: 14,
    color: Colors?.darkgrey,
    marginVertical: 10,
    textAlign: "center",
  },
});

export default MessagesList;

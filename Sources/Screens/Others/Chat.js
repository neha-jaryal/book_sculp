import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useContext,
  useState,
} from "react";
import {
  GiftedChat,
  Send,
  Bubble,
  InputToolbar,
} from "react-native-gifted-chat";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  AppState,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

// Modular Firebase imports (correct for v20+ / v23+)
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  writeBatch,
  increment,
  deleteField,
  arrayUnion,
  onSnapshot,
  setDoc,
  deleteDoc,
  collection,
  getFirestore,
  query,
  orderBy,
  where,
  getDocs,
  Timestamp,
} from "@react-native-firebase/firestore";

import firestore from "@react-native-firebase/firestore";

import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";

import Icon from "react-native-vector-icons/AntDesign";
import uuid from "react-native-uuid";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import { Colors, Images, Sizes } from "../../Constants";
import { BubblesModal, Header, Loader, TextComponent } from "../../Components";
import { Styles } from "../../Styles";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";

import { getData, storageKey, storeData } from "../../Utility/Storage";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import {
  sendMessage,
  sendNotification,
} from "../../Redux/Services/OtherServices";
import moment from "moment";
import { useHeaderHeight } from "@react-navigation/elements";
import { db } from "../../Utility/Firebase";

export const Chat = ({ route, navigation }) => {
  const dispatching = useDispatch();
  const typingTimeoutRef = useRef(null);
  const chatRef = useRef(null);
  const headerHeight = useHeaderHeight();
  const [replyMessage, setReplyMessage] = useState(null);

  const appState = useRef(AppState.currentState);
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);
  const [chats, setChats] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const actionSheetRef = useRef();

  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const { displayName, uid, photoURL } = route?.params || {};
  const [messages, setMessages] = useState([]);
  const [userDeletedMessages, setUserDeletedMessages] = useState([]);
  const [chatModal, setChatModal] = useState(false);
  const [typing, setTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("Offline");
  const [selectedMsg, setSelectedMsg] = useState({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState("");
  const [status, setStatus] = useState("offline");
  const [ShowDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const attachmentList = [
    { id: 1, heading: "Camera", icon: Images.ChatCamera },
    { id: 2, heading: "Gallery", icon: Images.ChatGallery },
    { id: 3, heading: "Document", icon: Images.ChatDocument },
    { id: 4, heading: "Location", icon: Images.ChatLocation },
  ];
  const avatar =
    "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=";

  useEffect(() => {
    const userRef = doc(db, "users", currentUser.uid);

    const unSub = onSnapshot(doc(db, "chats", data?.chatId), (doc) => {
      if (doc.exists()) {
        setLoading(true);
        let msgArr = doc.data().messages;
        let filteredMsg = msgArr.filter(
          (msg) => !msg?.deletedFor?.includes(currentUser.uid),
        );

        let messageData = filteredMsg?.map((msg) => {
          return {
            _id: msg._id || msg.id,
            text: msg.text,
            createdAt: msg.date?.toDate() || msg.createdAt?.toDate(),
            status: msg?.status,
            user: {
              _id: msg.user._id,
              name: msg.user.name,
              avatar: msg.user.avatar || avatar,
            },
          };
        });
        const sortedMessages = messageData.sort(
          (a, b) => b.createdAt - a.createdAt,
        );
        onSnapshot(userRef, (doc) => {
          const deletedMsg = doc.data().deletedMessages;
          setUserDeletedMessages(deletedMsg || []);
          const allMessages = sortedMessages.filter(
            (message) => !deletedMsg?.includes(message._id),
          );
          setMessages(allMessages);
          setLoading(false);
        });
      }
    });

    // const unSubUser = onSnapshot(userRef, (doc) => {
    //   if (doc.exists()) {
    //     setUserDeletedMessages(doc.data().deletedMessages || []);
    //   }
    //   setLoading(false);
    // });
    console.log("message received");

    return () => {
      unSub();
      // unSubUser();
    };
  }, [data?.chatId, currentUser.uid]);

  // useEffect(() => {
  //   if (!selectedMsg || isEditing) return;

  //   const userRef = doc(db, "users", currentUser?.uid);

  //   const unsubscribe = onSnapshot(userRef, (docSnap) => {
  //     if (docSnap.exists()) {
  //       const deletedIds = docSnap.data()?.deletedMessages || [];
  //       setUserDeletedMessages(deletedIds);

  //       const filtered = messages.filter((m) => !deletedIds.includes(m._id));

  //       // Preserve GiftedChat format/order
  //       setMessages((prev) => GiftedChat.append(prev, filtered));
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [selectedMsg, isEditing, currentUser?.uid, messages]);

  // useEffect(() => {
  //   if (!data?.chatId || !data?.user?.uid) return;

  //   const otherUserId = data.user.uid;

  //   // Listen to typing from the OTHER user to ME
  //   const typingStatusRef = doc(
  //     db,
  //     "typingStatus",
  //     `${otherUserId}_${currentUser?.uid}`,
  //   );

  //   const unsubscribe = onSnapshot(typingStatusRef, (docSnap) => {
  //     const isTyping = docSnap.exists()
  //       ? docSnap.data()?.typing || false
  //       : false;
  //     setTyping(isTyping);
  //     console.log("Typing status received:", isTyping, "from:", otherUserId);
  //   });

  //   return () => unsubscribe();
  // }, [data?.chatId, data?.user?.uid, currentUser?.uid]);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (!data?.chatId || !data?.user?.uid) return;

  //     const userChatsRef = doc(db, "userChats", currentUser.uid);

  //     // Reset MY unread count when I open the chat
  //     updateDoc(userChatsRef, {
  //       [`${data.chatId}.unreadCount`]: 0,
  //     }).catch((err) => console.error("Reset unread failed:", err));

  //     // Optional: listen for chat changes (but no auto "read" marking)
  //     const chatRef = doc(db, "chats", data.chatId);

  //     const unsubscribe = onSnapshot(chatRef, (chatDoc) => {
  //       // If you want to do something else here later, add it
  //       console.log("Chat doc updated – unread reset already done");
  //     });

  //     return () => unsubscribe();
  //   }, [data?.chatId, currentUser?.uid]),
  // );

  // useEffect(() => {
  //   if (!data?.user?.uid) return;

  //   const statusRef = doc(db, "userStatus", data.user.uid);

  //   const unsubscribe = onSnapshot(statusRef, (statusDoc) => {
  //     setStatus(
  //       statusDoc.exists() ? statusDoc.data()?.status || "offline" : "offline",
  //     );
  //   });

  //   return () => unsubscribe();
  // }, [data?.user?.uid]);

  // const updateTypingStatus = async (isTyping) => {
  //   try {
  //     const otherUserId = data?.user?.uid;
  //     if (!otherUserId) return;

  //     // When **I** type → write to MY_ID → THEIR_ID
  //     const typingStatusRef = doc(
  //       db,
  //       "typingStatus",
  //       `${currentUser?.uid}_${otherUserId}`,
  //     );

  //     if (isTyping) {
  //       await setDoc(typingStatusRef, { typing: true }, { merge: true });
  //     } else {
  //       await deleteDoc(typingStatusRef);
  //     }

  //     console.log("Typing status updated:", isTyping);
  //   } catch (error) {
  //     console.error("Error updating typing status:", error);
  //   }
  // };

  useEffect(() => {
    if (selectedMsg && !isEditing) {
      const userRef = doc(db, "users", currentUser.uid);
      const unSubUser = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserDeletedMessages(doc.data().deletedMessages || []);
        }
        const deletedMsg = doc.data().deletedMessages;
        const updatedMessages = messages.filter(
          (message) => !deletedMsg?.includes(message._id),
        );
        setMessages((previousMessages) =>
          GiftedChat.append([], updatedMessages),
        );
        // setMessages(updatedMessages);
        setLoading(false);
      });

      return () => unSubUser();
    }
  }, [selectedMsg && !isEditing]);

  useEffect(() => {
    if (data?.chatId && data?.user?.uid) {
      const otherUserId = data?.user?.uid;
      const typingStatusRef = doc(
        db,
        "typingStatus",
        `${currentUser?.uid}_${otherUserId}`,
      );

      const unsubscribeTyping = onSnapshot(typingStatusRef, (doc) => {
        if (doc.exists()) {
          setTyping(doc.data()?.typing || false);
        } else {
          setTyping(false);
        }
      });

      return () => unsubscribeTyping();
    }
  }, [data?.chatId, data?.user?.uid]);

  useFocusEffect(
    useCallback(() => {
      if (data?.chatId && data?.user?.uid) {
        const chatRef = doc(db, "chats", data?.chatId);
        const userChatsRef = doc(db, "userChats", currentUser.uid);

        const unsubscribe = onSnapshot(chatRef, async (chatDoc) => {
          if (!isChatOpen) return;
          updateDoc(userChatsRef, {
            [data?.chatId + ".unreadCount"]: 0,
          });

          const messages = chatDoc.data()?.messages || [];

          const unreadMessages = messages.filter(
            (message) =>
              message.receiverId === currentUser.uid &&
              message.status !== "read",
          );

          if (unreadMessages.length > 0) {
            const updatedMessages = messages.map((message) => {
              if (
                message.receiverId === currentUser.uid &&
                message.status !== "read"
              ) {
                return { ...message, status: "read" };
              }
              return message;
            });
            try {
              await updateDoc(chatRef, { messages: updatedMessages });
              console.log("Messages marked as read");
            } catch (error) {
              console.error("Error marking messages as read: ", error);
            }
          }
        });
        return () => {
          unsubscribe();
        };
      }
    }, [data?.chatId, currentUser?.uid]),
  );

  useEffect(() => {
    if (data?.user?.uid) {
      const statusRef = doc(db, "userStatus", data?.user?.uid);
      const unsubscribe = onSnapshot(statusRef, (statusDoc) => {
        if (statusDoc.exists()) {
          setStatus(statusDoc.data()?.status || "offline");
        } else {
          setStatus("offline");
        }
      });

      return () => unsubscribe();
    }
  }, [data?.user?.uid]);

  const updateTypingStatus = async (isTyping) => {
    console.log("bhjjhg----", isTyping);
    try {
      const otherUserId = data?.user?.uid;
      const typingStatusRef = doc(
        db,
        "typingStatus",
        `${otherUserId}_${currentUser?.uid}`,
      );

      await setDoc(typingStatusRef, {
        typing: isTyping,
      });
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  const onSend = useCallback(
    async (messages = []) => {
      console.log("onSend pressed");

      const user_id = await getData(storageKey?.USER_ID);

      const newMsg = messages[0];
      if (!newMsg) return;

      const chatId = data?.chatId;
      const text = newMsg.text?.trim();
      if (!text || !chatId) return;

      const messageID = uuid.v4();

      const recipientId = data?.user?.uid;

      try {
        const userChatRef = doc(db, "userChats", recipientId);
        const chatDocRef = doc(db, "chats", chatId);
        const chatDoc = await getDoc(chatDocRef);
        const chatData = chatDoc.data();

        const messageData = {
          _id: newMsg._id || newMsg.id || messageID,
          text: newMsg.text,
          senderId: currentUser?.uid,
          date: Timestamp.now(),
          receiverId: data?.user?.uid,
          status: "sent",
          user: newMsg?.user,
        };

        console.log("Sending message");

        const batch = writeBatch(db);

        // Update sender's userChats
        batch.update(doc(db, "userChats", currentUser?.uid), {
          [`${chatId}.lastMessage`]: { text },
          [`${chatId}.date`]: Timestamp.now(),
          ...(chatData?.userInfo || chatData?.user
            ? {}
            : {
                [`${chatId}.userInfo`]: {
                  uid: data?.user?.uid,
                  displayName: data?.user?.displayName,
                  photoURL: data?.user?.photoURL,
                  user_id: data?.user?.user_id,
                },
              }),
        });

        // Update receiver's userChats
        batch.update(doc(db, "userChats", data?.user?.uid), {
          [`${chatId}.lastMessage`]: { text },
          [`${chatId}.date`]: Timestamp.now(),
          [`${chatId}.unreadCount`]: increment(1),
          ...(chatData?.userInfo || chatData?.user
            ? {}
            : {
                [`${chatId}.userInfo`]: {
                  uid: currentUser?.uid,
                  displayName: currentUser?.displayName,
                  photoURL: currentUser?.photoURL,
                  user_id: user_id,
                },
              }),
        });

        // Clean deletedAt if needed
        batch.update(userChatRef, {
          [`${chatId}.deletedAt`]: deleteField(),
        });

        // Append to messages array (this is what your listener reads)
        batch.update(chatDocRef, {
          messages: arrayUnion(messageData),
        });

        await batch.commit();

        setText("");

        // Backend notification
        if (status !== "online" && status !== "away" && status !== "typing") {
          let uploadData = new FormData();
          uploadData.append("sender_id", user_id);
          uploadData.append("reciver_id", data?.user?.user_id);
          uploadData.append("message", newMsg.text);
          await dispatching(sendMessage(uploadData));

          updateTypingStatus(data?.chatId, false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error sending message:", error);
        Alert.alert("Error", "Failed to send message");
      }
    },
    [
      currentUser?.uid,
      data?.chatId,
      data?.user?.uid,
      data?.user?.user_id,
      dispatching,
      updateTypingStatus,
    ],
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearUserDataContext();
      };
    }, []),
  );

  const clearUserDataContext = async () => {
    dispatching({ type: "CHANGE_USER", payload: { chatId: null, user: {} } });
  };

  useEffect(() => {
    getUserData();
  }, [route?.params]);

  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    if (userID) {
      let body = { user_id: JSON.parse(userID) };
      let res = await dispatching(getUserDetail(body));
      if (res.status === 200) {
        setUserData(res.results);
      }
    }
  };

  const handleInputTextChange = (inputText) => {
    setText(inputText);
    if (inputText.trim().length > 0 && !typing) {
      updateTypingStatus(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 3000);
  };

  const renderSend = (props) => {
    return (
      <View style={{ top: 25, right: 0 }}>
        <Send {...props}>
          <Ionicons name="send-sharp" size={24} color={Colors?.themeColor} />
        </Send>
      </View>
    );
  };

  const handleBubblePress = (context, message) => {
    setSelectedMsg(message);
    setShowOptionsModal(true);
  };

  const renderBubble = (props) => {
    const { currentMessage } = props;
    const isMe = currentMessage?.user?._id === userData?.user_data?.user_id;

    const renderStatusIcon = () => {
      if (!isMe) return null;

      if (currentMessage?.status === "read") {
        return (
          <Ionicons
            name="checkmark-done"
            size={15}
            color={Colors.blue}
            style={{ marginLeft: 4 }}
          />
        );
      }

      if (
        currentMessage?.status === "sent" ||
        currentMessage?.status === "delivered"
      ) {
        return (
          <Ionicons
            name="checkmark-done"
            size={18}
            color={Colors.white}
            style={{ marginLeft: 5 }}
          />
        );
      }

      return null;
    };

    return (
      <Bubble
        {...props}
        onLongPressMessage={(context, message) => {
          setSelectedMsg(message);
          setShowOptionsModal(true);
        }}
        renderTicks={renderStatusIcon}
        wrapperStyle={{
          right: {
            backgroundColor: Colors.gredient,
            // paddingVertical: 4,
            paddingHorizontal: 5,
            marginVertical: 4,
            marginLeft: 60,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 4,
          },
          left: {
            backgroundColor: Colors.white,
            // paddingVertical: 4,
            paddingHorizontal: 5,
            marginVertical: 4,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 1,
          },
        }}
        textStyle={{
          right: {
            color: Colors.black,
            fontSize: 15,
            lineHeight: 20,
          },
          left: {
            color: Colors.black,
            fontSize: 15,
            lineHeight: 20,
          },
        }}
         
        renderTime={() => (
          <View style={{}}>
            <Text
              style={{
                fontSize: 10,
                color: isMe ? Colors.black : Colors.grey,
              }}
            >
              {moment(currentMessage.createdAt).format("hh:mm A")}
            </Text>
          </View>
        )}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          justifyContent: "center",
          backgroundColor: Colors?.white,
          marginHorizontal: 20,
          borderRadius: 10,
          borderTopWidth: 0,
          bottom: 30,
          padding: 5,
          color: Colors?.black,
          // elevation: 2,
          shadowColor: Colors?.black,
          shadowOffset: { width: 0, height: 3 },
        }}
        textInputProps={{
          onChangeText: handleInputTextChange,
          value: text,
        }}
        placeholderTextColor={Colors?.black}
        textInputStyle={{
          color: Colors?.black,
          paddingLeft: 25,
          paddingRight: 5,
        }}
      />
    );
  };

  const handleDeleteForEveryone = async () => {
    try {
      setLoading(true);
      const chatRef = doc(db, "chats", data?.chatId);
      const chatSnap = await getDoc(chatRef);
      const messages = chatSnap.data()?.messages || [];

      const updatedMessages = messages.filter(
        (msg) => msg._id !== selectedMsg._id,
      );

      await updateDoc(chatRef, { messages: updatedMessages });
      setSelectedMsg({});
      setLoading(false);
    } catch (err) {
      console.error("Error deleting message for everyone: ", err);
      setLoading(false);
    }
  };

  const handleDeleteForMe = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, "users", currentUser?.uid);
      await updateDoc(userRef, {
        deletedMessages: arrayUnion(selectedMsg._id),
      });
      setSelectedMsg({});
      setLoading(false);
    } catch (err) {
      console.error("Error deleting for me: ", err);
      setLoading(false);
    }
  };

  const handleEditMessage = async (newText) => {
    try {
      setLoading(true);
      const chatRef = doc(db, "chats", data?.chatId);
      const chatSnap = await getDoc(chatRef);
      if (chatSnap.exists()) {
        const messages = chatSnap.data()?.messages || [];
        const updatedMessages = messages.map((msg) =>
          msg._id === selectedMsg._id ? { ...msg, text: newText } : msg,
        );

        await updateDoc(chatRef, { messages: updatedMessages });
        setIsEditing(false);
        setText("");
        setSelectedMsg({});
        setLoading(false);
      }
    } catch (err) {
      console.error("Error editing message: ", err);
      setLoading(false);
    }
  };

  const focusInput = () => {
    chatRef.current?.focusTextInput();
  };

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      focusInput,
    );
    return () => keyboardShowListener.remove();
  }, []);

  const handleCopy = () => {
    Clipboard.setString(selectedMsg.text);
    setShowOptionsModal(false);
  };

  const handleEditing = () => {
    setShowOptionsModal(false);
    setIsEditing(true);
    setText(selectedMsg?.text || "");
    focusInput();
  };

  const memoizedMessages = useMemo(() => messages, [messages]);

  return (
    <>
      <Header
        text={displayName}
        navigation={navigation}
        profileImg={{ uri: photoURL }}
        chatHeader={true}
        onlineStatus={
          typing
            ? "typing"
            : status === "online" || status === "away"
            ? status
            : "Offline"
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight + 5 : 0}
      >
        {userData?.user_data?.user_id ? (
          <GiftedChat
            ref={chatRef}
            keyboardAvoidingViewProps={{
              behavior: "padding",
              keyboardVerticalOffset: headerHeight,
            }}
            reply={{
              swipe: {
                isEnabled: true,
                direction: "right",
              },
            }}
            messages={memoizedMessages || []}
            onSend={(messages) =>
              isEditing && selectedMsg?._id && text
                ? handleEditMessage(text)
                : onSend(messages)
            }
            isUserAvatarVisible={true}
            isTyping={typing}
            user={{
              _id: userData?.user_data?.user_id,
              name: userData?.user_data?.first_name,
              avatar:
                userData?.profile_image?.length > 0 &&
                userData?.profile_image[0]?.guid
                  ? userData?.profile_image[0]?.guid
                  : avatar,
            }}
            isScrollToBottomEnabled={true}
            defaultBottomOffset={100}
            scrollToBottomComponent={() => (
              <Entypo name="chevron-down" size={30} color={Colors?.darkgrey} />
            )}
            isSendButtonAlwaysVisible={true}
            renderInputToolbar={renderInputToolbar}
            renderBubble={renderBubble}
            renderSend={renderSend}
            renderFooter={() => null}
            messagesContainerStyle={{
              paddingTop: 20,
              paddingTop: -50,
              paddingBottom: 40,
              backgroundColor: Colors?.lightGray,
            }}
            text={isEditing ? text : undefined}
          />
        ) : null}
      </KeyboardAvoidingView>

      <Modal
        visible={ShowDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Message</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDeleteForMe}
            >
              <Text style={styles.modalButtonText}>Delete for me</Text>
            </TouchableOpacity>

            {selectedMsg?.user?._id === userData?.user_data?.user_id && (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDeleteForEveryone}
              >
                <Text style={styles.modalButtonText}>Delete for everyone</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showOptionsModal && (
        <BubblesModal
          showOptionsModal={showOptionsModal}
          setShowOptionsModal={setShowOptionsModal}
          message={selectedMsg}
          handleDeleteChat={handleDeleteForMe}
          handleDeleteBothChat={handleDeleteForEveryone}
          handleCopy={handleCopy}
          handleEditing={handleEditing}
          optionForBoth={
            selectedMsg?.user?._id === userData?.user_data?.user_id
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingV: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors?.black,
  },
  modalButton: {
    backgroundColor: Colors?.gredient,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors?.black,
    fontSize: 16,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  modalCancelText: {
    color: "#333",
    fontSize: 16,
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

// import React, {
//   useState,
//   useCallback,
//   useRef,
//   useContext,
//   useMemo,
// } from "react";
// import {
//   GiftedChat,
//   Actions,
//   Send,
//   Bubble,
//   InputToolbar,
//   LeftAction,
//   ChatInput,
//   SendButton,
// } from "react-native-gifted-chat";
// import {
//   View,
//   Image,
//   Modal,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   EventEmitter,
//   FastImage,
//   Linking,
//   PermissionsAndroid,
//   BackHandler,
//   AppState,
//   Alert,
//   TextInput,
//   Keyboard,
//   Animated,
//   TouchableWithoutFeedback,
//   SafeAreaView,
// } from "react-native";
// import {
//   doc,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
//   deleteField,
//   serverTimestamp,
//   collection,
//   getDoc,
//   setDoc,
//   arrayUnion,
//   Timestamp,
//   arrayRemove,
//   increment,
//   writeBatch,
// } from "firebase/firestore";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   updateProfile,
// } from "firebase/auth";
// import {
//   db,
//   firebaseDB,
//   firebaseAuth,
//   getRecipientToken,
// } from "../../Utility/Firebase";
// import Icon from "react-native-vector-icons/AntDesign";
// import uuid from "react-native-uuid";
// import Entypo from "react-native-vector-icons/Entypo";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import {
//   Colors,
//   dimensionheight,
//   dimensionWidth,
//   Images,
//   Sizes,
// } from "../../Constants";
// import { BubblesModal, Header, Loader, TextComponent } from "../../Components";
// import { Styles } from "../../Styles";
// import { useDispatch, useSelector } from "react-redux";
// import { useFocusEffect } from "@react-navigation/native";
// import { useEffect } from "react";
// import { KeyboardAvoidingView } from "react-native";
// import { Platform } from "react-native";
// import {
//   Socket,
//   convertUTCToLocalTime,
//   routeName,
//   showToast,
// } from "../../Utility";
// import { io } from "socket.io-client";
// import Clipboard from "@react-native-community/clipboard";
// import {
//   GestureHandlerRootView,
//   PanGestureHandler,
// } from "react-native-gesture-handler";

// import { getData, storageKey, storeData } from "../../Utility/Storage";
// import { getUserDetail } from "../../Redux/Services/AuthServices";
// import { AuthContext } from "../../Context/AuthContext";
// import { ChatContext } from "../../Context/ChatContext";
// import { debounce } from "lodash";
// import { deleteObject } from "firebase/storage";
// import {
//   sendMessage,
//   sendNotification,
// } from "../../Redux/Services/OtherServices";
// import moment from "moment";
// // import { sendNotification } from "../../../functions";
// export const Chat = ({ route, navigation }) => {
//   const dispatching = useDispatch();
//   const typingTimeoutRef = useRef(null);
//   const chatRef = useRef(null);
//   // const socket = useRef();
//   const appState = useRef(AppState.currentState);
//   const other = useSelector((state) => state?.otherReducer);
//   const auth = useSelector((state) => state?.authReducer);
//   const [chats, setChats] = useState([]);
//   const [isDelete, setIsDelete] = useState(false);
//   // const [chatId, setChatId] = useState(""); // To store the chat ID that we want to delete
//   // const firestoreDB = db.firestore();
//   const actionSheetRef = useRef();

//   const { currentUser } = useContext(AuthContext);
//   const { dispatch, data } = useContext(ChatContext);
//   const { displayName, uid, photoURL } = route?.params;
//   const [messages, setMessages] = useState([]);
//   const [userDeletedMessages, setUserDeletedMessages] = useState([]);
//   const [chatModal, setChatModal] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [onlineStatus, setOnlineStatus] = useState("Offline");
//   const [selectedMsg, setSelectedMsg] = useState({});
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState("");
//   const [userData, setUserData] = useState("");
//   const [status, setStatus] = useState("offline");
//   const [ShowDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showOptionsModal, setShowOptionsModal] = useState(false);
//   const [isChatOpen, setIsChatOpen] = useState(true);

//   const attachmentList = [
//     { id: 1, heading: "Camera", icon: Images.ChatCamera },
//     { id: 2, heading: "Gallery", icon: Images.ChatGallery },
//     { id: 3, heading: "Document", icon: Images.ChatDocument },
//     { id: 4, heading: "Location", icon: Images.ChatLocation },
//   ];
//   const avatar =
//     "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=";

//   useEffect(() => {
//     const userRef = doc(db, "users", currentUser.uid);

//     const unSub = onSnapshot(doc(db, "chats", data?.chatId), (doc) => {
//       if (doc.exists()) {
//         setLoading(true);
//         let msgArr = doc.data().messages;
//         let filteredMsg = msgArr.filter(
//           (msg) => !msg?.deletedFor?.includes(currentUser.uid),
//         );

//         let messageData = filteredMsg?.map((msg) => {
//           return {
//             _id: msg._id || msg.id,
//             text: msg.text,
//             createdAt: msg.date?.toDate() || msg.createdAt?.toDate(),
//             status: msg?.status,
//             user: {
//               _id: msg.user._id,
//               name: msg.user.name,
//               avatar: msg.user.avatar || avatar,
//             },
//           };
//         });
//         const sortedMessages = messageData.sort(
//           (a, b) => b.createdAt - a.createdAt,
//         );
//         onSnapshot(userRef, (doc) => {
//           const deletedMsg = doc.data().deletedMessages;
//           setUserDeletedMessages(deletedMsg || []);
//           const allMessages = sortedMessages.filter(
//             (message) => !deletedMsg?.includes(message._id),
//           );
//           setMessages(allMessages);
//           setLoading(false);
//         });
//       }
//     });

//     // const unSubUser = onSnapshot(userRef, (doc) => {
//     //   if (doc.exists()) {
//     //     setUserDeletedMessages(doc.data().deletedMessages || []);
//     //   }
//     //   setLoading(false);
//     // });
//     console.log("message received");

//     return () => {
//       unSub();
//       // unSubUser();
//     };
//   }, [data?.chatId, currentUser.uid]);

//   useEffect(() => {
//     if (selectedMsg && !isEditing) {
//       const userRef = doc(db, "users", currentUser.uid);
//       const unSubUser = onSnapshot(userRef, (doc) => {
//         if (doc.exists()) {
//           setUserDeletedMessages(doc.data().deletedMessages || []);
//         }
//         const deletedMsg = doc.data().deletedMessages;
//         const updatedMessages = messages.filter(
//           (message) => !deletedMsg?.includes(message._id),
//         );
//         setMessages((previousMessages) =>
//           GiftedChat.append([], updatedMessages),
//         );
//         // setMessages(updatedMessages);
//         setLoading(false);
//       });

//       return () => unSubUser();
//     }
//   }, [selectedMsg && !isEditing]);

//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         clearUserDataContext();
//       };
//     }, []),
//   );

//   const clearUserDataContext = async () => {
//     dispatching({ type: "CHANGE_USER", payload: { chatId: null, user: {} } });
//   };

//   useEffect(() => {
//     getUserData();
//   }, [route?.params]);

//   useEffect(() => {
//     if (data?.chatId && data?.user?.uid) {
//       const otherUserId = data?.user?.uid;
//       const typingStatusRef = doc(
//         db,
//         "typingStatus",
//         `${currentUser?.uid}_${otherUserId}`,
//       );

//       const unsubscribeTyping = onSnapshot(typingStatusRef, (doc) => {
//         if (doc.exists()) {
//           setTyping(doc.data()?.typing || false);
//         } else {
//           setTyping(false);
//         }
//       });

//       return () => unsubscribeTyping();
//     }
//   }, [data?.chatId, data?.user?.uid]);

//   useFocusEffect(
//     useCallback(() => {
//       if (data?.chatId && data?.user?.uid) {
//         const chatRef = doc(db, "chats", data?.chatId);
//         const userChatsRef = doc(db, "userChats", currentUser.uid);

//         const unsubscribe = onSnapshot(chatRef, async (chatDoc) => {
//           if (!isChatOpen) return;
//           updateDoc(userChatsRef, {
//             [data?.chatId + ".unreadCount"]: 0,
//           });

//           const messages = chatDoc.data()?.messages || [];

//           const unreadMessages = messages.filter(
//             (message) =>
//               message.receiverId === currentUser.uid &&
//               message.status !== "read",
//           );

//           if (unreadMessages.length > 0) {
//             const updatedMessages = messages.map((message) => {
//               if (
//                 message.receiverId === currentUser.uid &&
//                 message.status !== "read"
//               ) {
//                 return { ...message, status: "read" };
//               }
//               return message;
//             });
//             try {
//               await updateDoc(chatRef, { messages: updatedMessages });
//               console.log("Messages marked as read");
//             } catch (error) {
//               console.error("Error marking messages as read: ", error);
//             }
//           }
//         });
//         return () => {
//           unsubscribe();
//         };
//       }
//     }, [data?.chatId, currentUser?.uid]),
//   );

//   useEffect(() => {
//     if (data?.user?.uid) {
//       const statusRef = doc(db, "userStatus", data?.user?.uid);
//       const unsubscribe = onSnapshot(statusRef, (statusDoc) => {
//         if (statusDoc.exists()) {
//           setStatus(statusDoc.data()?.status || "offline");
//         } else {
//           setStatus("offline");
//         }
//       });

//       return () => unsubscribe();
//     }
//   }, [data?.user?.uid]);

//   const getUserData = async () => {
//     let userID = await getData(storageKey?.USER_ID);
//     if (userID) {
//       let body = {
//         user_id: JSON?.parse(userID),
//       };
//       let res = await dispatching(getUserDetail(body));
//       if (res.status == 200) {
//         setUserData(res.results);
//       }
//     }
//   };

//   const updateTypingStatus = async (chatId, isTyping) => {
//     try {
//       const otherUserId = data?.user?.uid;
//       const typingStatusRef = doc(
//         db,
//         "typingStatus",
//         `${otherUserId}_${currentUser?.uid}`,
//       );

//       await setDoc(typingStatusRef, {
//         typing: isTyping,
//       });
//     } catch (error) {
//       console.error("Error updating typing status:", error);
//     }
//   };

//   const handleInputTextChange = (text) => {
//     setText(text);
//     if (!typing) {
//       updateTypingStatus(data?.chatId, true);
//       // setTyping(true);
//     }

//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       updateTypingStatus(data?.chatId, false);
//       // setTyping(false);
//     }, 3000);
//   };
//   const onSend = useCallback(
//     async (messages = []) => {
//       const user_id = await getData(storageKey?.USER_ID);
//       console.log("onsend pressed");

//       let newMsg = messages[0];
//       let messageID = uuid.v4();
//       const chatId = data?.chatId;
//       const text = newMsg.text;

//       const recipientId = data?.user?.uid;
//       try {
//         const userChatRef = doc(db, "userChats", recipientId);
//         const chatDocRef = doc(db, "chats", chatId);
//         const chatDoc = await getDoc(chatDocRef);
//         const chatData = chatDoc.data();
//         const messageData = {
//           _id: newMsg._id || newMsg.id || messageID,
//           text: newMsg.text,
//           senderId: currentUser?.uid,
//           date: Timestamp.now(),
//           receiverId: data?.user?.uid,
//           status: "sent",
//           user: newMsg?.user,
//         };
//         console.log("sending message");
//         const batch = writeBatch(db);

//         if (
//           (chatData &&
//             typeof chatData === "object" &&
//             "userInfo" in chatData) ||
//           (chatData && typeof chatData === "object" && "user" in chatData)
//         ) {
//           batch.update(doc(db, "userChats", currentUser?.uid), {
//             [data?.chatId + ".lastMessage"]: {
//               text,
//             },
//             [data?.chatId + ".date"]: Timestamp.now(),
//           });

//           batch.update(doc(db, "userChats", data?.user?.uid), {
//             [data?.chatId + ".lastMessage"]: {
//               text,
//             },
//             [data?.chatId + ".date"]: Timestamp.now(),
//             [data?.chatId + ".unreadCount"]: increment(1),
//           });
//         } else {
//           batch.update(doc(db, "userChats", currentUser?.uid), {
//             [data?.chatId + ".lastMessage"]: {
//               text,
//             },
//             [data?.chatId + ".date"]: Timestamp.now(),
//             [data?.chatId + ".userInfo"]: {
//               uid: data?.user?.uid,
//               displayName: data?.user?.displayName,
//               photoURL: data?.user?.photoURL,
//               user_id: data?.user?.user_id,
//             },
//           });

//           batch.update(doc(db, "userChats", data?.user?.uid), {
//             [data?.chatId + ".lastMessage"]: {
//               text,
//             },
//             [data?.chatId + ".date"]: Timestamp.now(),
//             [data?.chatId + ".unreadCount"]: increment(1),
//             [data?.chatId + ".userInfo"]: {
//               uid: currentUser?.uid,
//               displayName: currentUser?.displayName,
//               photoURL: currentUser?.photoURL,
//               user_id: user_id,
//             },
//           });
//         }

//         batch.update(userChatRef, {
//           [`${chatId}.deletedAt`]: deleteField(),
//         });

//         batch.update(doc(db, "chats", data?.chatId), {
//           messages: arrayUnion(messageData),
//         });
//         setText("");

//         await batch.commit();
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }
//       console.log("message is about to sent");

//       let uploadData = new FormData();
//       uploadData?.append("sender_id", user_id);
//       uploadData?.append("reciver_id", data?.user?.user_id);
//       uploadData?.append("message", newMsg.text);
//       let res = await dispatching(sendMessage(uploadData));

//       setLoading(false);
//       updateTypingStatus(data?.chatId, false);

//       // setMessages((previousMessages) =>
//       //   GiftedChat.append(previousMessages, messages)
//       // );
//     },

//     [uid, data?.chatId],
//   );

//   const renderSend = (props) => {
//     return (
//       <View>
//         <Send {...props}>
//           <FontAwesome
//             name="send"
//             size={24}
//             color={Colors?.themeColor}
//             style={{ marginLeft: -40, paddingTop: 6 }}
//           />
//         </Send>
//       </View>
//     );
//   };

//   const handleEditing = () => {
//     setShowOptionsModal(false);
//     setIsEditing(true);
//     setText(selectedMsg?.text);
//     focusInput();
//   };
//   const handleBubblePress = (context, message) => {
//     setSelectedMsg(message);
//     setShowOptionsModal(true);
//   };

//   const renderBubble = (props) => {
//     const { currentMessage, position } = props;
//     const renderTicks = (messageStatus) => {
//       if (messageStatus === "sent" || messageStatus === "delivered") {
//         return <Ionicons name="checkmark-done-sharp" style={styles.tick} />;
//       } else if (messageStatus === "read") {
//         return <Ionicons name="checkmark-done-sharp" style={styles.tickRead} />;
//       }
//       return null;
//     };
//     // if (
//     //   userDeletedMessages?.includes(currentMessage?._id || currentMessage?.id)
//     // ) {
//     //   return null;
//     // } else {
//     return (
//       <Bubble
//         {...props}
//         // onLongPress={onLongPress}
//         onLongPress={handleBubblePress}
//         // renderUsernameOnMessage={true}
//         isCustomViewBottom={true}
//         inverted={false}
//         wrapperStyle={{
//           right: {
//             backgroundColor: Colors?.themeColor,
//             marginVertical: 2,
//             paddingHorizontal: 4,
//             // color: Colors?.black,
//           },
//           left: {
//             backgroundColor: Colors?.white,
//             marginVertical: 2,
//             paddingHorizontal: 8,
//             paddingVertical: 4,
//           },
//         }}
//         textStyle={{
//           right: {
//             color: Colors?.white,
//           },
//         }}
//         renderTicks={() =>
//           userData?.user_data?.user_id == currentMessage?.user?._id &&
//           renderTicks(currentMessage.status)
//         }
//       />
//     );
//     // }
//   };

//   const renderInputToolbar = (props) => {
//     return (
//       <>
//         <InputToolbar
//           {...props}
//           containerStyle={{
//             justifyContent: "center",
//             backgroundColor: Colors?.white,
//             marginHorizontal: 10,
//             borderRadius: 20,
//             // paddingVertical: 4,
//             borderTopWidth: 0,
//             marginBottom: 5,
//           }}
//           placeholderTextColor={Colors?.darkgrey}
//           textInputStyle={{
//             color: Colors?.black,
//             paddingLeft: 15,
//             paddingRight: 5,
//           }}
//         />
//       </>
//     );
//   };

//   const memoizedMessages = useMemo(() => messages, [messages]);

//   const handleDeleteChat = (message) => {
//     // setSelectedMsg(message); // Store the selected message for deletion
//     setShowDeleteModal(true); // Show the modal
//   };

//   const handleDeleteForEveryone = async () => {
//     // console?.log("data.chatIddata.chatId-----", selectedMsg);
//     try {
//       setLoading(true);
//       const chatRef = doc(db, "chats", data.chatId);
//       const chatDoc = await getDoc(chatRef);
//       const messages = chatDoc.data().messages || [];
//       setShowOptionsModal(false);
//       const updatedMessages = messages.filter(
//         (message) => message._id != selectedMsg._id,
//       );

//       // console.log("updatedMessages-----", updatedMessages);
//       await updateDoc(chatRef, {
//         messages: updatedMessages,
//       });
//       // await updateDoc(chatRef, {
//       //   messages: arrayRemove(selectedMsg),
//       // });
//       setSelectedMsg({});
//       setLoading(false);
//     } catch (err) {
//       console.error("Error deleting message for everyone: ", err);
//     }
//   };

//   // console.log("handleDeleteForEveryone----", messages);

//   const handleDeleteForMe = async () => {
//     try {
//       setLoading(true);
//       const userRef = doc(db, "users", currentUser.uid);
//       setShowOptionsModal(false);
//       await updateDoc(userRef, {
//         deletedMessages: arrayUnion(selectedMsg._id),
//       });
//       setSelectedMsg({});
//       setLoading(false);
//     } catch (err) {
//       console.error("Error updating deleted messages for user: ", err);
//     }
//   };

//   const handleEditMessage = async (text) => {
//     try {
//       setLoading(true);
//       const chatRef = doc(db, "chats", data?.chatId);
//       const chatDoc = await getDoc(chatRef);
//       if (chatDoc.exists()) {
//         const messages = chatDoc.data().messages || [];
//         const updatedMessages = messages.map((msg) =>
//           msg._id == selectedMsg._id ? { ...msg, text: text } : msg,
//         );
//         setShowOptionsModal(false);
//         await updateDoc(chatRef, {
//           messages: updatedMessages,
//         });
//         setIsEditing(false);
//         setSelectedMsg({});
//         setText("");
//         setLoading(false);
//       } else {
//         console.error("Chat document does not exist");
//       }
//     } catch (err) {
//       console.error("Error editing message: ", err);
//     }
//   };

//   const focusInput = () => {
//     if (chatRef.current) {
//       chatRef.current.focusTextInput();
//     }
//   };
//   useEffect(() => {
//     const keyboardShowListener = Keyboard.addListener(
//       "keyboardDidShow",
//       focusInput,
//     );
//     return () => {
//       keyboardShowListener.remove();
//     };
//   }, []);
//   const handleCopy = () => {
//     Clipboard.setString(selectedMsg.text);
//     setShowOptionsModal(false);
//     setSelectedMsg(false);
//   };

//   return (
//     <>
//       <Header
//         text={displayName}
//         navigation={navigation}
//         profileImg={{ uri: photoURL }}
//         chatHeader={true}
//         onlineStatus={
//           typing
//             ? "Typing"
//             : status === "online" || status === "away"
//             ? status
//             : "Offline"
//         }
//       />

//       {userData?.user_data?.user_id ? (
//         <GiftedChat
//           ref={chatRef}
//           // onLongPress={onLongPress}
//           messages={memoizedMessages || []}
//           onSend={(messages) =>
//             isEditing && selectedMsg?.text && text
//               ? handleEditMessage(messages[0]?.text)
//               : onSend(messages)
//           }
//           showUserAvatar={true}
//           // renderUsernameOnMessage={true}
//           renderAvatarOnTop={true}
//           isTyping={typing}
//           onInputTextChanged={(ele) => handleInputTextChange(ele)}
//           user={{
//             _id: userData?.user_data?.user_id,
//             name: userData?.user_data?.first_name,
//             avatar:
//               userData?.profile_image &&
//               userData?.profile_image?.length != 0 &&
//               userData?.profile_image[0]?.guid
//                 ? userData?.profile_image[0]?.guid
//                 : avatar,
//           }}
//           scrollToBottomComponent={() => (
//             <Icon name="downcircleo" size={30} color={Colors?.themeColor} />
//           )}
//           infiniteScroll={true}
//           scrollToBottom={true}
//           renderInputToolbar={renderInputToolbar}
//           renderBubble={renderBubble}
//           renderSend={renderSend}
//           alwaysShowSend={true}
//           renderFooter={() => null}
//           flatListProps={{
//             contentContainerStyle: { paddingTop: 0 }, // Remove top padding
//           }}
//           listViewProps={{
//             style: { paddingTop: 0, marginTop: -60, marginBottom: 20 },
//           }}
//           _isTextInputWasFocused={isEditing ? true : false}
//           // state={{
//           //   text: isEditing && selectedMsg?.text ? selectedMsg?.text : text,
//           // }}
//           text={isEditing && selectedMsg?.text ? text : text}
//           // renderFooter={renderFooter}
//         />
//       ) : null}

//       <Modal
//         visible={ShowDeleteModal}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setShowDeleteModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Delete Message</Text>

//             {/* Option to delete for me */}
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={handleDeleteForMe}
//             >
//               <Text style={styles.modalButtonText}>Delete for me</Text>
//             </TouchableOpacity>

//             {/* Option to delete for everyone */}

//             {selectedMsg?.user?._id == userData?.user_data?.user_id ? (
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={handleDeleteForEveryone}
//               >
//                 <Text style={styles.modalButtonText}>Delete for everyone</Text>
//               </TouchableOpacity>
//             ) : null}

//             {/* Option to cancel */}
//             <TouchableOpacity
//               style={styles.modalCancelButton}
//               onPress={() => setShowDeleteModal(false)}
//             >
//               <Text style={styles.modalCancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//       {showOptionsModal && (
//         <BubblesModal
//           showOptionsModal={showOptionsModal}
//           setShowOptionsModal={setShowOptionsModal}
//           message={selectedMsg}
//           // handleDeleteChat={() => handleDeleteChat(selectedMsg)}
//           handleDeleteChat={() => handleDeleteForMe(selectedMsg)}
//           handleDeleteBothChat={() => handleDeleteForEveryone()}
//           // handleDeleteBothChat={() => handleDeleteChat()}
//           handleCopy={() => handleCopy()}
//           handleEditing={() => handleEditing()}
//           optionForBoth={
//             selectedMsg?.user?._id == userData?.user_data?.user_id
//               ? true
//               : false
//           }
//         />
//       )}
//     </>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   chatContainer: {
//     flex: 1,
//     paddingTop: 0, // Remove any extra padding
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: 300,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//     color: Colors?.black,
//   },
//   modalButton: {
//     backgroundColor: Colors?.gredient,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginBottom: 10,
//     width: "100%",
//     alignItems: "center",
//   },
//   modalButtonText: {
//     color: Colors?.black,
//     fontSize: 16,
//   },
//   modalCancelButton: {
//     // backgroundColor: "#ddd",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     width: "100%",
//     alignItems: "center",
//   },
//   modalCancelText: {
//     // backgroundColor: Colors?.lightGray,
//     color: "#333",
//     fontSize: 16,
//   },
//   tick: {
//     color: Colors?.white,
//     fontSize: 20,
//     marginLeft: 5,
//     fontWeight: 700,
//   },
//   tickRead: {
//     color: Colors?.pink,
//     fontSize: 20,
//     marginLeft: 5,
//     fontWeight: 700,
//   },
//   tickContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     // marginRight: 10,
//   },
//   modalView: {
//     position: "absolute",
//     bottom: "0%",
//     backgroundColor: "white",
//     borderTopRightRadius: 25,
//     borderTopLeftRadius: 25,
//     overflow: "hidden",
//     width: "100%",
//     alignItems: "center",
//     alignSelf: "center",
//     justifyContent: "space-between",
//     elevation: 3,
//     paddingVertical: 20,
//   },
//   chatShareView: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignSelf: "center",
//     alignItems: "center",
//     alignContent: "center",
//     width: "100%",
//     paddingHorizontal: 20,
//   },
//   container: {
//     flex: 1,
//   },
//   toolbar: {
//     marginTop: 30,
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 5,
//   },
//   mediaPlayer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//     backgroundColor: "black",
//     justifyContent: "center",
//   },
// });

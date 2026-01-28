import React, {
  useState,
  useCallback,
  useRef,
  useContext,
  useMemo,
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
} from "react-native";

// Native Firebase SDK
import firestore from '@react-native-firebase/firestore'; 

import Icon from "react-native-vector-icons/AntDesign";
import uuid from "react-native-uuid"; 
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import {
  Colors, 
  Images,
  Sizes,
} from "../../Constants";
import { BubblesModal, Header, Loader, TextComponent } from "../../Components";
import { Styles } from "../../Styles";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect } from "react";
import Clipboard from "@react-native-community/clipboard";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext"; 

import {
  sendMessage,
  sendNotification,
} from "../../Redux/Services/OtherServices";
import moment from "moment";

export const Chat = ({ route, navigation }) => {
  const dispatching = useDispatch();
  const typingTimeoutRef = useRef(null);
  const chatRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);
  const [chats, setChats] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const actionSheetRef = useRef();

  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const { displayName, uid, photoURL } = route?.params;
  const [messages, setMessages] = useState([]);
  const [userDeletedMessages, setUserDeletedMessages] = useState([]);
  const [chatModal, setChatModal] = useState(false);
  const [typing, setTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("Offline");
  const [selectedMsg, setSelectedMsg] = useState({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState("");
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
    const userRef = firestore().collection("users").doc(currentUser.uid);

    const unSub = firestore()
      .collection("chats")
      .doc(data?.chatId)
      .onSnapshot((docSnap) => {
        if (docSnap.exists()) {
          setLoading(true);
          const msgArr = docSnap.data()?.messages || [];
          const filteredMsg = msgArr.filter(
            (msg) => !msg?.deletedFor?.includes(currentUser.uid)
          );

          const messageData = filteredMsg.map((msg) => ({
            _id: msg._id || msg.id,
            text: msg.text,
            createdAt: msg.date?.toDate() || new Date(),
            status: msg?.status,
            user: {
              _id: msg.user._id,
              name: msg.user.name,
              avatar: msg.user.avatar || avatar,
            },
          }));

          const sortedMessages = messageData.sort((a, b) => b.createdAt - a.createdAt);

          userRef.onSnapshot((userDoc) => {
            const deletedMsg = userDoc.data()?.deletedMessages || [];
            setUserDeletedMessages(deletedMsg);
            const allMessages = sortedMessages.filter(
              (message) => !deletedMsg.includes(message._id)
            );
            setMessages(allMessages);
            setLoading(false);
          });
        }
      });

    return () => unSub();
  }, [data?.chatId, currentUser.uid]);

  useEffect(() => {
    if (selectedMsg && !isEditing) {
      const userRef = firestore().collection("users").doc(currentUser.uid);
      const unSubUser = userRef.onSnapshot((docSnap) => {
        if (docSnap.exists()) {
          const deletedMsg = docSnap.data()?.deletedMessages || [];
          setUserDeletedMessages(deletedMsg);
          const updatedMessages = messages.filter(
            (message) => !deletedMsg.includes(message._id)
          );
          setMessages((previousMessages) =>
            GiftedChat.append([], updatedMessages)
          );
          setLoading(false);
        }
      });

      return () => unSubUser();
    }
  }, [selectedMsg && !isEditing]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearUserDataContext();
      };
    }, [])
  );

  const clearUserDataContext = async () => {
    dispatching({ type: "CHANGE_USER", payload: { chatId: null, user: {} } });
  };

  useEffect(() => {
    getUserData();
  }, [route?.params]);

  useEffect(() => {
    if (data?.chatId && data?.user?.uid) {
      const otherUserId = data?.user?.uid;
      const typingStatusRef = firestore()
        .collection("typingStatus")
        .doc(`${currentUser?.uid}_${otherUserId}`);

      const unsubscribeTyping = typingStatusRef.onSnapshot((docSnap) => {
        if (docSnap.exists()) {
          setTyping(docSnap.data()?.typing || false);
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
        const chatRef = firestore().collection("chats").doc(data?.chatId);
        const userChatsRef = firestore().collection("userChats").doc(currentUser.uid);

        const unsubscribe = chatRef.onSnapshot(async (chatDoc) => {
          if (!isChatOpen) return;

          await userChatsRef.update({
            [`${data?.chatId}.unreadCount`]: 0,
          });

          const messages = chatDoc.data()?.messages || [];
          const unreadMessages = messages.filter(
            (msg) =>
              msg.receiverId === currentUser.uid && msg.status !== "read"
          );

          if (unreadMessages.length > 0) {
            const updatedMessages = messages.map((msg) =>
              msg.receiverId === currentUser.uid && msg.status !== "read"
                ? { ...msg, status: "read" }
                : msg
            );
            try {
              await chatRef.update({ messages: updatedMessages });
              console.log("Messages marked as read");
            } catch (error) {
              console.error("Error marking messages as read: ", error);
            }
          }
        });

        return () => unsubscribe();
      }
    }, [data?.chatId, currentUser?.uid, isChatOpen])
  );

  useEffect(() => {
    if (data?.user?.uid) {
      const statusRef = firestore().collection("userStatus").doc(data?.user?.uid);
      const unsubscribe = statusRef.onSnapshot((statusDoc) => {
        if (statusDoc.exists()) {
          setStatus(statusDoc.data()?.status || "offline");
        } else {
          setStatus("offline");
        }
      });

      return () => unsubscribe();
    }
  }, [data?.user?.uid]);

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

  const updateTypingStatus = async (isTyping) => {
    try {
      const otherUserId = data?.user?.uid;
      const typingStatusRef = firestore()
        .collection("typingStatus")
        .doc(`${otherUserId}_${currentUser?.uid}`);

      if (isTyping) {
        await typingStatusRef.set({ typing: true });
      } else {
        await typingStatusRef.delete();
      }
    } catch (error) {
      console.error("Error updating typing status:", error);
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

  const onSend = useCallback(
    async (messages = []) => {
      const user_id = await getData(storageKey?.USER_ID);
      const newMsg = messages[0];
      const messageID = uuid.v4();
      const chatId = data?.chatId;
      const text = newMsg.text.trim();

      if (!text) return;

      const messageData = {
        _id: newMsg._id || messageID,
        text,
        senderId: currentUser?.uid,
        date: firestore.FieldValue.serverTimestamp(),
        receiverId: data?.user?.uid,
        status: "sent",
        user: newMsg?.user,
      };

      const batch = firestore().batch();

      const currentUserChatRef = firestore().collection("userChats").doc(currentUser?.uid);
      const recipientUserChatRef = firestore().collection("userChats").doc(data?.user?.uid);
      const chatRef = firestore().collection("chats").doc(chatId);

      const chatDoc = await chatRef.get();
      const chatData = chatDoc.data() || {};

      // Update last message and date
      batch.update(currentUserChatRef, {
        [`${chatId}.lastMessage`]: { text },
        [`${chatId}.date`]: firestore.FieldValue.serverTimestamp(),
      });

      batch.update(recipientUserChatRef, {
        [`${chatId}.lastMessage`]: { text },
        [`${chatId}.date`]: firestore.FieldValue.serverTimestamp(),
        [`${chatId}.unreadCount`]: firestore.FieldValue.increment(1),
      });

      // Add userInfo if missing
      if (!chatData.userInfo && !chatData.user) {
        batch.update(currentUserChatRef, {
          [`${chatId}.userInfo`]: {
            uid: data?.user?.uid,
            displayName: data?.user?.displayName,
            photoURL: data?.user?.photoURL,
            user_id: data?.user?.user_id,
          },
        });

        batch.update(recipientUserChatRef, {
          [`${chatId}.userInfo`]: {
            uid: currentUser?.uid,
            displayName: currentUser?.displayName,
            photoURL: currentUser?.photoURL,
            user_id: user_id,
          },
        });
      }

      // Clear deletedAt
      batch.update(recipientUserChatRef, {
        [`${chatId}.deletedAt`]: firestore.FieldValue.delete(),
      });

      // Add message
      batch.update(chatRef, {
        messages: firestore.FieldValue.arrayUnion(messageData),
      });

      await batch.commit();

      setText("");
      updateTypingStatus(false);

      // Send push via your backend
      let uploadData = new FormData();
      uploadData.append("sender_id", user_id);
      uploadData.append("reciver_id", data?.user?.user_id);
      uploadData.append("message", text);
      dispatching(sendMessage(uploadData));
    },
    [currentUser?.uid, data?.chatId, data?.user]
  );

  const renderSend = (props) => {
    return (
      <View>
        <Send {...props}>
          <FontAwesome
            name="send"
            size={24}
            color={Colors?.themeColor}
            style={{ marginLeft: -40, paddingTop: 6 }}
          />
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

    const renderTicks = (messageStatus) => {
      if (messageStatus === "sent" || messageStatus === "delivered") {
        return <Ionicons name="checkmark-done-sharp" style={styles.tick} />;
      } else if (messageStatus === "read") {
        return <Ionicons name="checkmark-done-sharp" style={styles.tickRead} />;
      }
      return null;
    };

    return (
      <Bubble
        {...props}
        onLongPress={handleBubblePress}
        inverted={false}
        wrapperStyle={{
          right: {
            backgroundColor: Colors?.themeColor,
            marginVertical: 2,
            paddingHorizontal: 4,
          },
          left: {
            backgroundColor: Colors?.white,
            marginVertical: 2,
            paddingHorizontal: 8,
            paddingVertical: 4,
          },
        }}
        textStyle={{
          right: { color: Colors?.white },
        }}
        renderTicks={() =>
          userData?.user_data?.user_id === currentMessage?.user?._id &&
          renderTicks(currentMessage.status)
        }
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
          marginHorizontal: 10,
          borderRadius: 20,
          borderTopWidth: 0,
          marginBottom: 5,
        }}
        placeholderTextColor={Colors?.darkgrey}
        textInputStyle={{
          color: Colors?.black,
          paddingLeft: 15,
          paddingRight: 5,
        }}
      />
    );
  };

  const handleDeleteForEveryone = async () => {
    try {
      setLoading(true);
      const chatRef = firestore().collection("chats").doc(data.chatId);
      const chatDoc = await chatRef.get();
      const messages = chatDoc.data()?.messages || [];

      const updatedMessages = messages.filter((msg) => msg._id !== selectedMsg._id);

      await chatRef.update({ messages: updatedMessages });
      setSelectedMsg({});
      setLoading(false);
    } catch (err) {
      console.error("Error deleting message for everyone: ", err);
    }
  };

  const handleDeleteForMe = async () => {
    try {
      setLoading(true);
      const userRef = firestore().collection("users").doc(currentUser.uid);
      await userRef.update({
        deletedMessages: firestore.FieldValue.arrayUnion(selectedMsg._id),
      });
      setSelectedMsg({});
      setLoading(false);
    } catch (err) {
      console.error("Error deleting for me: ", err);
    }
  };

  const handleEditMessage = async (newText) => {
    try {
      setLoading(true);
      const chatRef = firestore().collection("chats").doc(data?.chatId);
      const chatDoc = await chatRef.get();
      if (chatDoc.exists()) {
        const messages = chatDoc.data()?.messages || [];
        const updatedMessages = messages.map((msg) =>
          msg._id === selectedMsg._id ? { ...msg, text: newText } : msg
        );

        await chatRef.update({ messages: updatedMessages });
        setIsEditing(false);
        setText("");
        setSelectedMsg({});
        setLoading(false);
      }
    } catch (err) {
      console.error("Error editing message: ", err);
    }
  };

  const focusInput = () => {
    chatRef.current?.focusTextInput();
  };

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", focusInput);
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
            ? "Typing"
            : status === "online" || status === "away"
            ? status
            : "Offline"
        }
      />

      {userData?.user_data?.user_id ? (
        <GiftedChat
          ref={chatRef}
          messages={memoizedMessages || []}
          onSend={(messages) =>
            isEditing && selectedMsg?._id && text
              ? handleEditMessage(text)
              : onSend(messages)
          }
          showUserAvatar={true}
          renderAvatarOnTop={true}
          isTyping={typing}
          onInputTextChanged={handleInputTextChange}
          user={{
            _id: userData?.user_data?.user_id,
            name: userData?.user_data?.first_name,
            avatar:
              userData?.profile_image?.length > 0 && userData?.profile_image[0]?.guid
                ? userData?.profile_image[0]?.guid
                : avatar,
          }}
          scrollToBottomComponent={() => (
            <Icon name="downcircleo" size={30} color={Colors?.themeColor} />
          )}
          infiniteScroll={true}
          scrollToBottom={true}
          renderInputToolbar={renderInputToolbar}
          renderBubble={renderBubble}
          renderSend={renderSend}
          alwaysShowSend={true}
          renderFooter={() => null}
          flatListProps={{
            contentContainerStyle: { paddingTop: 0 },
          }}
          listViewProps={{
            style: { paddingTop: 0, marginTop: -60, marginBottom: 20 },
          }}
          text={isEditing ? text : text}
        />
      ) : null}

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
          optionForBoth={selectedMsg?.user?._id === userData?.user_data?.user_id}
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
    padding: 20,
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
// import DocumentPicker, { types } from "react-native-document-picker";
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
// import Clipboard from "@react-native-community/clipboard";
// import { getData, storageKey, storeData } from "../../Utility/Storage";
// // import PushNotification from "react-native-push-notification";
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
//           (msg) => !msg?.deletedFor?.includes(currentUser.uid)
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
//           (a, b) => b.createdAt - a.createdAt
//         );
//         onSnapshot(userRef, (doc) => {
//           const deletedMsg = doc.data().deletedMessages;
//           setUserDeletedMessages(deletedMsg || []);
//           const allMessages = sortedMessages.filter(
//             (message) => !deletedMsg?.includes(message._id)
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
//           (message) => !deletedMsg?.includes(message._id)
//         );
//         setMessages((previousMessages) =>
//           GiftedChat.append([], updatedMessages)
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
//     }, [])
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
//         `${currentUser?.uid}_${otherUserId}`
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
//               message.status !== "read"
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
//     }, [data?.chatId, currentUser?.uid])
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

//   const updateTypingStatus = async (chatId, isTyping) => {
//     try {
//       const otherUserId = data?.user?.uid;
//       const typingStatusRef = doc(
//         db,
//         "typingStatus",
//         `${otherUserId}_${currentUser?.uid}`
//       );

//       await setDoc(typingStatusRef, {
//         typing: isTyping,
//       });
//     } catch (error) {
//       console.error("Error updating typing status:", error);
//     }
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
//         (message) => message._id != selectedMsg._id
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
//           msg._id == selectedMsg._id ? { ...msg, text: text } : msg
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

//     [uid, data?.chatId]
//   );
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

//   const focusInput = () => {
//     if (chatRef.current) {
//       chatRef.current.focusTextInput();
//     }
//   };
//   useEffect(() => {
//     const keyboardShowListener = Keyboard.addListener(
//       "keyboardDidShow",
//       focusInput
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

// import React, {
//   useState,
//   useCallback,
//   useRef,
//   useContext,
//   useMemo,
//   memo,
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
// import Clipboard from "@react-native-community/clipboard";

// import { getData, storageKey, storeData } from "../../Utility/Storage";
// import PushNotification from "react-native-push-notification";
// import { getUserDetail } from "../../Redux/Services/AuthServices";
// import { AuthContext } from "../../Context/AuthContext";
// import { ChatContext } from "../../Context/ChatContext";
// import { debounce } from "lodash";
// import { deleteObject } from "firebase/storage";
// import {
//   sendMessage,
//   sendNotification,
// } from "../../Redux/Services/OtherServices";
// // import { sendNotification } from "../../../functions";
// export const Chat = memo(({ route, navigation }) => {
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
//   const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//   const [newMessage, setNewMessage] = useState(null);

//   const avatar =
//     "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=";

//   const lastMessageRef = useRef(null);
//   const localMessageIds = useRef(new Set());

//   useEffect(() => {
//     if (!data?.chatId || !currentUser?.uid) return;
//     // setLoading(true);
//     const userRef = doc(db, "users", currentUser.uid);

//     const unSub = onSnapshot(doc(db, "chats", data?.chatId), (doc) => {
//       console.log("messages history updating");

//       if (doc.exists()) {
//         let msgArr = doc.data().messages;
//         let filteredMsg = msgArr.filter(
//           (msg) => !msg?.deletedFor?.includes(currentUser.uid)
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
//           (a, b) => b.createdAt - a.createdAt
//         );
//         if (newMessage) {
//           const newMessages = sortedMessages.filter(
//             (msg) => msg?._id != newMessage?._id
//           );

//           let newMessageData = newMessages?.map((msg) => {
//             return {
//               _id: msg._id || msg.id,
//               text: msg.text,
//               createdAt: msg.date?.toDate() || msg.createdAt?.toDate(),
//               status: msg?.status,
//               user: {
//                 _id: msg.user._id,
//                 name: msg.user.name,
//                 avatar: msg.user.avatar || avatar,
//               },
//             };
//           });
//           setMessages((prevMessages) => {
//             return GiftedChat.append(prevMessages, newMessageData);
//           });
//           setNewMessage(null);
//         } else {
//           setMessages(sortedMessages);
//           setNewMessage(null);
//         }
//         // onSnapshot(userRef, (doc) => {
//         //   const deletedMsg = doc.data().deletedMessages;
//         //   setUserDeletedMessages(deletedMsg || []);
//         //   const allMessages = sortedMessages.filter(
//         //     (message) => !deletedMsg?.includes(message._id)
//         //   );
//         // setMessages((prevMessages) => {
//         //   const newMessages = allMessages.filter(
//         //     (msg) =>
//         //       !prevMessages.some((prevMsg) => prevMsg._id === msg._id) &&
//         //       !localMessageIds.current.has(msg._id)
//         //   );
//         //   return GiftedChat.append(prevMessages, newMessages);
//         // });

//         //   // setMessages(allMessages);
//         // });
//       }
//       // setLoading(false);
//     });

//     return () => {
//       unSub();
//     };
//   }, [data?.chatId, currentUser?.uid]);

//   useEffect(() => {
//     getUserData();
//   }, [route?.params]);

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

//   const onSend = useCallback(
//     async (messages = []) => {
//       // setLoading(true);
//       // await getData(storageKey?.USER_ID);
//       const user_id = 818
//       console.log("onsend pressed");

//       let newMsg = messages[0];
//       let messageID = uuid.v4();
//       const chatId = data?.chatId;
//       const text = newMsg.text;

//       const recipientId = data?.user?.uid;
//       const messageData = {
//         _id: newMsg._id || newMsg.id || messageID,
//         text: newMsg.text,
//         senderId: currentUser?.uid,
//         date: newMsg?.date || newMsg?.createdAt || Timestamp.now(),
//         createdAt: newMsg?.date || newMsg?.createdAt || Timestamp.now(),
//         receiverId: data?.user?.uid,
//         status: "sent",
//         user: newMsg?.user,
//       };
//       setMessages((prevMessages) =>
//         GiftedChat.append(prevMessages, messageData)
//       );
//       console.log("messages appended");

//       setNewMessage(newMsg);
//       console.log("got new message");

//       // localMessageIds.current.add(messageData._id);
//       try {
//         const userChatRef = doc(db, "userChats", recipientId);
//         const chatDocRef = doc(db, "chats", chatId);
//         const chatDoc = await getDoc(chatDocRef);
//         const chatData = chatDoc.data();

//         // const batch = writeBatch(db);
//         try {
//           console.log("updating messages List");

//           updateDoc(doc(db, "chats", data?.chatId), {
//             messages: arrayUnion(messageData),
//           });
//           console.log("updated-------------- messages List");
//           try {
//             if (
//               (chatData &&
//                 typeof chatData === "object" &&
//                 "userInfo" in chatData) ||
//               (chatData && typeof chatData === "object" && "user" in chatData)
//             ) {
//               let data = {
//                 [data?.chatId + ".lastMessage"]: {
//                   text,
//                 },
//                 [data?.chatId + ".date"]: serverTimestamp(),
//                 [data?.chatId + ".unreadCount"]: increment(1),
//               };
//               updateDoc(doc(db, "userChats", currentUser?.uid), data);

//               updateDoc(doc(db, "userChats", data?.user?.uid), data);
//             } else {
//               console.log("message is going");
//               let indexData = {
//                 [data?.chatId + ".lastMessage"]: {
//                   text,
//                 },
//                 [data?.chatId + ".date"]: serverTimestamp(),
//                 [data?.chatId + ".unreadCount"]: increment(1),
//               };
//               updateDoc(doc(db, "userChats", currentUser?.uid), {
//                 ...indexData,
//                 [data?.chatId + ".userInfo"]: {
//                   uid: data?.user?.uid,
//                   displayName: data?.user?.displayName,
//                   photoURL: data?.user?.photoURL,
//                   user_id: data?.user?.user_id,
//                 },
//               });
//               console.log("message is going 2");

//               updateDoc(doc(db, "userChats", data?.user?.uid), {
//                 ...indexData,
//                 [data?.chatId + ".userInfo"]: {
//                   uid: currentUser?.uid,
//                   displayName: currentUser?.displayName,
//                   photoURL: currentUser?.photoURL,
//                   user_id: user_id,
//                 },
//               });
//               console.log("message is going 3");
//             }
//           } catch (error) {
//             console.log("updateDoc failed, retrying...", error);
//           }

//           updateDoc(userChatRef, {
//             [`${chatId}.deletedAt`]: deleteField(),
//           });

//           // await batch.commit();
//         } catch (error) {
//           console.log("Update failed, retrying...", error);
//         }
//         console.log("updated messages List");

//         //  setTimeout(async() => {
//         // const batch = writeBatch(db);
//         // if (
//         //   (chatData &&
//         //     typeof chatData === "object" &&
//         //     "userInfo" in chatData) ||
//         //   (chatData && typeof chatData === "object" && "user" in chatData)
//         // ) {
//         //   let data = {
//         //     [data?.chatId + ".lastMessage"]: {
//         //       text,
//         //     },
//         //     [data?.chatId + ".date"]: serverTimestamp(),
//         //     [data?.chatId + ".unreadCount"]: increment(1),
//         //   };
//         //   batch.update(doc(db, "userChats", currentUser?.uid), data);

//         //   batch.update(doc(db, "userChats", data?.user?.uid), data);
//         // } else {
//         //   // console.log("message is going");
//         //   let indexData = {
//         //     [data?.chatId + ".lastMessage"]: {
//         //       text,
//         //     },
//         //     [data?.chatId + ".date"]: serverTimestamp(),
//         //     [data?.chatId + ".unreadCount"]: increment(1),
//         //   };
//         //   batch.update(doc(db, "userChats", currentUser?.uid), {
//         //     ...indexData,
//         //     [data?.chatId + ".userInfo"]: {
//         //       uid: data?.user?.uid,
//         //       displayName: data?.user?.displayName,
//         //       photoURL: data?.user?.photoURL,
//         //       user_id: data?.user?.user_id,
//         //     },
//         //   });
//         //   // console.log("message is going 2");

//         //   batch.update(doc(db, "userChats", data?.user?.uid), {
//         //     ...indexData,
//         //     [data?.chatId + ".userInfo"]: {
//         //       uid: currentUser?.uid,
//         //       displayName: currentUser?.displayName,
//         //       photoURL: currentUser?.photoURL,
//         //       user_id: user_id,
//         //     },
//         //   });
//         //   // console.log("message is going 3");
//         // }

//         // batch.update(userChatRef, {
//         //   [`${chatId}.deletedAt`]: deleteField(),
//         // });

//         // await batch.commit();
//         //  }, 5500);
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }
//       // console.log("message is about to sent");
//       // notifyMessage(newMsg.text);
//       // setLoading(false);
//       setText("");
//       // updateTypingStatus(data?.chatId, false);
//       console.log("message sent");
//     },
//     [uid, data?.chatId]
//   );
//   const notifyMessage = async (text) => {
//     const user_id = await getData(storageKey?.USER_ID);

//     let uploadData = new FormData();
//     uploadData?.append("sender_id", user_id);
//     uploadData?.append("reciver_id", data?.user?.user_id);
//     uploadData?.append("message", text);
//     let res = await dispatching(sendMessage(uploadData));
//   };
//   const messageList = messages.filter(
//     (message) => !userDeletedMessages.includes(message._id)
//   );
//   const memoizedMessages = useMemo(() => messageList, [messageList]);

//   return (
//     <>
//       <Header
//         text={displayName}
//         navigation={navigation}
//         profileImg={{ uri: photoURL }}
//         chatHeader={true}
//         onlineStatus={
//           typing
//             ? "Typing....."
//             : status === "online" || status === "away"
//             ? status
//             : "Offline"
//         }
//       />
//       <Loader loading={loading} />
//       {userData?.user_data?.user_id && (
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <GiftedChat
//             ref={chatRef}
//             messages={memoizedMessages}
//             onSend={(messages) => onSend(messages)}
//             showUserAvatar={true}
//             renderAvatarOnTop={true}
//             // isTyping={typing}
//             user={{
//               _id: userData?.user_data?.user_id,
//               name: userData?.user_data?.first_name,
//               avatar:
//                 userData?.profile_image &&
//                 userData?.profile_image?.length != 0 &&
//                 userData?.profile_image[0]?.guid
//                   ? userData?.profile_image[0]?.guid
//                   : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
//             }}
//             scrollToBottomComponent={() => (
//               <Icon name="downcircleo" size={30} color={Colors?.themeColor} />
//             )}
//             infiniteScroll={true}
//             scrollToBottom={true}
//             alwaysShowSend={true}
//             listViewProps={{
//               marginBottom: 20,
//             }}
//             bottomOffset={Platform.OS === "ios" ? 20 : 0}
//           />
//         </TouchableWithoutFeedback>
//       )}
//     </>
//   );
// });
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
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

// // // ChatScreen.js
// // import React, { useContext, useEffect, useState } from "react";
// // import { View, Text, SafeAreaView, StyleSheet } from "react-native";

// // import { AuthContext } from "../../Context/AuthContext";
// // import { ChatContext } from "../../Context/ChatContext";
// // // import {
// // //   getChatHistory,
// // //   subscribeToMessages,
// // //   sendMessage,
// // // } from "../../Components/Chats/ChatService";
// // import MessagesList from "../../Components/Chats/MessagesList";
// // import InputToolbar from "../../Components/Chats/InputToolbar";
// // import { Header } from "../../Components";
// // import ChatHeader from "../../Components/Chats/ChatHeader";
// // import { getData, storageKey } from "../../Utility/Storage";
// // import { useDispatch } from "react-redux";
// // import { getUserDetail } from "../../Redux/Services/AuthServices";
// // export const Chat = ({ route, navigation }) => {
// //   const dispatching = useDispatch();
// //   const { currentUser } = useContext(AuthContext);
// //   const { dispatch, data } = useContext(ChatContext);
// //   // const [messages, setMessages] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [userId, setUserId] = useState("");
// //   const { displayName, photoURL } = route?.params;

// //   useEffect(() => {
// //     getUserData();
// //   }, [route?.params]);

// //   const getUserData = async () => {
// //     let userID = await getData(storageKey?.USER_ID);
// //     setUserId(userID);
// //     // if (userID) {
// //     //   let body = {
// //     //     user_id: JSON?.parse(userID),
// //     //   };
// //     // let res = await dispatching(getUserDetail(body));
// //     // if (res.status == 200) {
// //     //   setUserData(res.results);
// //     // }
// //     // }
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <ChatHeader
// //         username={displayName}
// //         profilePhoto={photoURL}
// //         navigation={navigation}
// //       />
// //       <MessagesList setLoading={setLoading} userId={userId} />
// //       <InputToolbar />
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#fff",
// //   },
// // });

// // <>
// //   <Header
// //     text={displayName}
// //     navigation={navigation}
// //     profileImg={{ uri: photoURL }}
// //     chatHeader={true}
// //     onlineStatus={
// //       typing
// //         ? "Typing....."
// //         : status === "online" || status === "away"
// //         ? status
// //         : "Offline"
// //     }
// //   />
// //   <GiftedChat
// //     ref={chatRef}
// //     // onLongPress={onLongPress}
// //     messages={memoizedMessages}
// //     onSend={(messages) =>
// //       isEditing && selectedMsg?.text && text
// //         ? handleEditMessage(messages[0]?.text)
// //         : onSend(messages)
// //     }
// //     showUserAvatar={true}
// //     // renderUsernameOnMessage={true}
// //     renderAvatarOnTop={true}
// //     isTyping={typing}
// //     onInputTextChanged={(ele) => handleInputTextChange(ele)}
// //     // text={isEditing ? selectedMsg?.text : ""}
// //     user={{
// //       _id: userData?.user_data?.user_id,
// //       name: userData?.user_data?.first_name,
// //       avatar:
// //         userData?.profile_image &&
// //         userData?.profile_image?.length != 0 &&
// //         userData?.profile_image[0]?.guid
// //           ? userData?.profile_image[0]?.guid
// //           : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
// //     }}
// //     scrollToBottomComponent={() => (
// //       <Icon name="downcircleo" size={30} color={Colors?.themeColor} />
// //     )}
// //     infiniteScroll={true}
// //     scrollToBottom={true}
// //     renderInputToolbar={renderInputToolbar}
// //     renderBubble={renderBubble}
// //     renderSend={renderSend}
// //     alwaysShowSend={true}
// //     listViewProps={{
// //       marginBottom: 20,
// //     }}
// //     _isTextInputWasFocused={isEditing ? true : false}
// //     // state={{
// //     //   text: isEditing && selectedMsg?.text ? selectedMsg?.text : text,
// //     // }}
// //     text={isEditing && selectedMsg?.text ? text : text}
// //     // renderFooter={renderFooter}
// //   />
// //   <Modal
// //     visible={ShowDeleteModal}
// //     transparent={true}
// //     animationType="fade"
// //     onRequestClose={() => setShowDeleteModal(false)}
// //   >
// //     <View style={styles.modalOverlay}>
// //       <View style={styles.modalContainer}>
// //         <Text style={styles.modalTitle}>Delete Message</Text>

// //         {/* Option to delete for me */}
// //         <TouchableOpacity
// //           style={styles.modalButton}
// //           onPress={handleDeleteForMe}
// //         >
// //           <Text style={styles.modalButtonText}>Delete for me</Text>
// //         </TouchableOpacity>

// //         {/* Option to delete for everyone */}

// //         {selectedMsg?.user?._id == userData?.user_data?.user_id ? (
// //           <TouchableOpacity
// //             style={styles.modalButton}
// //             onPress={handleDeleteForEveryone}
// //           >
// //             <Text style={styles.modalButtonText}>Delete for everyone</Text>
// //           </TouchableOpacity>
// //         ) : null}

// //         {/* Option to cancel */}
// //         <TouchableOpacity
// //           style={styles.modalCancelButton}
// //           onPress={() => setShowDeleteModal(false)}
// //         >
// //           <Text style={styles.modalCancelText}>Cancel</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   </Modal>
// //   {showOptionsModal && (
// //     <BubblesModal
// //       showOptionsModal={showOptionsModal}
// //       setShowOptionsModal={setShowOptionsModal}
// //       message={selectedMsg}
// //       // handleDeleteChat={() => handleDeleteChat(selectedMsg)}
// //       handleDeleteChat={() => handleDeleteForMe(selectedMsg)}
// //       handleDeleteBothChat={() => handleDeleteForEveryone()}
// //       // handleDeleteBothChat={() => handleDeleteChat()}
// //       handleCopy={() => handleCopy()}
// //       handleEditing={() => handleEditing()}
// //       optionForBoth={
// //         selectedMsg?.user?._id == userData?.user_data?.user_id
// //           ? true
// //           : false
// //       }
// //     />
// //   )}

// //   {/* <GiftedChat
// //     // messages={messages}
// //     // onSend={(messages) => onSend(messages)}
// //     messages={memoizedMessages}
// //     onSend={(messages) =>
// //       isEditing && selectedMsg?.text && text
// //         ? handleEditMessage(messages[0]?.text)
// //         : onSend(messages)
// //     }
// //     showUserAvatar={true}
// //     renderAvatarOnTop={true}
// //     isTyping={typing}
// //     user={{
// //       _id: userData?.user_data?.user_id,
// //       name: userData?.user_data?.first_name,
// //       avatar:
// //         userData?.profile_image &&
// //         userData?.profile_image?.length != 0 &&
// //         userData?.profile_image[0]?.guid
// //           ? userData?.profile_image[0]?.guid
// //           : "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
// //     }}
// //     scrollToBottomComponent={() => (
// //       <Icon name="downcircleo" size={30} color={Colors?.themeColor} />
// //     )}
// //     infiniteScroll={true}
// //     scrollToBottom={true}
// //     renderInputToolbar={renderInputToolbar}
// //     renderBubble={renderBubble}
// //     renderSend={renderSend}
// //     alwaysShowSend={true}
// //     listViewProps={{
// //       marginBottom: 20,
// //     }}
// //     _isTextInputWasFocused={isEditing ? true : false}
// //     text={isEditing && selectedMsg?.text ? text : text}
// //   /> */}
// // </>

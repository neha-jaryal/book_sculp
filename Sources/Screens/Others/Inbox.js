import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  Colors,
  dimensionheight,
  dimensionWidth,
  Sizes,
} from "../../Constants";
import { Header, TextComponent } from "../../Components";
import { Styles } from "../../Styles";
import { Searchbar } from "react-native-paper";
import { routeName, timeSince } from "../../Utility";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";

// Modular Firestore imports
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  deleteField,
} from "@react-native-firebase/firestore";

export const Inbox = ({ navigation }) => {
  const [typingStatus, setTypingStatus] = useState({});
  const [chatId, setChatId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allChats, setAllChats] = useState({});
  const [displayChats, setDisplayChats] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emptyList, setEmptyList] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const db = getFirestore(); // ← single instance

  // Listen to userChats
  useEffect(() => {
    if (!currentUser?.uid) return;

    const userChatsRef = doc(db, "userChats", currentUser.uid);

    const unsubscribe = onSnapshot(userChatsRef, (docSnap) => {
      if (!docSnap.exists()) {
        setAllChats({});
        setDisplayChats({});
        setEmptyList(true);
        return;
      }

      const rawData = docSnap.data() || {};
      const validChats = {};

      Object.entries(rawData).forEach(([chatIdKey, chat]) => {
        if (
          chat &&
          chat.date?.seconds != null &&
          chat.userInfo?.uid &&
          chat.lastMessage
        ) {
          validChats[chatIdKey] = chat;
        }
      });

      setAllChats(validChats);
      setDisplayChats(validChats);
      setEmptyList(Object.keys(validChats).length === 0);
    });

    return () => unsubscribe();
  }, [currentUser?.uid, db]);

  // Typing status listeners
  useEffect(() => {
    if (!currentUser?.uid || Object.keys(allChats).length === 0) return;

    const unsubscribes = [];

    Object.entries(allChats).forEach(([chatIdKey, chat]) => {
      const otherUserUid = chat?.userInfo?.uid;
      if (!otherUserUid) return;

      const typingRef = doc(
        db,
        "typingStatus",
        `${currentUser.uid}_${otherUserUid}`,
      );

      const unsubscribeTyping = onSnapshot(typingRef, (snap) => {
        setTypingStatus((prev) => ({
          ...prev,
          [otherUserUid]: snap.exists() ? snap.data()?.typing || false : false,
        }));
      });

      unsubscribes.push(unsubscribeTyping);
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [allChats, currentUser?.uid, db]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setDisplayChats(allChats);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = Object.fromEntries(
      Object.entries(allChats).filter(([, chat]) => {
        const name = chat?.userInfo?.displayName?.toLowerCase() || "";
        const lastMsg = chat?.lastMessage?.text?.toLowerCase() || "";
        return name.includes(lowerQuery) || lastMsg.includes(lowerQuery);
      }),
    );
    setDisplayChats(filtered);
  };

  const handleSingleChat = (item) => {
    const userData = item[1]?.userInfo;
    if (!userData) return;

    dispatch({ type: "CHANGE_USER", payload: userData });
    navigation?.navigate(routeName?.CHAT, {
      displayName: userData.displayName,
      uid: userData.uid,
      photoURL: userData.photoURL,
      user_id: userData.user_id,
    });
  };

  const handleSelectionMultiple = (item) => {
    const userUid = item[1]?.userInfo?.uid;
    if (!userUid) return;

    setSelectedItems((prev) =>
      prev.includes(userUid)
        ? prev.filter((id) => id !== userUid)
        : [...prev, userUid],
    );
    setChatId(item[0]);
  };

  const handleDeleteChat = async () => {
    if (!chatId) return;

    Alert.alert("Delete Chat", "Are you sure you want to delete this chat?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const userChatsRef = doc(db, "userChats", currentUser.uid);
          const chatDocRef = doc(db, "chats", chatId);

          try {
            setLoading(true);

            const chatSnap = await getDoc(chatDocRef);
            if (chatSnap.exists()) {
              const chatData = chatSnap.data();
              const messages = chatData?.messages || [];
              const updatedMessages = messages.map((msg) => ({
                ...msg,
                deletedFor: msg.deletedFor
                  ? [...new Set([...msg.deletedFor, currentUser.uid])]
                  : [currentUser.uid],
              }));
              await updateDoc(chatDocRef, { messages: updatedMessages });
            }

            await updateDoc(userChatsRef, {
              [chatId]: deleteField(),
            });

            setSelectedItems((prev) => prev.filter((id) => id !== chatId));
            dispatch({ type: "SWITCH_USER_NULL", payload: null });
          } catch (error) {
            console.error("Delete chat failed:", error);
            Alert.alert("Error", "Failed to delete chat. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const getModelDetails = async (item) => {
    const modelID = item?.[1]?.userInfo?.user_id;
    if (!modelID) return;
    // Your dispatch logic here...
    console.log("Fetching model details for user_id:", modelID);
  };

  const sortedChats = Object.entries(displayChats)
    .filter(([, chat]) => chat?.lastMessage)
    .sort((a, b) => (b[1]?.date?.seconds || 0) - (a[1]?.date?.seconds || 0));

  return (
    <>
      <Header
        text="Inbox"
        navigation={navigation}
        inbox={true}
        icon={
          selectedItems.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                width: "40%",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity onPress={handleDeleteChat} disabled={loading}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={30}
                  color={Colors.red}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedItems([])}>
                <Entypo name="cross" size={32} color={Colors.themeColor} />
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      <ScrollView>
        <Searchbar
          placeholder="Search chats..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={{
            borderRadius: 15,
            marginHorizontal: 10,
            marginVertical: 20,
          }}
        />

        {sortedChats.length > 0 ? (
          sortedChats.map((item) => {
            const chatData = item[1];
            const userInfo = chatData.userInfo || {};
            const isTyping = typingStatus[userInfo.uid] || false;
            const unread = chatData.unreadCount || 0;

            const timestamp = chatData.date;
            const msgTime = timestamp?.seconds
              ? new Date(timestamp.seconds * 1000).toISOString()
              : null;

            // Skip if no last message (already filtered but extra check)
            if (!chatData.lastMessage) return null;

            return (
              <TouchableOpacity
                key={item[0]}
                onPress={() =>
                  selectedItems.length > 0
                    ? handleSelectionMultiple(item)
                    : handleSingleChat(item)
                }
                onLongPress={() =>
                  selectedItems.length === 0 && handleSelectionMultiple(item)
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                  paddingVertical: 12,
                  backgroundColor: selectedItems.includes(userInfo.uid)
                    ? Colors.lightThemeColor
                    : Colors.white,
                  borderRadius: 12,
                  marginVertical: 6,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    // Your profile navigation logic
                    if ([11, 15].includes(userInfo.user_role)) {
                      getModelDetails(item);
                    } else if (userInfo.user_role === 12) {
                      navigation.navigate(routeName.CLIENT_PROFILE, {
                        userId: userInfo.user_id,
                      });
                    } else {
                      navigation.navigate(routeName.PHOTOGRAPHER_PROFILE, {
                        userId: userInfo.user_id,
                      });
                    }
                  }}
                >
                  {userInfo.photoURL ? (
                    <Image
                      source={{ uri: userInfo.photoURL }}
                      style={{
                        height: dimensionheight(6),
                        width: dimensionheight(6),
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: Colors.lightThemeColor,
                        marginRight: 12,
                      }}
                    />
                  ) : (
                    <FontAwesome
                      name="user-circle-o"
                      size={dimensionheight(6)}
                      color={Colors.gredient}
                      style={{ marginRight: 12 }}
                    />
                  )}
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                  <TextComponent
                    text={
                      chatData.pause_status === 1 ||
                      chatData.delete_account_status === 1 ||
                      chatData.user_block_status
                        ? "User"
                        : userInfo.displayName || "Unknown"
                    }
                    size={Sizes.l}
                    numberOfLines={1}
                  />
                  <TextComponent
                    text={
                      isTyping ? "typing..." : chatData.lastMessage?.text || ""
                    }
                    size={Sizes.s}
                    color={
                      isTyping
                        ? Colors.green
                        : unread > 0
                        ? Colors.black
                        : Colors.darkgrey
                    }
                    numberOfLines={1}
                  />
                </View>

                <View
                  style={{
                    alignItems: "flex-end",
                    minWidth: 80,
                    right: 10,
                  }}
                >
                  {msgTime && (
                    <TextComponent
                      text={timeSince(msgTime)}
                      size={Sizes.xs}
                      color={Colors.darkgrey}
                    />
                  )}
                  {unread > 0 && (
                    <View
                      style={{
                        backgroundColor: Colors.black,
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        marginTop: 4,
                      }}
                    >
                      <TextComponent
                        text={unread}
                        size={Sizes.xs}
                        color={Colors.white}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : emptyList ? (
          <View style={{ marginTop: 200, alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: Colors.darkgrey }}>
              No chats found
            </Text>
          </View>
        ) : null}

        <View style={{ height: 60 }} />
      </ScrollView>
    </>
  );
};
{
  /* {chatList?.length == 0 || item?.sender?.id == item?.receiver?.id ? (
        <View
          style={{
            // flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextComponent
            style={{ color: colors.darkgrey, fontSize: 20 }}
            title={"Chats Not Available"}
          />
        </View>
      ) : (
        <FlatList
          data={chatList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.ChatCardTouch}
              onPress={() => goToChatting(item)}
            >
              <Image
                source={Images?.postImg}
                style={{
                  height: dimensionheight("7%"),
                  width: dimensionWidth("14%"),
                  borderRadius: 100,
                }}
                resizeMode="contain"
              />
              <View
                style={{
                  width: dimensionWidth("50%"),
                  marginLeft: dimensionWidth("4%"),
                  marginTop: dimensionheight("0.5%"),
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  {item?.receiver?.name}
                </Text>
                <View style={{ flexDirection: "row", marginTop: dimensionheight("0.6%") }}>
                  <View style={{}}>
                    <Text
                      style={{
                        color: item?.unread_count == 0 ? "gray" : "black",
                        fontSize: 13,
                        fontWeight: item?.unread_count == 0 ? null : "bold",
                      }}
                    >
                      {item?.latest_chat?.message}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: dimensionheight("1%") }}>
                {/* {getDuration(item?.latest_chat_date) && (  
                <Text style={{ color: "black", fontSize: 12 }}>
                  {/* {getDuration(item?.latest_chat_date)}  
                  {/* {moment(item?.latest_chat_date)} 
                  {item?.latest_chat_date}
                </Text>
                {/* )}  
                {item?.unread_count == 0 ? null : (
                  <View
                    style={{
                      height: dimensionheight("2.5%"),
                      width: dimensionWidth("6%"),
                      borderRadius: 50,
                      backgroundColor: Themecolor,
                      alignSelf: "flex-end",
                      marginRight: dimensionWidth("2%"),
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: dimensionheight("1%"),
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 13,
                        fontWeight: "800",
                      }}
                    >
                      {item?.unread_count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )} */
}

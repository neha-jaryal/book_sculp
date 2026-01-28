import React, { memo, useCallback, useContext, useRef, useState } from "react";
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
import { useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import {
  doc,
  onSnapshot,
  updateDoc,
  deleteField,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../Utility/Firebase";
export const Inbox = memo(({ navigation }) => {
  // const dispatch = useDispatch();
  const swipeRef = useRef(null);
  const [typingStatus, setTypingStatus] = useState({});
  const [isDelete, setIsDelete] = useState(false);
  const [chatId, setChatId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatList, setChatList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [swiperHide, setSwiperHide] = useState(true);
  const [swipedItems, setSwipedItems] = useState({});
  const [swipeableRef, setSwipeableRef] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [emptyList, setEmptyList] = useState(false);
  let arr = chatList;
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  console.log("currentUsercurrentUser----", currentUser);
  useEffect(() => {
    const unsub = getChats();
    return () => unsub();
  }, [currentUser?.uid]);

  const getChats = useCallback(() => {
    const unsub = onSnapshot(
      doc(db, "userChats", currentUser?.uid),
      async (docs) => {
        const chatData = docs.data();
        setChatList(chatData);
        if (chatData) {
          Object.entries(chatData).forEach(async ([chatId, chat]) => {
            const chatRef = doc(db, "chats", chatId);
            const typingStatusRef = doc(
              db,
              "typingStatus",
              `${currentUser?.uid}_${chat?.userInfo?.uid}`
            );
            // const messageStatus = onSnapshot(chatRef, (chatDoc) => {
            //   const messages = chatDoc.data()?.messages || [];
            //   messages.forEach(async (message) => {
            //     if (
            //       message.status === "sent" &&
            //       message?.receiverId === currentUser?.uid
            //     ) {
            //       // Update message status to "delivered"
            //       const messageIndex = messages.findIndex(
            //         (m) => m.id === message.id
            //       );
            //       messages[messageIndex].status = "delivered";
            //       await updateDoc(chatRef, { messages });
            //     }
            //   });
            // });

            // Track typing status
            const typingStatus = onSnapshot(typingStatusRef, (typingDoc) => {
              if (typingDoc.exists()) {
                setTypingStatus((prevStatus) => ({
                  ...prevStatus,
                  [chat?.userInfo?.uid]: typingDoc.data()?.typing,
                }));
              }
            });
            return () => {
              // messageStatus();
              typingStatus();
            };
          });
        }
      }
    );
    return () => unsub();
  }, [currentUser?.uid]);

  console.log("chatListtttt--------", chatList);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query?.length != 0) {
      let arr = chatList;
      var expr = new RegExp(query, "gi");
      var wordList = arr.filter(
        (elem) =>
          expr.test(elem[1]?.userInfo?.displayName) ||
          expr.test(elem[1]?.lastMessage?.text)
      );
      setChatList(wordList);
    } else {
      getChats();
    }
  };

  // // useEffect(() => {
  // //   chatList?.map((item) => {
  // //     if (item?.opened == false) {
  // //       if (swipeRef) {
  // //         swipeRef.current.close();
  // //       }
  // //     }
  // //   });
  // // });
  // // const closeSwipeable = () => {
  // //   if (swipeableRef) {
  // //     swipeableRef.current.close();
  // //   }
  // // };
  // const handleSwipeItem = (item, status) => {
  //   let temp = chatList;
  //   temp?.map((ele) =>
  //     ele == item ? ele.opened == true : ele.opened == false
  //   );
  //   console.log("temp-------", temp);
  //   let arr = [];
  //   temp?.map((item) => {
  //     arr?.push(item);
  //   });
  //   setChatList(arr);
  // };

  // const getAllChatList = async () => {
  //   let userId = await getData(storageKey?.USER_ID);
  //   let userRole = await getData(storageKey?.USER_ROLE);
  //   setUserRole(userRole);
  //   var body = {
  //     user_id: userId,
  //   };
  //   let res = await dispatch(getChatList(body));
  //   if (res?.status == 200) {
  //     if (res?.results?.length == 0) {
  //       setEmptyList(true);
  //       setChatList([]);
  //     } else {
  //       setEmptyList(false);
  //       setChatList(res?.results);
  //     }
  //     // const updatedChatList = res?.results.map((item) => ({
  //     //   ...item,
  //     //   opened: false,
  //     // }));

  //     // setChatList(updatedChatList);
  //   }
  // };
  // console.log("chatlisttttttttt--------", JSON.stringify(chatList));

  const handleSingleChat = async (item) => {
    const userData = item[1]?.userInfo;

    dispatch({ type: "CHANGE_USER", payload: userData });
    navigation?.navigate(routeName?.CHAT, {
      displayName: userData?.displayName,
      uid: userData?.uid,
      photoURL: userData?.photoURL,
      user_id: userData?.user_id,
    });
  };
  const handleSelectionMultiple = (item) => {
    const userData = item[1]?.userInfo;
    setChatId(item[0]);
    var selectedIds = [...selectedItems];
    if (selectedIds.includes(userData?.uid)) {
      selectedIds = selectedIds.filter((ele, index) => ele !== userData?.uid);
    } else {
      selectedIds.push(userData?.uid);
    }
    setSelectedItems(selectedIds);
  };

  // const closeSwipeable = () => {
  //   if (swipeableRef) {
  //     swipeableRef.close();
  //   }
  // };

  // const deleteChat = async (item) => {
  //   let userId = await getData(storageKey?.USER_ID);

  //   var body = {
  //     action: "mutliple",
  //     // action: "mutliple",
  //     // action: "message",
  //     user_id: userId,
  //     chat_to: selectedItems,
  //   };
  //   setSwiperHide(false);
  //   let res = await dispatch(clearUserChat(body));
  //   if (res?.status == 200) {
  //     getAllChatList();
  //     setSelectedItems([]);
  //     setSwiperHide(true);
  //   }
  // };
  const handleDeleteChat = async (item) => {
    Alert.alert("Are you sure?", "You want to delete this chat.", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => deleteChat(item),
      },
    ]);
  };
  const getModelDetails = async (item) => {
    let modelID = item?.user_id;
    var body = {
      user_id: modelID,
    };
    let res = await dispatch(getUserDetail(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.MODEL_PROFILE, {
        modelData: res?.results,
      });
    }
  };

  const deleteChat = async () => {
    const userChatsRef = doc(db, "userChats", currentUser.uid);
    const chatDocRef = doc(db, "chats", chatId);

    try {
      setLoading(true);
      const chatDoc = await getDoc(chatDocRef);
      const chatData = chatDoc.data();
      const messages = chatData?.messages || [];
      const updatedMessages = messages.map((message) => {
        return {
          ...message,
          deletedFor: message.deletedFor
            ? [...message.deletedFor, currentUser.uid]
            : [currentUser.uid],
        };
      });
      await updateDoc(chatDocRef, {
        messages: updatedMessages,
      });

      await updateDoc(userChatsRef, {
        [chatId]: deleteField(),
      });

      console.log("Chat with user", chatId, "successfully deleted!");
      const updatedChatsDoc = await getDoc(userChatsRef);
      if (updatedChatsDoc.exists()) {
        const updatedChats = updatedChatsDoc?.data();
        console.log("updatedChatsupdatedChats----", updatedChats);
        setChatList(updatedChats || []);
        dispatch({ type: "SWITCH_USER_NULL", payload: null });
      } else {
        setChatList([]);
      }
      setLoading(false);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error removing chat:", error);
    }
  };
  return (
    <>
      <Header
        text={"Inbox"}
        navigation={navigation}
        inbox={true}
        icon={
          selectedItems?.length != 0 ? (
            <View
              style={{
                ...Styles?.flexRow,
                alignSelf: "flex-end",
                width: "40%",
              }}
            >
              <TouchableOpacity onPress={() => handleDeleteChat()}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={30}
                  color={Colors?.red}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedItems([])}>
                <Entypo name="cross" size={32} color={Colors?.themeColor} />
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      <ScrollView>
        <Searchbar
          placeholder="Search..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          loading={true}
          style={{
            borderRadius: 15,
            marginHorizontal: 10,
            marginVertical: 20,
            // padding: 5,
          }}
        />
        {chatList?.length != 0 ? (
          Object.entries(chatList)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map((item) => {
              const userInfo = item[1]?.userInfo;
              const isTyping = typingStatus[userInfo?.uid];
              let date = item[1]?.date;
              const seconds = date?.seconds ?? 0;
              const nanoseconds = date?.nanoseconds ?? 0;
              const milliseconds = new Date(
                seconds * 1000 + nanoseconds / 1000000
              ).toISOString();

              console.log(
                "itemitem----------",
                userInfo?.displayName,
                userInfo?.uid
              );

              if (!item[1]?.lastMessage) {
                return null;
              }
              return (
                <>
                  <TouchableOpacity
                    // onPress={() => handleSingleChat(item)}
                    onPress={() =>
                      selectedItems?.length != 0 ||
                      selectedItems.includes(item[1]?.userInfo?.uid)
                        ? handleSelectionMultiple(item)
                        : handleSingleChat(item)
                    }
                    onLongPress={() =>
                      selectedItems?.length != 0
                        ? null
                        : handleSelectionMultiple(item)
                    }
                    key={item[0]}
                    style={{
                      ...Styles?.container,
                      ...Styles?.flexRow,
                      marginHorizontal: 10,
                      width: "95%",
                      // padding: 20,
                      backgroundColor: selectedItems.includes(
                        item[1]?.userInfo?.uid
                      )
                        ? Colors?.lightThemeColor
                        : Colors?.white,
                      marginTop: 0,
                      marginVertical: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        item?.user_role == 11 || item?.user_role == 15
                          ? getModelDetails(item)
                          : item?.user_role == 12
                          ? navigation?.navigate(routeName?.CLIENT_PROFILE, {
                              userId: item?.user_id,
                            })
                          : navigation?.navigate(
                              routeName?.PHOTOGRAPHER_PROFILE,
                              {
                                userId: item?.user_id,
                              }
                            )
                      }
                    >
                      {userInfo?.photoURL ? (
                        <Image
                          source={{ uri: userInfo?.photoURL }}
                          style={{
                            height: dimensionheight(6),
                            width: dimensionheight(6),
                            borderRadius: 100,
                            borderWidth: 2,
                            borderColor: Colors?.lightThemeColor,
                          }}
                        />
                      ) : (
                        <FontAwesome
                          name="user-circle-o"
                          size={50}
                          color={Colors?.gredient}
                        />
                      )}
                    </TouchableOpacity>
                    {/* <FontAwesome
                  name="user-circle-o"
                  size={50}
                  color={Colors?.gredient}
                /> */}

                    <View
                      style={{
                        width:
                          item?.[1]?.unreadCount > 0
                            ? dimensionWidth("35%")
                            : dimensionWidth("45%"),
                      }}
                    >
                      <TextComponent
                        text={
                          item?.pause_status == 1 ||
                          item?.delete_account_status == 1 ||
                          item?.user_block_status
                            ? "User"
                            : userInfo?.displayName
                        }
                        size={Sizes?.l}
                        numberOfLines={1}
                      />
                      <TextComponent
                        text={
                          isTyping ? "typing" : item?.[1]?.lastMessage?.text
                        }
                        size={Sizes?.s}
                        color={
                          isTyping
                            ? Colors?.green
                            : item?.[1]?.unreadCount > 0
                            ? Colors?.black
                            : Colors?.darkgrey
                        }
                        numberOfLines={1}
                      />
                    </View>

                    <TextComponent
                      text={timeSince(milliseconds)}
                      size={Sizes?.xs}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                      style={{
                        width: 80,
                        textAlign: "right",
                      }}
                    />
                    {item?.[1]?.unreadCount > 0 && (
                      <View
                        style={{
                          backgroundColor: Colors?.black,
                          paddingVertical: 3,
                          paddingHorizontal: 8,
                          borderRadius: 100,
                        }}
                      >
                        <TextComponent
                          text={item?.[1]?.unreadCount}
                          size={Sizes?.xs}
                          color={Colors?.white}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  {/* <Swipeable
                ref={swipeRef}
                // onSwipeableWillOpen={() =>}
                style={{ marginVertical: 20 }}
                // onSwipeableOpen={() => {
                //   setSwiperHide(true);
                //   // handleSwipeItem(item, true);
                //   // setSwipedItems(item);
                // }}
                // renderRightActions={
                //   () => (
                //     // swiperHide ? (
                //     <TouchableOpacity
                //       onPress={() => handleDeleteChat(item)}
                //       style={{
                //         alignContent: "center",
                //         justifyContent: "center",
                //         width: "30%",
                //       }}
                //     >
                //       <MaterialCommunityIcons
                //         name="delete"
                //         size={35}
                //         color={Colors?.red}
                //         style={{
                //           alignSelf: "flex-end",
                //           justifyContent: "center",
                //           paddingHorizontal: 10,
                //         }}
                //       />
                //     </TouchableOpacity>
                //   )
                //   // ) : null
                // }
                // onSwipeableWillOpen={closeSwipeable}
              >
              
              </Swipeable> */}
                </>
              );
            })
        ) : emptyList ? (
          <View style={{ marginTop: 250 }}>
            <Text style={{ textAlign: "center" }}>No Chat Found</Text>
          </View>
        ) : null}
        <View style={{ height: 30 }} />
      </ScrollView>
    </>
  );
});

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

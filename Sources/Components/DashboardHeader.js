import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, dimensionheight, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
import { TextComponent } from "./TextComponent";
import { routeName } from "../Utility/routeName";
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { navigatorStatus } from "../Redux/Actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";
import { getData, storageKey, storeData } from "../Utility/Storage";
import { getUserDetail } from "../Redux/Services/AuthServices";
import { getNotificationBadge } from "../Redux/Services/OtherServices";
import { GET_CHAT_BADGE, GET_NOTIFICATION_BADGE } from "../API Services/Url";
import { getAccountApproval } from "../Utility";
import { db } from "../Utility/Firebase"; // your default firestore instance
import { AuthContext } from "../Context/AuthContext";
import notifee from '@notifee/react-native';

export const DashboardHeader = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const { guest } = props;
  const [userData, setUserData] = useState("");
  const [userRole, setUserRole] = useState("");
  const [chatCount, setChatCount] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const [count, setCount] = useState({
    notification: 0,
    badge: false,
  });
  const [approvalStatus, setApprovalStatus] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [])
  );

  const getAccountApprovalStatus = async () => {
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    setApprovalStatus(accountApproval);
  };

  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    let userRole = await getData(storageKey?.USER_ROLE);
    setUserRole(userRole);
    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res.status == 200) {
        setUserData(res.results);
        let response = await dispatch(
          getNotificationBadge(body, GET_NOTIFICATION_BADGE)
        );
        getAccountApprovalStatus();
        if (response?.status == 200) {
          let notificationCount = JSON.parse(response?.results.count);
          setCount({
            ...count,
            badge: response?.results.count_status,
            notification: notificationCount,
          });
          const totalBadgeCount = chatCount + notificationCount;
          await notifee.setBadgeCount(totalBadgeCount);
        }
      }
    }
  };

  const handleNotificationCount = async () => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      action: "update_count_status",
      user_id: userID,
    };
    let res = await dispatch(
      getNotificationBadge(body, GET_NOTIFICATION_BADGE)
    );
    if (res?.status == 200) {
      props?.navigation?.navigate(routeName?.NOTIFICATIONS);
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      const unsubscribe = getChats();
      return unsubscribe;
    }
  }, [currentUser?.uid]);

  const getChats = () => {
    const unsub = db
      .collection("userChats")
      .doc(currentUser.uid)
      .onSnapshot(
        (docSnapshot) => {
          const chatData = docSnapshot.data();
          if (chatData) {
            let counts = 0;
            Object.entries(chatData).forEach(([chatId, chat]) => {
              counts += chat?.unreadCount || 0;
            });
            setChatCount(counts);
          } else {
            setChatCount(0);
          }
        },
        (error) => {
          console.error("Firestore chat listener error:", error);
          setChatCount(0); // optional fallback
        }
      );

    return () => unsub();
  };

  return (
    <View style={Styles?.dashboardHeader}>
      <View style={styling?.logoView}>
        {auth?.navigator == routeName?.DRAWER && auth?.success == false ? (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Feather name="align-left" size={22} color={Colors?.black} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() =>
            auth?.navigator == routeName?.GUEST_STACKS
              ? navigation?.navigate(routeName?.GUEST_DASHBOARD)
              : null
          }
        >
          <Image source={Images?.logo} style={styling?.logoImg} />
        </TouchableOpacity>
      </View>
      {(auth?.navigator == routeName?.DRAWER && auth?.success == false) ||
      auth?.navigator == routeName?.GUEST_STACKS ? (
        <View
          style={{
            ...styling?.logoView,
            width: "40%",
            justifyContent: "space-between",
          }}
        >
          {guest || auth?.navigator == routeName?.GUEST_STACKS ? (
            <>
              <TouchableOpacity
                onPress={() => navigation?.navigate(routeName?.SEARCH_STACKS)}
              >
                <Ionicons name={"search"} color={Colors?.black} size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation?.navigate(routeName?.SIGNIN);
                  dispatch(navigatorStatus(routeName?.AUTHSTACKS, false, ""));
                }}
                style={{
                  ...Styles?.smallButton,
                  backgroundColor: Colors?.themeColor,
                }}
              >
                <TextComponent
                  text="Login"
                  color={Colors?.white}
                  size={Sizes?.s}
                  style={{ paddingHorizontal: 8 }}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styling.container}
                onPress={() => handleNotificationCount()}
              >
                <FontAwesome name="bell-o" size={23} color={Colors?.black} />
                {count?.notification > 0 && count?.badge ? (
                  <View style={styling.badgeContainer}>
                    <TextComponent
                      text={
                        count?.notification > 99 ? "99+" : count?.notification
                      }
                      color={Colors?.white}
                      size={10}
                    />
                  </View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styling.container }}
                onPress={() =>
                  approvalStatus
                    ? props?.navigation?.navigate(routeName?.INBOX)
                    : getAccountApproval(true, props?.navigation, auth)
                }
              >
                <Fontisto name="messenger" size={23} color={Colors?.black} />
                {chatCount > 0 && (
                  <View style={styling.badgeContainer}>
                    <TextComponent
                      text={chatCount > 99 ? "99+" : chatCount}
                      color={Colors?.white}
                      size={10}
                    />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  userRole == 11 || userRole == 15
                    ? navigation?.navigate(routeName?.MODEL_PROFILE, {
                        userId: userData?.user_data?.user_id,
                      })
                    : userRole == 12
                    ? navigation?.navigate(routeName?.CLIENT_PROFILE, {
                        userId: userData?.user_data?.user_id,
                      })
                    : navigation?.navigate(routeName?.PHOTOGRAPHER_USER_PROFILE)
                }
              >
                {userData &&
                userData?.profile_image &&
                userData?.profile_image?.length != 0 &&
                userData?.profile_image[0]?.guid ? (
                  <Image
                    source={{ uri: userData?.profile_image[0]?.guid }}
                    resizeMode="cover"
                    style={styling.profileImage}
                  />
                ) : (
                  <Image
                    source={Images.dummyUser}
                    resizeMode="cover"
                    style={styling.profileImage}
                  />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styling = StyleSheet.create({
  logoView: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "35%",
    alignItems: "center",
  },
  logoImg: {
    width: 70,
    height: 35,
  },
  profileImage: {
    width: dimensionheight(5),
    height: dimensionheight(5),
    borderRadius: dimensionheight(100),
  },
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: -2,
    borderRadius: 20,
    minWidth: 24,
    height: 24,
    backgroundColor: Colors?.pink,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 8,
  },
});
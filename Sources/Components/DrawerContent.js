import React, { useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  Colors,
  dimensionheight,
  dimensionWidth,
  Images,
  Sizes,
} from "../Constants";
import { routeName } from "../Utility";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import { TextComponent } from "./TextComponent";
import { Styles } from "../Styles";
import { getUserDetail, userLogout } from "../Redux/Services/AuthServices";
import { getData, storageKey } from "../Utility/Storage";
import { Loader } from "./Loader";
import { navigatorStatus } from "../Redux/Actions/AuthActions";
import auth from "@react-native-firebase/auth";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../Utility/Firebase";

export const CustomDrawerContent = ({ navigation }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state?.authReducer);
  const [showItems, setShowItems] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [drawerItem, setDrawerItem] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [approvalStatus])
  );
  useFocusEffect(
    React.useCallback(() => {
      getAccountApprovalStatus();
    }, [userRole, drawerItem])
  );
  useFocusEffect(
    React.useCallback(() => {
      getUserRole();
    }, [userData])
  );
  const getAccountApprovalStatus = async () => {
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    setApprovalStatus(accountApproval);
  };
  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res.status == 200) {
        setUserData(res.results);
      }
    }
  };

  const getUserRole = async () => {
    let userRole = await getData(storageKey?.USER_ROLE);
    setUserRole(userRole);
    if (userData?.user_data?.user_id) {
      if (userRole == 11 || userRole == 13 || userRole == 15) {
        setDrawerItem(freelancerDrawerItems);
      } else if (userRole == 12 || userRole == 14) {
        setDrawerItem(employerDrawerItems);
      } else if (auth?.navigator == routeName?.GUEST_STACKS) {
        setDrawerItem(guestUserDrawerItems);
      } else {
        setDrawerItem(adminDrawerItems);
      }
    }
  };
  const shouldHideItem = (showForGuest = false) => {
    const subscriptionProId = userData?.user_data?.subscription_pro_id;
    if (showForGuest) return false;
    return !approvalStatus || !subscriptionProId;
  };

  const iconProps = { color: Colors.themeColor, size: 18 };
  const makeIcon = (Component, name, extraStyle = {}) => (
    <Component name={name} {...iconProps} style={extraStyle} />
  );

  const employerDrawerItems = [
    {
      icon: <FontAwesome name="edit" size={16} color={Colors.white} />,
      heading: "Edit Application",
      path: [11, 12, 15].includes(userRole)
        ? routeName.EDIT_PROFILE
        : routeName.EDIT_PHOTOGRAPHER,
      hide: !approvalStatus ? false : true,
    },
    {
      icon: makeIcon(FontAwesome, "dashboard"),
      heading: "Dashboard",
      path: routeName.USER_DASHBOARD,
      hide: !approvalStatus,
    },
    {
      icon: makeIcon(Ionicons, "settings"),
      heading: "Settings",
      innerList: [
        {
          icon: makeIcon(FontAwesome, "edit"),
          heading: "Edit Profile",
          path: routeName.EDIT_PROFILE,
        },
        {
          icon: makeIcon(FontAwesome, "user"),
          heading: "Manage Account",
          path: routeName.MANAGE_ACCOUNT,
        },
        {
          icon: makeIcon(AntDesign, "profile"),
          heading: "Transaction History",
          path: routeName.PAYOUT_HISTORY,
        },
        {
          icon: makeIcon(AntDesign, "setting"),
          heading: "Other Settings",
          path: routeName.SETTINGS,
        },
      ],
      hide: !approvalStatus,
    },
    {
      icon: makeIcon(FontAwesome, "envelope", { marginLeft: 2 }),
      heading: "Inbox",
      path: routeName.INBOX,
      hide: !approvalStatus,
    },
    {
      icon: makeIcon(MaterialIcons, "verified"),
      heading: "Identity Verification",
      path: routeName.IDENTITY_VERIFICATION,
      hide: !approvalStatus,
    },
    {
      icon: makeIcon(FontAwesome, "suitcase"),
      heading: "Post a Job",
      path: routeName.POST_JOB,
      hide: !approvalStatus,
    },
    {
      icon: makeIcon(Feather, "cast"),
      heading: "Post Casting Calls",
      path: routeName.CASTING_CALLS,
      hide: !approvalStatus,
    },
    {
      icon: makeIcon(MaterialIcons, "live-help"),
      heading: "Help & Support",
      path: routeName.HELP_SUPPORT,
    },
    {
      icon: makeIcon(MaterialCommunityIcons, "logout"),
      heading: "Log Out",
      path: routeName.SIGNIN,
    },
  ];

  const freelancerDrawerItems = [
    {
      icon: makeIcon(FontAwesome, "edit"),
      heading: "Edit Application",
      path: [11, 12, 15].includes(userRole)
        ? routeName.EDIT_PROFILE
        : userRole === 13
        ? routeName.EDIT_PHOTOGRAPHER
        : routeName.EDIT_PROFILE,
      hide: !shouldHideItem(),
    },
    {
      icon: makeIcon(FontAwesome, "dashboard"),
      heading: "Dashboard",
      path: routeName.USER_DASHBOARD,
      hide: shouldHideItem(),
    },
    {
      icon: makeIcon(Feather, "package"),
      heading: "Package Setting",
      path: routeName.PACKAGES,
      hide: shouldHideItem(),
    },
    {
      icon: makeIcon(Ionicons, "settings"),
      heading: "Settings",
      innerList: [
        {
          icon: makeIcon(FontAwesome, "edit"),
          heading: "Edit Profile",
          path: routeName.EDIT_PROFILE,
        },
        {
          icon: makeIcon(FontAwesome, "credit-card"),
          heading: "Payout Settings",
          path: routeName.PAYOUT_SETTING,
        },
        {
          icon: makeIcon(FontAwesome, "user"),
          heading: "Manage Account",
          path: routeName.MANAGE_ACCOUNT,
        },
        {
          icon: makeIcon(AntDesign, "setting", { marginLeft: -2 }),
          heading: "Other Settings",
          path: routeName.SETTINGS,
        },
      ],
      hide: shouldHideItem(),
    },
    {
      icon: makeIcon(FontAwesome, "envelope", { marginLeft: 2 }),
      heading: "Inbox",
      path: routeName.INBOX,
      hide: shouldHideItem(),
    },
    {
      icon: makeIcon(MaterialIcons, "verified"),
      heading: "Identity Verification",
      path: routeName.IDENTITY_VERIFICATION,
      hide: !shouldHideItem(),
    },
    {
      icon: makeIcon(MaterialIcons, "live-help"),
      heading: "Help & Support",
      path: routeName.HELP_SUPPORT,
      hide: false, // always visible
    },
    {
      icon: makeIcon(MaterialCommunityIcons, "logout"),
      heading: "Log Out",
      path: routeName.SIGNIN,
      hide: false, // always visible
    },
  ];

  const guestUserDrawerItems = [
    {
      icon: makeIcon(Ionicons, "settings", { marginLeft: -3 }),
      heading: "Settings",
      innerList: [
        {
          icon: makeIcon(FontAwesome, "credit-card"),
          heading: "Payout Settings",
          path: routeName.PACKAGES,
        },
        {
          icon: makeIcon(AntDesign, "setting"),
          heading: "Other Settings",
          path: routeName.SETTINGS,
        },
      ],
    },
    {
      icon: makeIcon(MaterialIcons, "live-help"),
      heading: "Help & Support",
      path: routeName.HELP_SUPPORT,
    },
    {
      icon: makeIcon(MaterialCommunityIcons, "logout"),
      heading: "Go to Login",
      path: routeName.SIGNIN,
    },
  ];

  const adminDrawerItems = [
    {
      icon: makeIcon(FontAwesome, "dashboard", { marginLeft: -3 }),
      heading: "Dashboard",
      path: routeName.USER_DASHBOARD,
    },
    {
      icon: makeIcon(FontAwesome, "envelope", { marginLeft: 2 }),
      heading: "Inbox",
      path: routeName.INBOX,
    },
    {
      icon: makeIcon(FontAwesome, "users", { marginLeft: -3 }),
      heading: "Users",
      innerList: [
        {
          icon: makeIcon(FontAwesome5, "users"),
          heading: "Talents",
          path: routeName.MODELS_LIST,
        },
        {
          icon: makeIcon(FontAwesome5, "user-tie"),
          heading: "Clients",
          path: routeName.CLIENTS_LIST,
        },
      ],
    },
    {
      icon: makeIcon(MaterialCommunityIcons, "logout"),
      heading: "Log Out",
      path: routeName.SIGNIN,
    },
  ];

  const goToScreen = (route) => {
    if (userRole) {
      navigation.closeDrawer();
      navigation.navigate(route);
    }
  };

  const logout = async () => {
    navigation.closeDrawer();
    const userId = await getData(storageKey?.USER_ID);
    const fcmToken = await getData(storageKey?.FCM_TOKEN);
    await dispatch(
      userLogout({
        user_id: userId,
        device_token: JSON?.parse(fcmToken),
      })
    );
    dispatch(navigatorStatus(routeName?.AUTHSTACKS, false, ""));

    if (firebaseAuth) {
      await signOut(firebaseAuth);
    } else if (auth().currentUser) {
      await auth().signOut();
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Are you sure?",
      "You want to Log out for now. You can login to this account again.",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => logout() },
      ]
    );
  };

  return (
    <SafeAreaView>
      {userData ? (
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
          style={{ ...styles.imageView, backgroundColor: Colors.themeColor }}
        >
          <View style={styles.imageStyle}>
            {userData && userData?.profile_image ? (
              <Image
                source={{
                  uri: userData?.profile_image[0]?.guid,
                }}
                resizeMode="cover"
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={Images.dummyUser}
                resizeMode="cover"
                style={styles.profileImage}
              />
            )}
          </View>
          <View
            style={{
              marginHorizontal: 10,
              alignSelf: "center",
              width: dimensionWidth("40%"),
            }}
          >
            <TextComponent
              text={
                userData?.user_data?.full_name
                  ? userData?.user_data?.full_name
                  : userData?.user_data?.first_name +
                    userData?.user_data?.last_name
              }
              size={Sizes?.xl}
              color={Colors?.white}
              fontWeight="400"
            />
            <TextComponent
              text={
                userData?.fw_option[0]?.tag_line
                  ? userData?.fw_option[0]?.tag_line
                  : userData?.fw_option[0]?.freelancer_type
              }
              style={{ textTransform: "capitalize" }}
              size={Sizes?.xs}
              color={Colors?.white}
              fontWeight="400"
            />
          </View>
        </TouchableOpacity>
      ) : (
        <Loader loading={auth?.isLoading} />
      )}

      <View
        style={{
          paddingVertical: 20,
          height: dimensionheight("100%"),
        }}
        key={Math.random()}
      >
        {drawerItem.map((data, index) => {
          return (
            <>
              {!data?.hide && (
                <>
                  <TouchableOpacity
                   key={data.id || index.toString()}
                    onPress={() => {
                      data?.innerList
                        ? setShowItems(!showItems)
                        : data?.heading == "Log Out"
                        ? handleLogout()
                        : goToScreen(data.path, data);
                    }}
                    style={{ ...Styles.row }}
                  >
                    <View
                      style={{
                        ...Styles.row,
                        width: "85%",
                        marginVertical: 2,
                        marginLeft: 15,
                      }}
                    >
                      {data?.icon}
                      <TextComponent
                        text={data.heading}
                        size={Sizes?.l}
                        color={Colors?.black}
                        fontWeight="400"
                        style={{ marginLeft: 15 }}
                      />
                    </View>
                    {data?.innerList && (
                      <FontAwesome
                        name="angle-right"
                        size={16}
                        color={Colors?.black}
                      />
                    )}
                  </TouchableOpacity>
                  <View style={{ marginVertical: 10 }}>
                    {showItems
                      ? data?.innerList?.map((item, index) => {
                          return (
                            <>
                              <TouchableOpacity
                               key={item.id || index.toString()}
                                onPress={() => {
                                  goToScreen(item.path, item);
                                }}
                                style={{
                                  ...Styles?.row,
                                  marginLeft: 30,
                                  padding: 10,
                                  width: "85%",
                                }}
                              >
                                {item?.icon}
                                <TextComponent
                                  text={item.heading}
                                  size={Sizes?.l}
                                  color={Colors?.black}
                                  fontWeight="400"
                                  style={{ marginLeft: 15 }}
                                />
                              </TouchableOpacity>
                            </>
                          );
                        })
                      : null}
                  </View>
                </>
              )}
            </>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  imageView: {
    flexDirection: "row",
    alignSelf: "center",
    height: 100,
    width: "100%",
    paddingHorizontal: 10,
  },
  imageStyle: {
    alignSelf: "center",
  },
  profileImage: {
    width: dimensionheight(8),
    height: dimensionheight(8),
    borderRadius: dimensionheight(100),
  },
  drawerIcons: {
    marginHorizontal: 12,
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  draweList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  draweListTouch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
    width: "90%",
    marginHorizontal: 10,
    padding: 5,
  },
});

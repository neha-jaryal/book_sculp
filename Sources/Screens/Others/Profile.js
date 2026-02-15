import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextComponent, Loader, Header } from "../../Components";
import { Sizes, Colors, Images, dimensionheight } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetail, userLogout } from "../../Redux/Services/AuthServices";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import {
  clearData,
  getData,
  storageKey,
  storeData,
} from "../../Utility/Storage";
import { useFocusEffect } from "@react-navigation/native";
import FastImage from "@d11/react-native-fast-image";
import { showToast } from "../../Utility";
import auth from "@react-native-firebase/auth";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

export const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState("");
  const [userRole, setUserRole] = useState("");
  const auth = useSelector((state) => state?.authReducer);
  const [listItems, setListItems] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = ["60%", "90%"];

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
      getUserRole();
      getAccountApprovalStatus();
    }, [approvalStatus])
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
    if (userRole == 11 || userRole == 12) {
      setListItems(freelancerListItems);
    } else if (userRole == 13) {
      setListItems(photographerListItems);
    } else {
      setListItems(guestUserListItems);
    }
  };

  const freelancerListItems = [
    {
      key: 2,
      icon: <FontAwesome name="envelope" size={14} color={Colors?.white} />,
      name: "Inbox",
      path: routeName?.INBOX,
      hide: approvalStatus ? false : true,
    },
    {
      key: 2,
      icon: <FontAwesome name="edit" size={14} color={Colors?.white} />,
      name: "Edit Application",
      path: routeName?.EDIT_PROFILE,
      hide: !approvalStatus ? false : true,
    },
    {
      key: 2,
      icon: (
        <Entypo
          name="images"
          size={14}
          color={Colors?.white}
        />
      ),
      name: "Edit Profile & Gallery Images",
      path: routeName?.UPDATE_PROFILE_GALLERY,
      hide: !approvalStatus ? false : true,
    },
    {
      key: 1,
      icon: <FontAwesome name="dashboard" size={14} color={Colors?.white} />,
      name: "Dashboard",
      path: routeName?.USER_DASHBOARD,
      hide: approvalStatus ? false : true,
    },
    {
      key: 1,
      icon: <MaterialIcons name="live-help" size={14} color={Colors?.white} />,
      name: "Help & Support",
      path: routeName?.HELP_SUPPORT,
      hide: false,
    },
    {
      key: 1,
      icon: (
        <MaterialIcons
          name="connect-without-contact"
          size={14}
          color={Colors?.white}
        />
      ),
      name: "Contact Us",
      path: routeName?.CONTACT_US,
      hide: false,
    },
    {
      key: 1,
      icon: <Feather name="package" size={14} color={Colors?.white} />,
      name: "Settings",
      path: routeName?.SETTINGS,
      hide: approvalStatus ? false : true,
    },
    {
      key: 1,
      icon: <AntDesign name="logout" size={14} color={Colors?.white} />,
      name: "Log Out",
      path: routeName?.SIGNIN,
      hide: false,
    },
  ];

  const photographerListItems = [
    {
      key: 1,
      icon: <FontAwesome name="edit" size={14} color={Colors?.white} />,
      name: "Edit Application",
      path: routeName?.EDIT_PHOTOGRAPHER,
      hide: !approvalStatus ? false : true,
    },
    {
      key: 2,
      icon: <Entypo name="images" size={14} color={Colors?.white} />,
      name: "Edit Profile & Gallery Images",
      path: routeName?.UPDATE_PROFILE_GALLERY,
      hide: !approvalStatus ? false : true,
    },
    {
      key: 2,
      icon: <FontAwesome name="envelope" size={14} color={Colors?.white} />,
      name: "Inbox",
      path: routeName?.INBOX,
      hide: approvalStatus ? false : true,
    },
    {
      key: 1,
      icon: <FontAwesome name="dashboard" size={14} color={Colors?.white} />,
      name: "Dashboard",
      path: routeName?.USER_DASHBOARD,
      hide: approvalStatus ? false : true,
    },
    {
      key: 1,
      icon: (
        <MaterialIcons
          name="connect-without-contact"
          size={14}
          color={Colors?.white}
        />
      ),
      name: "Contact Us",
      path: routeName?.CONTACT_US,
      hide: false,
    },
    {
      key: 1,
      icon: <Feather name="package" size={14} color={Colors?.white} />,
      name: "Settings",
      path: routeName?.SETTINGS,
      hide: approvalStatus ? false : true,
    },
    {
      key: 1,
      icon: <AntDesign name="logout" size={14} color={Colors?.white} />,
      name: "Log Out",
      path: routeName?.SIGNIN,
      hide: false,
    },
  ];

  const guestUserListItems = [
    {
      key: 1,
      icon: (
        <MaterialIcons
          name="connect-without-contact"
          size={14}
          color={Colors?.white}
        />
      ),
      name: "Contact Us",
      path: routeName?.CONTACT_US,
    },
    {
      key: 1,
      icon: <MaterialIcons name="live-help" size={20} color={Colors?.white} />,
      name: "Help & Support",
      path: routeName?.HELP_SUPPORT,
    },
    {
      key: 1,
      icon: <MaterialIcons name="policy" size={14} color={Colors?.white} />,
      name: "Privacy Policy",
      path: routeName?.PRIVACY_POLICY,
    },
    {
      key: 1,
      icon: <Entypo name="documents" size={14} color={Colors?.white} />,
      name: "Terms of Services",
      path: routeName?.TERMS_OF_SERVICE,
    },
  ];

  const logout = async () => {
    let userID = await getData(storageKey?.USER_ID);
    let fcmToken = await getData(storageKey?.FCM_TOKEN);
    var body = {
      user_id: userID,
      device_token: JSON?.parse(fcmToken),
    };
    await dispatch(userLogout(body));
    dispatch(navigatorStatus(routeName?.AUTHSTACKS, false, ""));
    await auth().signOut();
  };

  const handleLogout = () => {
    Alert.alert(
      "Are you sure?",
      "You want to Log out for now. You can login to this account again.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleBackLogin = async () => {
    navigation?.navigate(routeName?.SIGNIN);
    dispatch(navigatorStatus(routeName?.AUTHSTACKS, false, ""));
  };

  return (
    <>
      <Loader loading={auth?.isLoading} />
      <TouchableOpacity
        onPress={() =>
          userRole == 11
            ? navigation?.navigate(routeName?.MODEL_PROFILE, {
                userId: userData?.user_data?.user_id,
              })
            : userRole == 12
            ? navigation?.navigate(routeName?.CLIENT_PROFILE, {
                userId: userData?.user_data?.user_id,
              })
            : navigation?.navigate(routeName?.PHOTOGRAPHER_USER_PROFILE)
        }
        style={{
          ...Styles?.headerContainer,
          borderBottomEndRadius: 0,
          borderBottomStartRadius: 0,
          height: Platform?.OS == "android" ? 250 : 280,
        }}
      >
        <View style={styling.logoView}>
          {userData?.profile_image ? (
            <FastImage
              source={{ uri: userData?.profile_image[0]?.guid }}
              style={{
                ...styling?.profileImg,
              }}
              resizeMode="cover"
            />
          ) : (
            <FontAwesome
              name={"user-circle-o"}
              size={120}
              color={Colors?.themeColor}
              style={{
                top: 10,
                marginVertical: 20,
              }}
            />
          )}

          {auth?.navigator == routeName?.GUEST_STACKS ? (
            <TextComponent text={"Guest User"} />
          ) : (
            <View
              style={{
                top: userData && !userData?.profile_image ? 0 : 15,
                marginVertical: 10,
                alignItems: "center",
              }}
            >
              <TextComponent
                text={
                  userData?.user_data?.full_name
                    ? userData?.user_data?.full_name
                    : userData?.user_data?.first_name +
                      userData?.user_data?.last_name
                }
                loading={auth?.isLoading}
                width={100}
                style={{ marginVertical: 5 }}
              />
              <TextComponent
                text={
                  userData?.company_details?.tag_line
                    ? userData?.company_details?.tag_line
                    : userData?.personal_details?.tag_line
                    ? userData?.personal_details?.tag_line
                    : userData?.post_meta_details?.tag_line
                }
                size={Sizes?.s}
                fontWeight="400"
                loading={auth?.isLoading}
                width={150}
              />
            </View>
          )}
        </View>

        <View style={{ height: 10 }} />
      </TouchableOpacity>

      <View
        style={{
          ...Styles?.row,
          ...Styles?.boxShadow,
          backgroundColor: Colors?.white,
          borderBottomEndRadius: 30,
          borderBottomStartRadius: 30,
          padding: 15,
        }}
      >
        {auth?.navigator == routeName?.GUEST_STACKS ? (
          <View style={{ height: 25 }} />
        ) : (
          <>
            <View style={styling?.userDeatilView}>
              <TextComponent
                text={
                  userData?.project_count_details?.followers_count
                    ? userData?.project_count_details?.followers_count
                    : 0
                }
                size={Sizes?.s}
                color={Colors?.themeColor}
              />
              <TextComponent
                text="Followers"
                size={Sizes?.xs}
                fontWeight="400"
              />
            </View>
            <View style={styling?.userDeatilView}>
              <TextComponent
                text={
                  userData?.project_count_details?.following_count
                    ? userData?.project_count_details?.following_count
                    : 0
                }
                size={Sizes?.s}
                color={Colors?.themeColor}
              />
              <TextComponent
                text="Following"
                size={Sizes?.xs}
                fontWeight="400"
              />
            </View>
            <View style={styling?.userDeatilView}>
              <TextComponent
                text={
                  userData?.project_count_details?.total_social_post_count
                    ? userData?.project_count_details?.total_social_post_count
                    : 0
                }
                size={Sizes?.s}
                color={Colors?.themeColor}
              />
              <TextComponent
                text="Social Posts"
                size={Sizes?.xs}
                fontWeight="400"
              />
            </View>
          </>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ ...Styles?.container, marginBottom: 20 }}>
          {listItems?.length != 0 &&
            listItems?.map((item, index) => {
              return (
                <>
                  {!item?.hide && (
                    <>
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          item.name == "Log Out" || item.name == "Back to Login"
                            ? handleLogout()
                            : item?.method
                            ? item?.method()
                            : navigation?.navigate(item?.path)
                        }
                        style={{
                          ...Styles?.flexRow,
                          paddingHorizontal: 20,
                          paddingVertical: 18,
                        }}
                      >
                        <View style={Styles?.row}>
                          <View
                            style={{
                              backgroundColor: Colors?.themeColor,
                              paddingVertical: 4,
                              borderRadius: 6,
                              paddingHorizontal: 8,
                            }}
                          >
                            {item?.icon}
                          </View>
                          <TextComponent
                            text={item?.name}
                            color={Colors?.black}
                            size={Sizes?.l}
                            fontWeight="400"
                            style={{ marginHorizontal: 15 }}
                          />
                        </View>
                        <FontAwesome name="angle-right" size={20} />
                      </TouchableOpacity>
                      {listItems?.length - 1 != index && (
                        <View
                          style={{ ...Styles?.separator, marginVertical: 0 }}
                        />
                      )}
                    </>
                  )}
                </>
              );
            })}
        </View>
      </ScrollView>

      {/* Shared Bottom Sheet (if you have any swipe-up modals left – can be used later) */}
      {/* <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["60%", "90%"]}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
        backgroundStyle={{ backgroundColor: Colors.white }}
      >
        {/* Add modal content here if needed in future */}
      {/* </BottomSheet> */}
    </>
  );
};

const styling = StyleSheet.create({
  headerTopView: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  logoView: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImg: {
    width: dimensionheight(16),
    height: dimensionheight(16),
    top: 20,
    borderRadius: dimensionheight(100),
    resizeMode: "cover",
  },
  userDeatilView: {
    width: "35%",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  profileImage: {
    width: dimensionheight(12),
    height: dimensionheight(12),
    borderRadius: dimensionheight(100),
  },
});
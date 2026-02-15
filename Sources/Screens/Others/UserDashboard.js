import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  InputBox,
  TextComponent,
  DropDownList,
  DashboardHeader,
} from "../../Components";
import { Sizes, Colors, Images } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import { isValidPhoneNumber, regName } from "../../Utility";
import { getData, storageKey } from "../../Utility/Storage";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { useDispatch } from "react-redux";
import { pastelColors } from "../../Constants/Colors";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export const UserDashboard = ({ navigation }) => {
  const [dashboardItems, setDashboardItems] = useState([]);
  const [userData, setUserData] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    handlePaymentStatus();
  }, []);

  useEffect(() => {
    getUserRole();
    getModelDetails();
  }, [paymentStatus]);

  const handlePaymentStatus = async () => {
    let paymentStatus = await getData(storageKey?.PAYMENT_STATUS);
    setPaymentStatus(JSON.parse(paymentStatus));
  };

  const getUserRole = async () => {
    let userRole = await getData(storageKey?.USER_ROLE);
    // const data = freelancerDashboardItems.concat(emloyerDashboardItems);
    // setDashboardItems(data?.concat(photographerDashboardItems));
    if (userRole == 11 || userRole == 15 || userRole == 13) {
      setDashboardItems(freelancerDashboardItems);
    } else if (userRole == 12) {
      setDashboardItems(emloyerDashboardItems);
    } else if (userRole == 13) {
      setDashboardItems(photographerDashboardItems);
    }
  };

  const getModelDetails = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      user_id: JSON?.parse(userId),
    };
    let res = await dispatch(getUserDetail(body));
    if (res?.status == 200) {
      setUserData(res?.results);
    }
  };

  const freelancerDashboardItems = [
    {
      key: 1,
      icon: "home",
      title: "Back To Home",
      path: routeName?.HOME_STACKS,
      show: true,
      color: Colors?.black,
    },
    {
      key: 0,
      image:
        userData?.profile_image &&
        userData?.profile_image?.length != 0 &&
        userData?.profile_image[0] &&
        userData?.profile_image[0]?.guid
          ? {
              uri: userData?.profile_image[0]?.guid,
            }
          : Images?.dummyUser,

      title: "My Profile",
      viewText: "View My Profile",
      path: routeName?.MODEL_PROFILE,
      params: {
        userId: userData?.user_data?.user_id,
      },
      user: true,
      show: true,
    },
    {
      key: 2,
      icon: "calendar-alt",
      title: "Manage Avalibility",
      viewText: "View",
      path: routeName?.MANAGE_AVAILABLITY,
      show: true,
      color: Colors?.darkgrey,
    },
    {
      key: 3,
      icon: "envelope-open-text",
      title: "Inbox",
      viewText: "Tap to view",
      path: routeName?.INBOX,
      show: true,
      color: Colors?.blue,
    },
    {
      key: 5,
      icon: "stopwatch",
      title: "Packages",
      viewText: "View More",
      span: "Upgrade Now",
      path: routeName?.PACKAGES,
      show: paymentStatus ? true : false,
      color: Colors?.darkYellow,
    },
    {
      key: 7,
      icon: "bookmark",
      title: "View Saved Collection",
      viewText: "Tap to view",
      path: routeName?.SAVED_JOB_DETAILS,
      show: true,
      color: Colors?.orange,
    },
    {
      key: 8,
      icon: "heart",
      title: "Follow Details",
      viewText: "View Followers",
      path: routeName?.FOLLOW_DETAILS,
      show: true,
      color: Colors?.red,
    },
    {
      key: 8,
      icon: "images",
      title: "Manage Social Posts",
      path: routeName?.MANAGE_SOCIAL_POSTS,
      show: true,
      color: Colors?.pink,
    },
    {
      key: 8,
      icon: "file-image",
      title: "Manage Portfolio",
      path: routeName?.MANAGE_PORTFOLIOS,
      show: true,
      color: Colors?.themeColor,
    },
    {
      key: 8,
      icon: "suitcase",
      title: "Manage Jobs",
      path: routeName?.MANAGE_PROJECTS,
      show: true,
      color: Colors?.yellow,
    },
    {
      key: 8,
      icon: "user-cog",
      title: "Manage Account",
      path: routeName?.MANAGE_ACCOUNT,
      show: true,
      color: Colors?.blue,
    },
  ];
  const photographerDashboardItems = [
    {
      key: 1,
      icon: Images?.homeIcon,
      title: "Back To Home",
      path: routeName?.HOME_STACKS,
      show: true,
    },
    {
      key: 0,
      image:
        userData?.profile_image &&
        userData?.profile_image?.length != 0 &&
        userData?.profile_image[0] &&
        userData?.profile_image[0]?.guid
          ? {
              uri: userData?.profile_image[0]?.guid,
            }
          : Images?.dummyUser,

      title: "My Profile",
      viewText: "View My Profile",
      path: routeName?.PHOTOGRAPHER_USER_PROFILE,
      user: true,
      show: true,
    },
    {
      key: 2,
      icon: "calendar-alt",
      title: "Manage Avalibility",
      viewText: "View",
      path: routeName?.MANAGE_AVAILABLITY,
      show: true,
      color: Colors?.darkgrey,
    },
    {
      key: 3,
      icon: "envelope-open-text",
      title: "Inbox",
      viewText: "Tap to view",
      path: routeName?.INBOX,
      show: true,
      color: Colors?.blue,
    },
    {
      key: 5,
      icon: "stopwatch",
      title: "Packages",
      viewText: "View More",
      span: "Upgrade Now",
      path: routeName?.PACKAGES,
      show: paymentStatus ? true : false,
      color: Colors?.darkYellow,
    },
    {
      key: 7,
      icon: Images?.heart,
      title: "View Saved Jobs",
      viewText: "Tap to view",
      path: routeName?.SAVED_JOB_DETAILS,
      show: true,
    },
    {
      key: 8,
      icon: Images?.heart,
      title: "Follow Details",
      viewText: "View Followers",
      path: routeName?.FOLLOW_DETAILS,
      show: true,
    },
  ];

  const emloyerDashboardItems = [
    {
      key: 1,
      icon: "home",
      title: "Back To Home",
      path: routeName?.HOME_STACKS,
      show: true,
      color: Colors?.black,
    },
    {
      key: 0,
      image:
        userData?.profile_image &&
        userData?.profile_image?.length != 0 &&
        userData?.profile_image[0] &&
        userData?.profile_image[0]?.guid
          ? {
              uri: userData?.profile_image[0]?.guid,
            }
          : Images?.dummyUser,
      title: "My Profile",
      viewText: "View My Profile",
      path: routeName?.CLIENT_PROFILE,
      params: { userId: userData?.user_data?.user_id },
      user: true,
      show: true,
    },

    {
      key: 3,
      icon: "envelope-open-text",
      title: "Inbox",
      viewText: "Tap to view",
      path: routeName?.INBOX,
      show: true,
      color: Colors?.blue,
    },
    {
      key: 4,
      icon: "file-alt",
      title: "Latest Proposals",
      viewText: "Tap to view",
      path: routeName?.MANAGE_JOBS,
      show: true,
      color: Colors?.pink,
    },

    {
      key: 7,
      icon: "bookmark",
      title: "View Saved Collection",
      viewText: "Tap to view",
      path: routeName?.SAVED_JOB_DETAILS,
      show: true,
      color: Colors?.orange,
    },
    {
      key: 8,
      icon: "heart",
      title: "Follow Details",
      viewText: "View Followers",
      path: routeName?.FOLLOW_DETAILS,
      show: true,
      color: Colors?.red,
    },

    {
      key: 12,
      icon: "suitcase",
      title: "Posted Jobs",
      viewText: "Tap to view",
      path: routeName?.MANAGE_JOBS,
      show: true,
      color: Colors?.themeColor,
    },
    {
      key: 12,
      icon: "podcast",
      title: "Post Casting Call",
      viewText: "Tap to post a casting call",
      path: routeName?.CASTING_CALLS,
      show: true,
      color: Colors?.yellow,
    },
    {
      key: 8,
      icon: "user-cog",
      title: "Manage Account",
      path: routeName?.MANAGE_ACCOUNT,
      show: true,
      color: Colors?.blue,
    },
  ];

  const getRandomColor = () => {
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };

  return (
    <>
      <DashboardHeader navigation={navigation} />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff",  }}
      >
        <FlatList
          data={dashboardItems}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 12,
          }}
          contentContainerStyle={{
            paddingVertical: 12,
            paddingBottom: 100,
          }}
          style={{ flex: 1, backgroundColor: Colors?.white }}
          renderItem={({ item }) =>
            item?.show ? (
              <TouchableOpacity
                onPress={() => navigation?.navigate(item?.path, item?.params)}
                style={{
                  flex: 1,
                  margin: 8,
                  padding: 18,
                  borderRadius: 16,
                  backgroundColor: getRandomColor(),
                  alignItems: "center",
                  ...Styles.shadow,
                }}
              >
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 30,
                    backgroundColor: Colors?.white,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  {item?.image ? (
                    <Image
                      source={item?.image}
                      style={{
                        width: 52,
                        height: 52,
                        resizeMode: "cover",
                        borderRadius: 80,
                      }}
                    />
                  ) : (
                    <FontAwesome5
                      name={item?.icon}
                      size={26}
                      color={item?.color}
                    />
                  )}
                  {/* {item?.key == 0 ? (
                    <Image
                      source={item?.icon}
                      style={{
                        width: 55,
                        height: 55,
                        resizeMode: "cover",
                        borderRadius: 80,
                      }}
                    />
                  ) : (
                    <Image
                      source={item?.icon}
                      style={{
                        width: 28,
                        height: 28,
                        resizeMode: "contain",
                      }}
                    />
                  )} */}
                </View>

                <TextComponent
                  text={item?.title}
                  size={Sizes?.s}
                  fontWeight="600"
                  color={Colors?.black}
                  style={{ textAlign: "center" }}
                />
              </TouchableOpacity>
            ) : null
          }
        />
      </SafeAreaView>
    </>
  );
};

const styling = StyleSheet.create({
  emailView: {
    backgroundColor: Colors?.yellow,
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    justifyContent: "space-around",
  },
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors?.themeColor,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
});
